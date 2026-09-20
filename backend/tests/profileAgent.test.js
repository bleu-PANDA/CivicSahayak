/**
 * Profile Agent Unit Tests
 * Tests age, income, state, education, gender, and category extraction
 * from natural language citizen queries.
 *
 * Run: node --test tests/profileAgent.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runProfileAgent } from '../services/strandsAgents.js';

describe('Profile Agent — Age Extraction', () => {
  const cases = [
    // Hyphenated formats
    ['I am a 25-year-old student', 25],
    ['30-yr-old farmer from Rajasthan', 30],
    ['18-year-old', 18],

    // Whitespace formats
    ['25 year old postgraduate student', 25],
    ['I am 35 years old', 35],

    // Shorthand
    ['21yo UP student', 21],
    ['a 22 yr student', 22],

    // Contractions
    ["I'm 25 and from Bihar", 25],
    ["i'm 19, student", 19],

    // "I am" format
    ['I am 25 from Bihar', 25],
    ['I am a 28 year old farmer', 28],

    // "aged" format
    ['aged 30 farmer from MP', 30],
    ['student aged 22 from UP', 22],

    // "age is" format
    ['my age is 25', 25],
    ['age 21', 21],

    // Default fallback
    ['student from UP', 21],
  ];

  for (const [query, expectedAge] of cases) {
    it(`"${query}" → age ${expectedAge}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.age, expectedAge, `Expected age ${expectedAge} from "${query}", got ${profile.age}`);
    });
  }
});

describe('Profile Agent — Income Extraction', () => {
  const cases = [
    // "X lakh" with prefix
    ['income 6 lakh', 600000],
    ['family income 2.5 lakh', 250000],
    ['salary 3 lakh', 300000],

    // Standalone "X lakh"
    ['student with 6 lakh', 600000],
    ['25yo student 2.5 lakh per year', 250000],

    // "X lakh income/salary"
    ['6 lakh income family', 600000],

    // Currency symbol
    ['income ₹250000', 250000],
    ['Rs 300000 income', 300000],

    // Default fallback
    ['student from UP', 250000],
  ];

  for (const [query, expectedIncome] of cases) {
    it(`"${query}" → income ${expectedIncome}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.income, expectedIncome, `Expected income ${expectedIncome} from "${query}", got ${profile.income}`);
    });
  }
});

describe('Profile Agent — State Extraction', () => {
  const cases = [
    ['student from Bihar', 'Bihar'],
    ['I am from Uttar Pradesh', 'Uttar Pradesh'],
    ['UP student', 'Uttar Pradesh'],
    ['living in Mumbai', 'Maharashtra'],
    ['from Rajasthan', 'Rajasthan'],
    ['Delhi vendor', 'Delhi'],
    ['from Patna', 'Bihar'],
    ['from Uttrakhand', 'Uttarakhand'],
    ['postgraduate student from Uttarakhand', 'Uttarakhand'],
    ['student in Dehradun', 'Uttarakhand'],
    // Default
    ['student looking for help', 'Uttar Pradesh'],
  ];

  for (const [query, expectedState] of cases) {
    it(`"${query}" → state ${expectedState}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.state, expectedState, `Expected state "${expectedState}" from "${query}", got "${profile.state}"`);
    });
  }
});

describe('Profile Agent — Education Extraction', () => {
  const cases = [
    ['postgraduate student', 'Postgraduate'],
    ['masters in engineering', 'Postgraduate'],
    ['undergraduate student from UP', 'Undergraduate'],
    ['btech student', 'Undergraduate'],
    ['diploma holder', 'Diploma'],
    ['class 12 student', 'Higher Secondary'],
    ['10th pass', 'Secondary'],
    ['PhD candidate', 'Postgraduate'],
  ];

  for (const [query, expectedEdu] of cases) {
    it(`"${query}" → education ${expectedEdu}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.education, expectedEdu, `Expected "${expectedEdu}" from "${query}", got "${profile.education}"`);
    });
  }
});

describe('Profile Agent — Occupation Extraction', () => {
  const cases = [
    ['I am a student', 'Student'],
    ['farmer from Bihar', 'Farmer'],
    ['street vendor in Delhi', 'Street Vendor'],
    ['artisan weaver', 'Artisan'],
    ['unemployed youth', 'Unemployed'],
  ];

  for (const [query, expectedOcc] of cases) {
    it(`"${query}" → occupation ${expectedOcc}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.occupation, expectedOcc, `Expected "${expectedOcc}" from "${query}", got "${profile.occupation}"`);
    });
  }
});

describe('Profile Agent — Gender Extraction', () => {
  const cases = [
    ['female student', 'Female'],
    ['single mother artisan', 'Female'],
    ['male farmer', 'Male'],
    ['student from UP', 'Any'],
  ];

  for (const [query, expectedGender] of cases) {
    it(`"${query}" → gender ${expectedGender}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.gender, expectedGender);
    });
  }
});

describe('Profile Agent — Social Category Extraction', () => {
  const cases = [
    ['SC student from UP', 'SC'],
    ['scheduled caste farmer', 'SC'],
    ['OBC student Bihar', 'OBC'],
    ['minority community student', 'Minority'],
    ['EWS family income 2.5 lakh', 'EWS'],
    ['general category student', 'General'],
  ];

  for (const [query, expectedCat] of cases) {
    it(`"${query}" → category ${expectedCat}`, () => {
      const profile = runProfileAgent(query);
      assert.equal(profile.category, expectedCat);
    });
  }
});

describe('Profile Agent — Full Query Integration', () => {
  it('parses "I am a 25-year-old postgraduate student from Bihar with family income 6 lakh"', () => {
    const profile = runProfileAgent('I am a 25-year-old postgraduate student from Bihar with family income 6 lakh');
    assert.equal(profile.age, 25);
    assert.equal(profile.state, 'Bihar');
    assert.equal(profile.income, 600000);
    assert.equal(profile.education, 'Postgraduate');
    assert.equal(profile.occupation, 'Student');
  });

  it('parses "21yo SC student from UP income 2.5 lakh"', () => {
    const profile = runProfileAgent('21yo SC student from UP income 2.5 lakh');
    assert.equal(profile.age, 21);
    assert.equal(profile.state, 'Uttar Pradesh');
    assert.equal(profile.income, 250000);
    assert.equal(profile.category, 'SC');
  });

  it('parses "I\'m a 30-yr-old female farmer from Rajasthan earning 1.5 lakh"', () => {
    const profile = runProfileAgent("I'm a 30-yr-old female farmer from Rajasthan earning 1.5 lakh");
    assert.equal(profile.age, 30);
    assert.equal(profile.state, 'Rajasthan');
    assert.equal(profile.occupation, 'Farmer');
    assert.equal(profile.gender, 'Female');
    assert.equal(profile.income, 150000);
  });
});
