/**
 * Scheme and Evidence Agent Unit Tests
 * Tests OpenSearch candidate retrieval, BM25 ranking, state filtering, and statutory evidence generation.
 *
 * Run: node --test tests/schemeAgent.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  runSchemeAgent,
  runEligibilityAgent,
  runEvidenceAgent,
  runRecommendationAgent,
  runOrchestratorPipeline
} from '../services/strandsAgents.js';

describe('Scheme Agent (OpenSearch BM25 & Semantic Retrieval)', () => {
  it('retrieves schemes relevant to UP resident student', () => {
    const profile = { state: 'Uttar Pradesh', age: 21, family_income_annual: 200000, education_level: 'Undergraduate' };
    const schemes = runSchemeAgent(profile, 'UP scholarship college student', 'Education');
    
    assert.ok(schemes.length > 0, 'Should return at least one candidate scheme');
    const topScheme = schemes[0];
    assert.ok(
      topScheme.scheme_id === 'UP_SCHOLARSHIP_2024' || topScheme.scheme_id === 'UP_SCHOLARSHIP' || topScheme.state === 'Uttar Pradesh' || topScheme.state === 'Central',
      'Top candidate should be relevant to UP or Central'
    );
  });

  it('filters by category when specified', () => {
    const profile = { state: 'Maharashtra', age: 40, family_income_annual: 150000 };
    const agricultureSchemes = runSchemeAgent(profile, 'farmer subsidy', 'Agriculture');
    
    assert.ok(agricultureSchemes.length > 0);
    for (const scheme of agricultureSchemes) {
      assert.equal(scheme.category.toLowerCase(), 'agriculture', `Expected Agriculture category, got ${scheme.category}`);
    }
  });

  it('prioritizes state domicile matching', () => {
    const profile = { state: 'Bihar', age: 25, family_income_annual: 300000 };
    const schemes = runSchemeAgent(profile, 'higher education support');
    
    // Central and Bihar schemes should rank high
    assert.ok(schemes.length > 0);
    const nonCentralOtherState = schemes.find(s => s.state && s.state !== 'Central' && s.state !== 'All India' && s.state !== 'Bihar');
    if (nonCentralOtherState) {
      const topState = schemes[0].state;
      assert.ok(topState === 'Central' || topState === 'All India' || topState === 'Bihar');
    }
  });
});

describe('Evidence Agent (Statutory Citations)', () => {
  it('generates statutory citations and legal justification for eligible candidates', () => {
    const candidateSchemes = [{
      scheme_id: 'TEST_SCHEME',
      scheme_name: 'National Merit Scholarship',
      category: 'Education',
      state: 'Central',
      max_age: 30,
      income_ceiling: 500000,
      eligibility_text: 'Statutory Gazette Notification 2024/EDU/54'
    }];
    const profile = { age: 22, family_income_annual: 250000, state: 'Delhi' };
    const evaluated = runEligibilityAgent(candidateSchemes, profile, ['income_certificate']);
    const withEvidence = runEvidenceAgent(evaluated, profile);

    assert.equal(withEvidence.length, 1);
    const item = withEvidence[0];
    assert.ok(item.why_eligible, 'Should have why_eligible explanation');
    assert.ok(item.evidenceExplanation, 'Should have evidenceExplanation object');
    assert.ok(item.evidenceExplanation.statutoryCitation.includes('Gazette Notification 2024'));
    assert.equal(item.evidenceExplanation.verifiedByCedar, true);
  });
});

describe('Recommendation Agent (Bundling & Combinations)', () => {
  it('builds synergy combination bundles without duplicate categories', () => {
    const candidateSchemes = [
      {
        scheme_id: 'SCHEME_EDU_1',
        scheme_name: 'Scholarship 1',
        category: 'Education',
        benefit_amount: 50000,
        evaluation: { eligibilityScore: 90, status: 'ELIGIBLE', missingDocuments: [], criteriaResults: [] }
      },
      {
        scheme_id: 'SCHEME_HLTH_1',
        scheme_name: 'Health Cover',
        category: 'Healthcare',
        benefit_amount: 500000,
        evaluation: { eligibilityScore: 85, status: 'ELIGIBLE', missingDocuments: [], criteriaResults: [] }
      }
    ];

    const recommendation = runRecommendationAgent(candidateSchemes);
    assert.ok(recommendation.scheme_combinations.length > 0);
    assert.equal(recommendation.recommendedBundle.schemes.length, 2);
    assert.equal(recommendation.recommendedBundle.totalAnnualFinancialUnlock, 550000);
  });
});

describe('Full Orchestrator Pipeline', () => {
  it('executes end-to-end multi-agent pipeline with correct profile and candidate scoring', () => {
    const query = "I am a 25-year-old postgraduate student from Bihar with family income 6 lakh";
    const result = runOrchestratorPipeline({ query });

    assert.equal(result.success, true);
    assert.equal(result.extracted_profile.age, 25);
    assert.equal(result.extracted_profile.income, 600000);
    assert.equal(result.extracted_profile.education, 'Postgraduate');
    assert.equal(result.extracted_profile.state, 'Bihar');
    assert.ok(result.schemes.length > 0);
    assert.ok(result.telemetryLogs.length >= 5, 'Should log telemetry for each agent stage');
  });
});
