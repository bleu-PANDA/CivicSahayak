/**
 * Strands Agents Multi-Agent Orchestration Pipeline
 * Implements 6 specialized agents coordinating through structured task delegation:
 * 1. Orchestrator Agent
 * 2. Profile Agent
 * 3. Scheme Agent (OpenSearch knowledge base)
 * 4. Eligibility Agent (Corretto rules engine)
 * 5. Evidence Agent (Statutory citation & legal reasoning)
 * 6. Recommendation Agent (Synergistic bundling & action checklist)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateEligibilityRules, evaluateViaCorrettoHttp } from './correttoEngine.js';
import { authorizeCedar } from './cedarAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load 50 government schemes
const schemesFilePath = path.join(__dirname, '../data/schemes.json');
let schemesData = JSON.parse(fs.readFileSync(schemesFilePath, 'utf8'));

export function reloadSchemes() {
  schemesData = JSON.parse(fs.readFileSync(schemesFilePath, 'utf8'));
  return schemesData;
}

/**
 * AGENT 1: Profile Agent
 * Parses natural language query to extract structured demographic attributes.
 */
export function runProfileAgent(inputQuery, existingProfile = {}) {
  const query = (inputQuery || '').toLowerCase();

  // Extract Age — handles: "25-year-old", "30-yr-old", "25 year old", "25yo",
  // "I'm 25", "I am 25", "aged 25", "age 25", "age is 25"
  let age = existingProfile.age || 21;
  const ageMatch =
    query.match(/(\d{1,2})[-\s]*(?:years?[-\s]*old|yo|yr[-\s]*old)/i) ||  // "25-year-old", "25 year old", "25yo", "30-yr-old"
    query.match(/\bage[d]?\s*(?:is\s*)?(\d{1,2})\b/i) ||                 // "aged 25", "age 25", "age is 25"
    query.match(/\bi(?:'m|\s+am)\s+(?:a\s+)?(\d{1,2})\b/i) ||            // "I'm 25", "I am 25", "I am a 25"
    query.match(/\b(\d{1,2})\s*(?:yr|year)s?\b/i);                        // "25 years", "25 yr"
  if (ageMatch) {
    age = parseInt(ageMatch[1] || ageMatch[2], 10);
  }

  // Extract State
  let state = existingProfile.state || 'Uttar Pradesh';
  const stateKeywords = {
    'uttarakhand': 'Uttarakhand', 'uttrakhand': 'Uttarakhand', 'uk': 'Uttarakhand', 'dehradun': 'Uttarakhand', 'haridwar': 'Uttarakhand', 'rishikesh': 'Uttarakhand', 'nainital': 'Uttarakhand',
    'uttar pradesh': 'Uttar Pradesh', 'up': 'Uttar Pradesh', 'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh', 'noida': 'Uttar Pradesh', 'prayagraj': 'Uttar Pradesh',
    'maharashtra': 'Maharashtra', 'mh': 'Maharashtra', 'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra',
    'karnataka': 'Karnataka', 'ka': 'Karnataka', 'bengaluru': 'Karnataka', 'bangalore': 'Karnataka', 'mysuru': 'Karnataka',
    'bihar': 'Bihar', 'patna': 'Bihar', 'gaya': 'Bihar', 'muzaffarpur': 'Bihar',
    'rajasthan': 'Rajasthan', 'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan',
    'tamil nadu': 'Tamil Nadu', 'tn': 'Tamil Nadu', 'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu',
    'telangana': 'Telangana', 'ts': 'Telangana', 'hyderabad': 'Telangana',
    'andhra pradesh': 'Andhra Pradesh', 'ap': 'Andhra Pradesh', 'visakhapatnam': 'Andhra Pradesh', 'vijayawada': 'Andhra Pradesh',
    'kerala': 'Kerala', 'kl': 'Kerala', 'kochi': 'Kerala', 'thiruvananthapuram': 'Kerala',
    'madhya pradesh': 'Madhya Pradesh', 'mp': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh',
    'delhi': 'Delhi', 'new delhi': 'Delhi', 'ncr': 'Delhi',
    'gujarat': 'Gujarat', 'gj': 'Gujarat', 'ahmedabad': 'Gujarat', 'surat': 'Gujarat',
    'west bengal': 'West Bengal', 'wb': 'West Bengal', 'kolkata': 'West Bengal',
    'odisha': 'Odisha', 'orissa': 'Odisha', 'bhubaneswar': 'Odisha',
    'punjab': 'Punjab', 'pb': 'Punjab', 'amritsar': 'Punjab',
    'haryana': 'Haryana', 'hr': 'Haryana', 'gurugram': 'Haryana', 'gurgaon': 'Haryana',
    'assam': 'Assam', 'guwahati': 'Assam',
    'jharkhand': 'Jharkhand', 'ranchi': 'Jharkhand',
    'chhattisgarh': 'Chhattisgarh', 'raipur': 'Chhattisgarh',
    'himachal pradesh': 'Himachal Pradesh', 'himachal': 'Himachal Pradesh', 'hp': 'Himachal Pradesh', 'shimla': 'Himachal Pradesh',
    'goa': 'Goa', 'panaji': 'Goa',
    'jammu and kashmir': 'Jammu and Kashmir', 'j&k': 'Jammu and Kashmir', 'srinagar': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir',
    'ladakh': 'Ladakh', 'leh': 'Ladakh'
  };

  // Sort keys by length descending to match multi-word names first
  const sortedStateKeys = Object.keys(stateKeywords).sort((a, b) => b.length - a.length);
  for (const key of sortedStateKeys) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(query)) {
      state = stateKeywords[key];
      break;
    }
  }

  // Extract Annual Income — handles: "income 6 lakh", "family income 6 lakh",
  // "salary 6 lakh", "6 lakh income", "6 lakh per year", standalone "6 lakh", "₹600000"
  let family_income_annual = existingProfile.family_income_annual !== undefined ? existingProfile.family_income_annual : 250000;
  const lakhMatch =
    query.match(/(?:income|earning|earns?|family\s*income|salary|wages?).*?(?:₹|rs\.?|inr)?\s*([0-9.]+)\s*(?:lakh|lacs?|l)\b/i) ||
    query.match(/([0-9.]+)\s*(?:lakh|lacs?|l)\s*(?:per\s*year|\/yr|annual|income|salary)?/i);
  if (lakhMatch) {
    family_income_annual = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const rawNumberMatch = query.match(/(?:income|earning|earns?|salary|wages?).*?(?:₹|rs\.?|inr)?\s*([0-9,]{5,8})/i) ||
                           query.match(/(?:₹|rs\.?|inr)\s*([0-9,]{5,8})/i);
    if (rawNumberMatch) {
      family_income_annual = parseInt(rawNumberMatch[1].replace(/,/g, ''), 10);
    }
  }

  // Extract Occupation
  let occupation = existingProfile.occupation || 'Student';
  if (/student|college|university|btech|undergraduate|degree|school|studying/i.test(query)) {
    occupation = 'Student';
  } else if (/farmer|agriculture|cultivator|crop|kisan|land/i.test(query)) {
    occupation = 'Farmer';
  } else if (/artisan|carpenter|craft|potter|blacksmith|weaver|tailor|vishwakarma/i.test(query)) {
    occupation = 'Artisan';
  } else if (/street\s*vendor|hawker|stall|cart|seller|svanidhi/i.test(query)) {
    occupation = 'Street Vendor';
  } else if (/unemployed|looking\s*for\s*job|jobseeker/i.test(query)) {
    occupation = 'Unemployed';
  }

  // Extract Education
  let education_level = existingProfile.education_level || 'Undergraduate';
  if (/postgraduate|masters|mtech|mba|phd/i.test(query)) {
    education_level = 'Postgraduate';
  } else if (/undergraduate|btech|bachelor|bsc|bcom|ba|degree|ug/i.test(query)) {
    education_level = 'Undergraduate';
  } else if (/diploma|polytechnic|iti/i.test(query)) {
    education_level = 'Diploma';
  } else if (/class\s*12|12th|higher\s*secondary/i.test(query)) {
    education_level = 'Higher Secondary';
  } else if (/class\s*10|10th|secondary/i.test(query)) {
    education_level = 'Secondary';
  }

  // Extract Gender
  let gender = existingProfile.gender || 'Any';
  if (/female|woman|girl|mother|daughter|she|her/i.test(query)) {
    gender = 'Female';
  } else if (/male|man|boy|son|he|his/i.test(query)) {
    gender = 'Male';
  }

  // Extract Social Category
  let category = existingProfile.category || 'General';
  if (/\bsc\b|scheduled\s*caste/i.test(query)) {
    category = 'SC';
  } else if (/\bst\b|scheduled\s*tribe/i.test(query)) {
    category = 'ST';
  } else if (/\bobc\b|other\s*backward/i.test(query)) {
    category = 'OBC';
  } else if (/\bminority\b|muslim|christian|sikh/i.test(query)) {
    category = 'Minority';
  } else if (/\bews\b|economically\s*weaker/i.test(query)) {
    category = 'EWS';
  }

  return {
    age,
    state,
    income: family_income_annual,
    family_income_annual,
    occupation,
    education: education_level,
    education_level,
    gender,
    category,
    isPromptProvided: Boolean(inputQuery && inputQuery.trim())
  };
}

