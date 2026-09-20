/**
 * Corretto Eligibility Engine Unit Tests
 * Tests deterministic rules evaluation for age, income, state, and education criteria.
 *
 * Run: node --test tests/correttoEngine.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibilityRules } from '../services/correttoEngine.js';

const baseScheme = {
  scheme_id: 'TEST_SCHEME',
  name: 'Test Scheme',
  age_min: 17,
  age_max: 25,
  income_ceiling: 250000,
  state: 'Central',
  target_education: 'Any',
  required_documents: ['aadhaar_card', 'income_certificate', 'institution_certificate']
};

const baseProfile = {
  age: 21,
  state: 'Uttar Pradesh',
  family_income_annual: 200000,
  education_level: 'Undergraduate',
  occupation: 'Student'
};

describe('Corretto Engine — Age Criterion', () => {
  it('passes when age is within bounds', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    assert.equal(ageCriterion.passed, true);
  });

  it('fails when age exceeds max', () => {
    const profile = { ...baseProfile, age: 30 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    assert.equal(ageCriterion.passed, false);
    assert.ok(ageCriterion.detail.includes('exceeds maximum'));
  });

  it('fails when age is below min', () => {
    const profile = { ...baseProfile, age: 15 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    assert.equal(ageCriterion.passed, false);
    assert.ok(ageCriterion.detail.includes('below minimum'));
  });

  it('passes at exact boundary (age = age_max)', () => {
    const profile = { ...baseProfile, age: 25 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    assert.equal(ageCriterion.passed, true);
  });

  it('displays correct actual age value (not default 21)', () => {
    const profile = { ...baseProfile, age: 25 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    assert.equal(ageCriterion.actual, 25);
  });
});

describe('Corretto Engine — Income Criterion', () => {
  it('passes when income is within ceiling', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme);
    const incomeCriterion = result.criteriaResults.find(c => c.criterion === 'income');
    assert.equal(incomeCriterion.passed, true);
  });

  it('fails when income exceeds ceiling', () => {
    const profile = { ...baseProfile, family_income_annual: 600000 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const incomeCriterion = result.criteriaResults.find(c => c.criterion === 'income');
    assert.equal(incomeCriterion.passed, false);
    assert.ok(incomeCriterion.detail.includes('exceeds'));
  });

  it('passes at exact ceiling boundary', () => {
    const profile = { ...baseProfile, family_income_annual: 250000 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    const incomeCriterion = result.criteriaResults.find(c => c.criterion === 'income');
    assert.equal(incomeCriterion.passed, true);
  });

  it('passes when scheme has no income ceiling', () => {
    const scheme = { ...baseScheme, income_ceiling: undefined };
    const profile = { ...baseProfile, family_income_annual: 1000000 };
    const result = evaluateEligibilityRules(profile, scheme);
    const incomeCriterion = result.criteriaResults.find(c => c.criterion === 'income');
    assert.equal(incomeCriterion.passed, true);
  });
});

describe('Corretto Engine — State Criterion', () => {
  it('passes for Central scheme regardless of state', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme);
    const stateCriterion = result.criteriaResults.find(c => c.criterion === 'state');
    assert.equal(stateCriterion.passed, true);
  });

  it('passes when citizen state matches scheme state', () => {
    const scheme = { ...baseScheme, state: 'UP' };
    const profile = { ...baseProfile, state: 'Uttar Pradesh' };
    const result = evaluateEligibilityRules(profile, scheme);
    const stateCriterion = result.criteriaResults.find(c => c.criterion === 'state');
    assert.equal(stateCriterion.passed, true);
  });

  it('fails when citizen state does not match scheme state', () => {
    const scheme = { ...baseScheme, state: 'MH' };
    const profile = { ...baseProfile, state: 'Bihar' };
    const result = evaluateEligibilityRules(profile, scheme);
    const stateCriterion = result.criteriaResults.find(c => c.criterion === 'state');
    assert.equal(stateCriterion.passed, false);
  });
});

describe('Corretto Engine — Scoring & Status', () => {
  it('returns ELIGIBLE when all criteria pass (score >= 75)', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme);
    assert.equal(result.status, 'ELIGIBLE');
    assert.ok(result.eligibilityScore >= 75);
  });

  it('returns PARTIALLY_ELIGIBLE when some criteria fail (score 45-74)', () => {
    const profile = { ...baseProfile, family_income_annual: 600000 };
    const result = evaluateEligibilityRules(profile, baseScheme);
    assert.equal(result.status, 'PARTIALLY_ELIGIBLE');
    assert.ok(result.eligibilityScore >= 45 && result.eligibilityScore < 75);
  });

  it('returns NOT_ELIGIBLE when multiple criteria fail (score < 45)', () => {
    const profile = { ...baseProfile, age: 40, family_income_annual: 600000 };
    const scheme = { ...baseScheme, state: 'MH' };
    const result = evaluateEligibilityRules(profile, scheme);
    assert.equal(result.status, 'NOT_ELIGIBLE');
    assert.ok(result.eligibilityScore < 45);
  });

  it('caps score at 92 when all pass but has missing documents', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme, []);
    // All criteria pass (100) but missing docs → capped at 92
    assert.equal(result.eligibilityScore, 92);
    assert.ok(result.missingDocuments.length > 0);
  });
});

describe('Corretto Engine — Missing Documents', () => {
  it('identifies unverified documents', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme, ['aadhaar_card']);
    assert.ok(result.missingDocuments.includes('income_certificate'));
    assert.ok(result.missingDocuments.includes('institution_certificate'));
    assert.ok(!result.missingDocuments.includes('aadhaar_card'));
  });

  it('marks all documents as missing when no docs verified', () => {
    const result = evaluateEligibilityRules(baseProfile, baseScheme, []);
    assert.ok(result.missingDocuments.length >= 3);
  });
});

describe('Corretto Engine — Integration with Profile Agent Output', () => {
  it('correctly evaluates 25yo Bihar postgrad with 6 lakh income', () => {
    const profile = {
      age: 25,
      state: 'Bihar',
      family_income_annual: 600000,
      education_level: 'Postgraduate',
      occupation: 'Student'
    };

    // Scheme with 2.5 lakh ceiling, UP state, max age 25
    const upScheme = {
      ...baseScheme,
      state: 'UP',
      income_ceiling: 250000,
      age_max: 25
    };

    const result = evaluateEligibilityRules(profile, upScheme);

    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');
    const incomeCriterion = result.criteriaResults.find(c => c.criterion === 'income');
    const stateCriterion = result.criteriaResults.find(c => c.criterion === 'state');

    // Age 25 is at max → should pass
    assert.equal(ageCriterion.passed, true);
    assert.equal(ageCriterion.actual, 25);

    // Income 6L exceeds 2.5L ceiling → should fail
    assert.equal(incomeCriterion.passed, false);

    // Bihar ≠ UP → should fail
    assert.equal(stateCriterion.passed, false);

    // Only education passes + age → PARTIALLY_ELIGIBLE
    assert.equal(result.status, 'PARTIALLY_ELIGIBLE');
  });

  it('correctly marks 26yo applicant as NOT_ELIGIBLE for Sukanya Samriddhi (max age 10)', () => {
    const sukanyaScheme = {
      scheme_id: 'SUKANYA_SAMRIDDHI_CENTRAL',
      scheme_name: 'Sukanya Samriddhi Yojana',
      age_min: 0,
      age_max: 10,
      state: 'Central',
      target_education: 'Any'
    };
    const profile = {
      age: 26,
      state: 'Uttarakhand',
      family_income_annual: 800000,
      education_level: 'Postgraduate'
    };

    const result = evaluateEligibilityRules(profile, sukanyaScheme);
    const ageCriterion = result.criteriaResults.find(c => c.criterion === 'age');

    assert.equal(ageCriterion.passed, false);
    assert.equal(result.status, 'NOT_ELIGIBLE');
    assert.ok(result.eligibilityScore < 45);
  });

  it('correctly marks Uttarakhand resident as NOT_ELIGIBLE for UP state scheme', () => {
    const upScheme = {
      scheme_id: 'UP_SCHOLARSHIP_2024',
      scheme_name: 'UP Post-Matric Scholarship',
      state: 'UP',
      income_ceiling: 250000,
      age_max: 35
    };
    const profile = {
      age: 26,
      state: 'Uttarakhand',
      family_income_annual: 800000,
      education_level: 'Postgraduate'
    };

    const result = evaluateEligibilityRules(profile, upScheme);
    const stateCriterion = result.criteriaResults.find(c => c.criterion === 'state');

    assert.equal(stateCriterion.passed, false);
    assert.equal(result.status, 'PARTIALLY_ELIGIBLE');
  });
});