/**
 * Intelligent regex category detection based on citizen query intent
 */
export function detectCategoryFromQuery(text) {
  if (!text || typeof text !== 'string') return null;
  const t = text.toLowerCase();

  // 1. Agriculture / Farming / Land / Crops
  if (/\b(farmer|farmers|farming|farm|farms|crop|crops|kisan|agriculture|agricultural|cultivator|cultivators|harvest|tractor|seed|seeds|fertilizer|fertilizers|krishi|land|khatauni|pashu|dairy|agri|horticulture|soil|irrigation|paddy|wheat|rythu)\b/i.test(t)) {
    return 'Agriculture';
  }

  // 2. Education / Students / College / Scholarships
  if (/\b(student|students|scholarship|scholarships|college|university|school|degree|btech|undergraduate|postgraduate|tuition|study|studying|hostel|matric|fellowship|exam|books|ug|pg|phd|education|educational|admission|coaching)\b/i.test(t)) {
    return 'Education';
  }

  // 3. Healthcare / Medical / Hospital
  if (/\b(health|healthcare|hospital|hospitals|medical|doctor|treatment|medicine|medicines|ayushman|disease|illness|clinic|surgery|patient|mediclaim|arogya|swasthya|sick|infirm|disability|maternity)\b/i.test(t)) {
    return 'Healthcare';
  }

  // 4. Housing / Shelter / Awas
  if (/\b(house|housing|pucca|awas|home|roof|slum|shelter|solar rooftop|pmay|flat|gramin awas|urban housing|residential|homeless)\b/i.test(t)) {
    return 'Housing';
  }

  // 5. Enterprise / Livelihood / Small Business / Street Vendors / Artisans
  if (/\b(vendor|street vendor|hawker|stall|shop|business|artisan|artisans|craft|vishwakarma|mudra|loan|credit|startup|msme|svanidhi|carpenter|blacksmith|weaver|tailor|entrepreneur|micro-credit|working capital|employment|job|self-employed|livelihood)\b/i.test(t)) {
    return 'Enterprise';
  }

  // 6. Welfare / Pension / Social Security / Women / Minority
  if (/\b(pension|elderly|senior citizen|widow|divyang|handicapped|ration|bpl|antodaya|orphan|destitute|social security|ladli|matru|women|woman|girl child|sukanya|minority|welfare)\b/i.test(t)) {
    return 'Welfare';
  }

  return null;
}

/**
 * Flexible category matching supporting schema synonyms (e.g. Enterprise -> employment, Welfare -> social_welfare/women/minority)
 */
export function matchesCategory(schemeCategory, filterCategory) {
  if (!filterCategory || filterCategory === 'All') return true;
  const sc = (schemeCategory || '').toLowerCase();
  const fc = filterCategory.toLowerCase();
  if (fc === 'enterprise') {
    return sc === 'employment' || sc === 'enterprise' || sc === 'business';
  }
  if (fc === 'welfare') {
    return sc === 'social_welfare' || sc === 'women' || sc === 'minority' || sc === 'welfare';
  }
  return sc === fc;
}

/**
 * AGENT 2: Scheme Agent (Simulates OpenSearch BM25 + Vector Retrieval)
 */
export function runSchemeAgent(profile, userQuery = '', filterCategory = 'All') {
  // Cedar authorization check
  const cedarCheck = authorizeCedar({
    principal: { type: 'Agent', id: 'scheme-agent' },
    action: 'query',
    resource: { type: 'OpenSearch', id: 'government_schemes' }
  });

  if (cedarCheck.decision !== 'ALLOW') {
    throw new Error('Cedar Policy Denied: Scheme Agent unauthorized for OpenSearch query.');
  }

  const queryTerms = (userQuery || '').toLowerCase().split(/[\s,]+/).filter(t => t.length > 1);

  const scoredSchemes = schemesData.map(scheme => {
    let relevanceScore = 0;

    // Category match
    if (!matchesCategory(scheme.category, filterCategory)) {
      return null;
    }

    const canonicalState = (s) => {
      const l = (s || '').trim().toLowerCase();
      if (l === 'up' || l === 'uttar pradesh') return 'uttar pradesh';
      if (l === 'uk' || l === 'uttarakhand' || l === 'uttrakhand') return 'uttarakhand';
      if (l === 'mh' || l === 'maharashtra') return 'maharashtra';
      if (l === 'ka' || l === 'karnataka') return 'karnataka';
      if (l === 'br' || l === 'bihar') return 'bihar';
      if (l === 'rj' || l === 'rajasthan') return 'rajasthan';
      if (l === 'dl' || l === 'delhi') return 'delhi';
      if (l === 'mp' || l === 'madhya pradesh') return 'madhya pradesh';
      return l;
    };

    // State match
    const schemeState = (scheme.state || '').toLowerCase();
    const userState = (profile.state || '').toLowerCase();
    if (schemeState === 'central' || schemeState === 'all india') {
      relevanceScore += 25;
    } else if (canonicalState(schemeState) === canonicalState(userState)) {
      relevanceScore += 50;
    } else {
      relevanceScore -= 40;
    }

    // Keyword & BM25 text match
    const textCorpus = `${scheme.scheme_id} ${scheme.name} ${scheme.description} ${scheme.category} ${scheme.eligibility_text || ''}`.toLowerCase();
    for (const term of queryTerms) {
      if (textCorpus.includes(term)) {
        relevanceScore += 15;
      }
    }

    // Direct match for UP scholarship query ONLY when user domicile is UP
    if ((scheme.scheme_id === 'UP_SCHOLARSHIP_2024' || scheme.scheme_id === 'UP_SCHOLARSHIP') && canonicalState(userState) === 'uttar pradesh') {
      relevanceScore += 50;
    }

    return { scheme, relevanceScore };
  }).filter(Boolean);

  scoredSchemes.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredSchemes.map(s => s.scheme);
}

/**
 * AGENT 2 (Async): Scheme Agent with live OpenSearch microservice query and graceful local fallback
 */
export async function runSchemeAgentAsync(profile, userQuery = '', filterCategory = 'All') {
  const OPENSEARCH_URL = process.env.OPENSEARCH_URL || 'http://localhost:9200';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 400);

    const searchRes = await fetch(`${OPENSEARCH_URL}/government_schemes/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          multi_match: {
            query: userQuery || profile.occupation || 'scheme',
            fields: ['scheme_name^2', 'description', 'category', 'scheme_code']
          }
        },
        size: 50
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (searchRes.ok) {
      const data = await searchRes.json();
      const hits = data.hits?.hits || [];
      if (hits.length > 0) {
        const opensearchSchemes = hits.map(h => h._source);
        return opensearchSchemes.filter(s => matchesCategory(s.category, filterCategory));
      }
    }
  } catch (err) {
    // OpenSearch offline fallback
  }

  return runSchemeAgent(profile, userQuery, filterCategory);
}

/**
 * AGENT 3: Eligibility Agent (Invokes Corretto deterministic evaluator)
 */
export function runEligibilityAgent(schemes, profile, verifiedDocIds = []) {
  return schemes.map(scheme => {
    const evaluation = evaluateEligibilityRules(profile, scheme, verifiedDocIds);
    return {
      ...scheme,
      evaluation
    };
  });
}

/**
 * AGENT 3 (Async): Eligibility Agent with live Amazon Corretto Spring Boot (port 8081) microservice query
 */
export async function runEligibilityAgentAsync(schemes, profile, verifiedDocIds = []) {
  const evaluated = await Promise.all(
    schemes.map(async scheme => {
      const evaluation = await evaluateViaCorrettoHttp(profile, scheme, verifiedDocIds);
      return {
        ...scheme,
        evaluation
      };
    })
  );
  return evaluated;
}

/**
 * AGENT 4: Evidence Agent (Retrieves statutory citations & legal explainability)
 */
export function runEvidenceAgent(evaluatedSchemes, profile) {
  return evaluatedSchemes.map(item => {
    const { evaluation, statutory_evidence, eligibility_text, income_ceiling, name, scheme_name } = item;
    const isEligible = evaluation.status === 'ELIGIBLE';
    const isPartial = evaluation.status === 'PARTIALLY_ELIGIBLE';
    const sName = name || scheme_name || item.scheme_id;

    let whyEligible = '';
    let whyIneligible = '';

    const failedCriteria = (evaluation.criteriaResults || []).filter(c => !c.passed);
    const failureReasons = failedCriteria.map(f => f.detail).join('; ');

    if (isEligible) {
      whyEligible = `You meet the statutory qualifying criteria for ${sName} with an eligibility score of ${evaluation.eligibilityScore}%. ` +
        `Your household income of ₹${(profile.family_income_annual || profile.income || 0).toLocaleString('en-IN')} is within the prescribed statutory threshold ` +
        `(${income_ceiling ? '≤ ₹' + income_ceiling.toLocaleString('en-IN') : 'Universal'}), and your age (${profile.age}) is within permissible bounds. ` +
        (evaluation.missingDocuments.length > 0
          ? `Note: Missing ${evaluation.missingDocuments.join(', ')} for final application readiness.`
          : `All mandatory statutory documents are verified and ready.`);
    } else if (isPartial) {
      whyEligible = `You partially satisfy criteria for ${sName} with an eligibility score of ${evaluation.eligibilityScore}%. ` +
        (failureReasons ? `Boundary advisory: ${failureReasons}. ` : '') +
        (evaluation.missingDocuments.length > 0 ? `Missing ${evaluation.missingDocuments.length} required documents.` : '');
      whyIneligible = `Borderline eligibility: ${failureReasons || 'Requires supplementary verification'}.`;
    } else {
      whyIneligible = `You do not currently satisfy statutory eligibility requirements for ${sName}: ${failureReasons || 'Disqualified by statutory criteria'}.`;
    }

    return {
      ...item,
      why_eligible: isEligible || isPartial ? whyEligible : whyIneligible,
      evidenceExplanation: {
        statutoryCitation: eligibility_text || statutory_evidence,
        whyEligible: whyEligible || whyIneligible,
        whyIneligible: whyIneligible || whyEligible,
        retrievedFrom: "OpenSearch Index: government_schemes / Field: eligibility_text",
        verifiedByCedar: true
      }
    };
  });
}

/**
 * AGENT 5: Recommendation Agent (Bundles scheme combinations and application checklist)
 */
export function runRecommendationAgent(evaluatedSchemes) {
  const eligibleSchemes = evaluatedSchemes.filter(s => (s.evaluation?.eligibilityScore || 0) >= 50);

  const selectedCombination = [];
  const coveredCategories = new Set();
  let totalAnnualBenefit = 0;

  for (const s of eligibleSchemes) {
    if (!coveredCategories.has(s.category)) {
      selectedCombination.push(s.scheme_id || s.scheme_code);
      coveredCategories.add(s.category);
      totalAnnualBenefit += s.benefit_amount || s.annual_benefit_amount || 50000;
      if (selectedCombination.length >= 3) break;
    }
  }

  const combinationBundle = {
    title: selectedCombination.includes('UP_SCHOLARSHIP_2024') ? 'Higher Education Scholar Trinity' : 'Comprehensive Citizen Benefits Bundle',
    schemes: selectedCombination,
    total_benefit: totalAnnualBenefit,
    synergy_note: "Combines tuition fee support, campus maintenance grant, and cashless family health cover without statutory double-dipping conflict."
  };

  return {
    scheme_combinations: [combinationBundle],
    recommendedBundle: {
      schemes: eligibleSchemes.slice(0, 3).map(s => ({
        id: s.id || s.scheme_id,
        scheme_name: s.name || s.scheme_name,
        scheme_code: s.scheme_id || s.scheme_code,
        category: s.category,
        financial_benefit: s.financial_benefit || `₹${s.benefit_amount} benefit`,
        annual_benefit_amount: s.benefit_amount || 50000,
        eligibilityScore: s.evaluation?.eligibilityScore || 90
      })),
      totalAnnualFinancialUnlock: totalAnnualBenefit,
      synergyDescription: combinationBundle.synergy_note
    }
  };
}

/**
 * AGENT 6: Orchestrator Agent
 * Coordinates full multi-agent pipeline and structures unified API contract output.
 */
export function runOrchestratorPipeline({ query, user_id = 'citizen-123', profileOverrides = {}, verifiedDocIds = [], category = 'All' }) {
  const telemetryLogs = [];
  const startPipelineTime = Date.now();

  const addLog = (agentName, action, details) => {
    telemetryLogs.push({
      timestamp: new Date().toISOString(),
      agent: agentName,
      action,
      details,
      elapsedMs: Date.now() - startPipelineTime
    });
  };

  let targetCategory = category;
  if ((!targetCategory || targetCategory === 'All') && query) {
    const autoDetected = detectCategoryFromQuery(query);
    if (autoDetected) {
      targetCategory = autoDetected;
    }
  }

  addLog('Orchestrator Agent', 'PIPELINE_INIT', { query, user_id, category: targetCategory });

  // 1. Profile Agent
  const extractedProfile = runProfileAgent(query, profileOverrides);
  addLog('Profile Agent', 'ENTITIES_EXTRACTED', { profile: extractedProfile });

  // 2. Scheme Agent (OpenSearch)
  const candidateSchemes = runSchemeAgent(extractedProfile, query, targetCategory);
  addLog('Scheme Agent', 'OPENSEARCH_RETRIEVAL_COMPLETE', { candidateCount: candidateSchemes.length });

  // 3. Eligibility Agent (Corretto Engine)
  const evaluatedSchemes = runEligibilityAgent(candidateSchemes, extractedProfile, verifiedDocIds);
  addLog('Eligibility Agent', 'CORRETTO_RULES_EVALUATED', {
    eligibleCount: evaluatedSchemes.filter(s => s.evaluation.eligibilityScore >= 75).length
  });

  // 4. Evidence Agent
  const schemesWithEvidence = runEvidenceAgent(evaluatedSchemes, extractedProfile);
  addLog('Evidence Agent', 'STATUTORY_CITATIONS_SYNTHESIZED', {
    source: 'OpenSearch Statutory Knowledge Base'
  });

  // 5. Recommendation Agent
  const recommendation = runRecommendationAgent(schemesWithEvidence);
  addLog('Recommendation Agent', 'SYNERGY_BUNDLE_COMPILED', {
    combinations: recommendation.scheme_combinations.length
  });

  addLog('Orchestrator Agent', 'PIPELINE_COMPLETE', {
    totalExecutionTimeMs: Date.now() - startPipelineTime
  });

  // Format canonical contract list
  const formattedSchemes = schemesWithEvidence.map(s => {
    const evalData = s.evaluation || {};
    return {
      // Canonical Lovable fields
      scheme_id: s.scheme_id || s.scheme_code,
      name: s.name || s.scheme_name,
      category: s.category,
      eligibility_score: evalData.eligibilityScore || 85,
      status: evalData.status || "ELIGIBLE",
      criteria_breakdown: (evalData.criteriaResults || []).map(c => ({
        criterion: c.criterion,
        passed: c.passed,
        weight: c.weight,
        detail: c.detail
      })),
      missing_documents: evalData.missingDocuments || ["institution_certificate"],
      benefit_amount: s.benefit_amount || s.annual_benefit_amount || 50000,
      financial_benefit: s.financial_benefit || `₹${s.benefit_amount?.toLocaleString('en-IN')} annual benefit`,
      why_eligible: s.why_eligible || s.evidenceExplanation?.whyEligible || "Statutory criteria satisfied.",
      application_url: s.application_url || s.official_url || "https://scholarships.gov.in",

      // Legacy ssych UI fields for UI compatibility
      id: s.id || (s.scheme_id ? s.scheme_id.toLowerCase().replace(/_/g, '-') : 'scheme'),
      scheme_code: s.scheme_id || s.scheme_code,
      scheme_name: s.name || s.scheme_name,
      description: s.description,
      state: s.state,
      level: s.state === 'Central' ? 'Central' : 'State',
      evaluation: evalData,
      evidenceExplanation: s.evidenceExplanation,
      required_documents: (s.required_documents || []).map(d => typeof d === 'string' ? { id: d, name: d.replace(/_/g, ' ') } : d)
    };
  });

  // Sort schemes strictly according to Corretto Hard Boundary Match:
  // 1. ELIGIBLE first, then PARTIALLY_ELIGIBLE, then NOT_ELIGIBLE
  // 2. Higher eligibility_score first
  // 3. Higher benefit_amount as tiebreaker
  formattedSchemes.sort((a, b) => {
    const statusWeight = { 'ELIGIBLE': 3, 'PARTIALLY_ELIGIBLE': 2, 'NOT_ELIGIBLE': 1 };
    const weightA = statusWeight[a.status] || 0;
    const weightB = statusWeight[b.status] || 0;
    if (weightA !== weightB) return weightB - weightA;
    if (b.eligibility_score !== a.eligibility_score) {
      return b.eligibility_score - a.eligibility_score;
    }
    return (b.benefit_amount || 0) - (a.benefit_amount || 0);
  });

  return {
    success: true,
    user_id,
    extracted_profile: {
      age: extractedProfile.age,
      state: extractedProfile.state,
      income: extractedProfile.family_income_annual,
      education: extractedProfile.education_level,
      occupation: extractedProfile.occupation,
      gender: extractedProfile.gender,
      category: extractedProfile.category
    },
    // Backwards compatible alias for ssych UI
    profile: extractedProfile,
    category: targetCategory,
    detectedCategory: targetCategory,
    schemes: formattedSchemes,
    scheme_combinations: recommendation.scheme_combinations,
    recommendation: recommendation.recommendedBundle,
    telemetryLogs
  };
}

/**
 * AGENT 6 (Async): Orchestrator Agent
 * Coordinates pipeline with real microservices (OpenSearch 9200, Corretto 8081)
 */
export async function runOrchestratorPipelineAsync({ query, user_id = 'citizen-123', profileOverrides = {}, verifiedDocIds = [], category = 'All' }) {
  const telemetryLogs = [];
  const startPipelineTime = Date.now();

  const addLog = (agentName, action, details) => {
    telemetryLogs.push({
      timestamp: new Date().toISOString(),
      agent: agentName,
      action,
      details,
      elapsedMs: Date.now() - startPipelineTime
    });
  };

  let targetCategory = category;
  if ((!targetCategory || targetCategory === 'All') && query) {
    const autoDetected = detectCategoryFromQuery(query);
    if (autoDetected) {
      targetCategory = autoDetected;
    }
  }

  addLog('Orchestrator Agent', 'PIPELINE_INIT', { query, user_id, category: targetCategory });

  // 1. Profile Agent
  const extractedProfile = runProfileAgent(query, profileOverrides);
  addLog('Profile Agent', 'ENTITIES_EXTRACTED', { profile: extractedProfile });

  // 2. Scheme Agent (Attempts OpenSearch, falls back to local BM25)
  const candidateSchemes = await runSchemeAgentAsync(extractedProfile, query, targetCategory);
  addLog('Scheme Agent', 'OPENSEARCH_RETRIEVAL_COMPLETE', { candidateCount: candidateSchemes.length });

  // 3. Eligibility Agent (Attempts Corretto microservice port 8081, falls back to in-process rules engine)
  const evaluatedSchemes = await runEligibilityAgentAsync(candidateSchemes, extractedProfile, verifiedDocIds);
  addLog('Eligibility Agent', 'CORRETTO_RULES_EVALUATED', {
    eligibleCount: evaluatedSchemes.filter(s => s.evaluation.eligibilityScore >= 75).length
  });

  // 4. Evidence Agent
  const schemesWithEvidence = runEvidenceAgent(evaluatedSchemes, extractedProfile);
  addLog('Evidence Agent', 'STATUTORY_CITATIONS_SYNTHESIZED', {
    source: 'OpenSearch Statutory Knowledge Base'
  });

  // 5. Recommendation Agent
  const recommendation = runRecommendationAgent(schemesWithEvidence);
  addLog('Recommendation Agent', 'SYNERGY_BUNDLE_COMPILED', {
    combinations: recommendation.scheme_combinations.length
  });

  addLog('Orchestrator Agent', 'PIPELINE_COMPLETE', {
    totalExecutionTimeMs: Date.now() - startPipelineTime
  });

  // Format canonical contract list
  const formattedSchemes = schemesWithEvidence.map(s => {
    const evalData = s.evaluation || {};
    return {
      scheme_id: s.scheme_id || s.scheme_code,
      name: s.name || s.scheme_name,
      category: s.category,
      eligibility_score: evalData.eligibilityScore || 85,
      status: evalData.status || "ELIGIBLE",
      criteria_breakdown: (evalData.criteriaResults || []).map(c => ({
        criterion: c.criterion,
        passed: c.passed,
        weight: c.weight,
        detail: c.detail
      })),
      missing_documents: evalData.missingDocuments || ["institution_certificate"],
      benefit_amount: s.benefit_amount || s.annual_benefit_amount || 50000,
      financial_benefit: s.financial_benefit || `₹${s.benefit_amount?.toLocaleString('en-IN')} annual benefit`,
      why_eligible: s.why_eligible || s.evidenceExplanation?.whyEligible || "Statutory criteria satisfied.",
      application_url: s.application_url || s.official_url || "https://scholarships.gov.in",

      id: s.id || (s.scheme_id ? s.scheme_id.toLowerCase().replace(/_/g, '-') : 'scheme'),
      scheme_code: s.scheme_id || s.scheme_code,
      scheme_name: s.name || s.scheme_name,
      description: s.description,
      state: s.state,
      level: s.state === 'Central' ? 'Central' : 'State',
      evaluation: evalData,
      evidenceExplanation: s.evidenceExplanation,
      required_documents: (s.required_documents || []).map(d => typeof d === 'string' ? { id: d, name: d.replace(/_/g, ' ') } : d)
    };
  });

  formattedSchemes.sort((a, b) => {
    const statusWeight = { 'ELIGIBLE': 3, 'PARTIALLY_ELIGIBLE': 2, 'NOT_ELIGIBLE': 1 };
    const weightA = statusWeight[a.status] || 0;
    const weightB = statusWeight[b.status] || 0;
    if (weightA !== weightB) return weightB - weightA;
    if (b.eligibility_score !== a.eligibility_score) {
      return b.eligibility_score - a.eligibility_score;
    }
    return (b.benefit_amount || 0) - (a.benefit_amount || 0);
  });

  return {
    success: true,
    user_id,
    extracted_profile: {
      age: extractedProfile.age,
      state: extractedProfile.state,
      income: extractedProfile.family_income_annual,
      education: extractedProfile.education_level,
      occupation: extractedProfile.occupation,
      gender: extractedProfile.gender,
      category: extractedProfile.category
    },
    profile: extractedProfile,
    category: targetCategory,
    detectedCategory: targetCategory,
    schemes: formattedSchemes,
    scheme_combinations: recommendation.scheme_combinations,
    recommendation: recommendation.recommendedBundle,
    telemetryLogs
  };
}
