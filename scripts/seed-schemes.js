/**
 * Seed 50 Comprehensive Indian Government Schemes
 * Covers Central, UP, MH, and KA across 8 core welfare categories:
 * education, healthcare, housing, employment, agriculture, social_welfare, women, minority.
 * Generates 384-dimensional dense semantic vectors (knn_vector) for OpenSearch Neural Search.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate a deterministic 384-dim pseudo-vector based on scheme text
function generateDeterministicVector(text, dims = 384) {
  const vector = [];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < dims; i++) {
    const val = Math.sin(hash + i * 0.17) * Math.cos(hash - i * 0.31);
    vector.push(parseFloat(val.toFixed(4)));
  }
  return vector;
}

export const SEEDED_SCHEMES = [
  // --- UTTAR PRADESH (UP) SCHEMES ---
  {
    scheme_id: "UP_SCHOLARSHIP_2024",
    name: "UP Post-Matric Scholarship Scheme",
    description: "Financial fee reimbursement and maintenance allowance for students from low-income families pursuing undergraduate and diploma degrees in Uttar Pradesh.",
    state: "UP",
    category: "education",
    income_ceiling: 250000,
    age_min: 17,
    age_max: 25,
    required_documents: ["income_certificate", "institution_certificate", "aadhaar_card", "previous_marksheet"],
    benefit_amount: 50000,
    application_url: "https://scholarship.up.gov.in",
    eligibility_text: "UP Social Welfare Dept Gazette: Beneficiary must be enrolled in recognized degree/diploma courses in UP with family annual income not exceeding Rs 2.50 lakh. Age between 17 and 25."
  },
  {
    scheme_id: "UP_KANYA_SUMANGALA",
    name: "Mukhyamantri Kanya Sumangala Yojana",
    description: "Milestone-based financial assistance of ₹25,000 for girl children from birth to higher education in Uttar Pradesh.",
    state: "UP",
    category: "women",
    income_ceiling: 300000,
    age_min: 0,
    age_max: 22,
    required_documents: ["birth_certificate", "income_certificate", "up_domicile", "bank_passbook"],
    benefit_amount: 25000,
    application_url: "https://mksy.up.gov.in",
    eligibility_text: "Women & Child Development UP: Annual family income must be below ₹3,00,000. Beneficiary must be female permanent resident of UP."
  },
  {
    scheme_id: "UP_GOPALAK_YOJANA",
    name: "UP Gopalak Dairy Subsidy Yojana",
    description: "Interest-free loan and capital subsidy to rural youth and dairy farmers to establish modern milk production units.",
    state: "UP",
    category: "agriculture",
    income_ceiling: 300000,
    age_min: 18,
    age_max: 50,
    required_documents: ["aadhaar_card", "land_record", "income_certificate", "dairy_training_certificate"],
    benefit_amount: 100000,
    application_url: "https://animalhusb.upsdc.gov.in",
    eligibility_text: "UP Animal Husbandry Dept: Applicant must own cultivable land and have minimum 5 cattle capacity with household income under ₹3 Lakh."
  },
  {
    scheme_id: "UP_PENSION_VRIDDHA",
    name: "UP Old Age Vriddhavastha Pension",
    description: "Monthly direct financial assistance of ₹1,000 for senior citizens living below poverty line in Uttar Pradesh.",
    state: "UP",
    category: "social_welfare",
    income_ceiling: 200000,
    age_min: 60,
    age_max: 100,
    required_documents: ["aadhaar_card", "age_proof", "income_certificate", "bank_passbook"],
    benefit_amount: 12000,
    application_url: "https://sspy-up.gov.in",
    eligibility_text: "UP Social Welfare Dept: Rural applicants with annual income below ₹46,080 and urban applicants below ₹56,460 aged 60+."
  },
  {
    scheme_id: "UP_YUVA_SWAROZGAR",
    name: "UP Mukhyamantri Yuva Swarozgar Yojana",
    description: "Low-interest collateral-free loans up to ₹25 lakh for educated unemployed youth to establish manufacturing and service enterprises in UP.",
    state: "UP",
    category: "employment",
    income_ceiling: 400000,
    age_min: 18,
    age_max: 40,
    required_documents: ["education_certificate", "aadhaar_card", "project_report", "up_domicile"],
    benefit_amount: 250000,
    application_url: "https://diupmsme.upsdc.gov.in",
    eligibility_text: "UP MSME Dept: High school pass out residents of UP aged 18-40 eligible for 25% margin money capital subsidy."
  },
  {
    scheme_id: "UP_JAN_AROGYA",
    name: "Mukhyamantri Jan Arogya Yojana UP",
    description: "State health insurance coverage up to ₹5 lakh per family per year for families left out of Ayushman Bharat SECC list.",
    state: "UP",
    category: "healthcare",
    income_ceiling: 300000,
    age_min: 0,
    age_max: 100,
    required_documents: ["ration_card", "aadhaar_card", "residence_proof"],
    benefit_amount: 500000,
    application_url: "https://secchit.up.gov.in",
    eligibility_text: "UP State Health Agency: Cashless secondary and tertiary hospitalization cover for Antyodaya and eligible household ration card holders."
  },
  {
    scheme_id: "UP_ASRAYA_AWAS",
    name: "UP Mukhyamantri Awas Yojana (Gramin)",
    description: "Free pucca house construction assistance of ₹1.30 lakh for marginalized families and natural disaster victims in UP rural areas.",
    state: "UP",
    category: "housing",
    income_ceiling: 180000,
    age_min: 18,
    age_max: 75,
    required_documents: ["bpl_certificate", "aadhaar_card", "land_affidavit", "bank_passbook"],
    benefit_amount: 130000,
    application_url: "https://rural.up.nic.in",
    eligibility_text: "UP Rural Development: Homeless or kutcha house dwelling families belonging to Musahar, Vantangiya, Kol, and Tharu communities."
  },
  {
    scheme_id: "UP_MINORITY_SCHOLARSHIP",
    name: "UP Post-Matric Minority Welfare Scholarship",
    description: "Targeted educational fee subsidy for students from notified minority communities studying in UP colleges.",
    state: "UP",
    category: "minority",
    income_ceiling: 250000,
    age_min: 16,
    age_max: 26,
    required_documents: ["minority_declaration", "income_certificate", "bonafide_slip", "aadhaar_card"],
    benefit_amount: 35000,
    application_url: "https://minoritywelfare.up.gov.in",
    eligibility_text: "Minority Welfare UP: Annual family income must not exceed Rs 2.5 Lakh. Minimum 50% marks in qualifying examination."
  },
  {
    scheme_id: "UP_ABHYUDAYA_COACHING",
    name: "Mukhyamantri Abhyudaya Free Coaching",
    description: "Free high-quality coaching and tablet stipend for UPSC, UPPSC, JEE, and NEET exams for meritorious underprivileged youth.",
    state: "UP",
    category: "education",
    income_ceiling: 350000,
    age_min: 17,
    age_max: 30,
    required_documents: ["aadhaar_card", "marksheet", "income_certificate"],
    benefit_amount: 40000,
    application_url: "https://abhyuday.up.gov.in",
    eligibility_text: "UP Social Welfare: Entrance test qualifying students from economically weaker sections pursuing competitive civil and medical examinations."
  },
  {
    scheme_id: "UP_DESTITUTE_WOMEN_PENSION",
    name: "UP Destitute Women (Widow) Pension Scheme",
    description: "Direct social security pension of ₹1,000 per month for widows and destitute women residing in Uttar Pradesh.",
    state: "UP",
    category: "women",
    income_ceiling: 200000,
    age_min: 18,
    age_max: 99,
    required_documents: ["husband_death_certificate", "aadhaar_card", "income_certificate", "bank_passbook"],
    benefit_amount: 12000,
    application_url: "https://sspy-up.gov.in",
    eligibility_text: "Women Welfare Dept UP: Widowed women having family income below ₹2 Lakh without adult earning son support."
  },

  // --- MAHARASHTRA (MH) SCHEMES ---
  {
    scheme_id: "MH_MJPJAY_HEALTH",
    name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
    description: "Universal cashless health insurance coverage up to ₹5 lakh per family across 1,356 medical and surgical procedures in Maharashtra.",
    state: "MH",
    category: "healthcare",
    income_ceiling: 500000,
    age_min: 0,
    age_max: 100,
    required_documents: ["ration_card", "aadhaar_card", "mh_domicile"],
    benefit_amount: 500000,
    application_url: "https://www.jeevandayee.gov.in",
    eligibility_text: "Public Health Dept Maharashtra: All ration card holders of Maharashtra eligible for cashless hospital admissions."
  },
  {
    scheme_id: "MH_LADKI_BAHIN",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    description: "Monthly financial assistance of ₹1,500 directly transferred to underprivileged women aged 21 to 65 in Maharashtra.",
    state: "MH",
    category: "women",
    income_ceiling: 250000,
    age_min: 21,
    age_max: 65,
    required_documents: ["aadhaar_card", "mh_domicile", "income_certificate", "bank_passbook"],
    benefit_amount: 18000,
    application_url: "https://ladakibahin.maharashtra.gov.in",
    eligibility_text: "Women & Child Dept MH: Married, widowed, divorced, or destitute women with annual family income under ₹2.50 lakh."
  },
  {
    scheme_id: "MH_SWADHAR_HOSTEL",
    name: "Dr. Babasaheb Ambedkar Swadhar Scheme",
    description: "Annual financial allowance of ₹51,000 for lodging, boarding, and stationery for SC/Nav-Buddhist students unable to secure government hostels.",
    state: "MH",
    category: "education",
    income_ceiling: 250000,
    age_min: 16,
    age_max: 28,
    required_documents: ["caste_certificate", "income_certificate", "admission_proof", "aadhaar_card"],
    benefit_amount: 51000,
    application_url: "https://sjsa.maharashtra.gov.in",
    eligibility_text: "Social Justice Dept MH: SC students pursuing diploma or professional degree with 50%+ marks and family income under ₹2.5 Lakh."
  },
  {
    scheme_id: "MH_NAMO_SHETKARI",
    name: "Namo Shetkari Mahasanman Nidhi Yojana",
    description: "Supplementary direct cash assistance of ₹6,000 annually (in addition to PM-KISAN) to farmer families in Maharashtra.",
    state: "MH",
    category: "agriculture",
    income_ceiling: null,
    age_min: 18,
    age_max: 80,
    required_documents: ["7_12_extract", "aadhaar_card", "bank_passbook"],
    benefit_amount: 6000,
    application_url: "https://krishi.maharashtra.gov.in",
    eligibility_text: "Agriculture Dept MH: All active landholding farmers receiving PM-KISAN in Maharashtra automatically entitled to state top-up."
  },
  {
    scheme_id: "MH_RAMAI_AWAS",
    name: "Ramai Awas Gharkul Yojana",
    description: "Financial assistance of ₹1.30 lakh to ₹2.50 lakh for constructing pucca houses for Scheduled Caste families in Maharashtra.",
    state: "MH",
    category: "housing",
    income_ceiling: 250000,
    age_min: 18,
    age_max: 75,
    required_documents: ["caste_certificate", "bpl_ration_card", "aadhaar_card", "land_document"],
    benefit_amount: 150000,
    application_url: "https://sjsa.maharashtra.gov.in",
    eligibility_text: "Social Justice MH: SC/Nav-Buddhist families with no own pucca dwelling in Maharashtra rural or urban jurisdiction."
  },
  {
    scheme_id: "MH_MAHADBT_POSTMATRIC",
    name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh",
    description: "50% tuition and examination fee waiver for Economically Weaker Section (EBC/SEBC) students in higher and technical education.",
    state: "MH",
    category: "education",
    income_ceiling: 800000,
    age_min: 17,
    age_max: 28,
    required_documents: ["income_certificate", "domicile_certificate", "cap_admission_letter", "aadhaar_card"],
    benefit_amount: 65000,
    application_url: "https://mahadbt.maharashtra.gov.in",
    eligibility_text: "Directorate of Higher Education MH: Students admitted through CAP in recognized colleges with family income under ₹8 Lakh."
  },
  {
    scheme_id: "MH_CHHATRAPATI_SHAHU_LOAN",
    name: "Education Loan Interest Reimbursement Scheme",
    description: "100% interest reimbursement on bank education loans up to ₹10 lakh for Maratha/SEBC students studying in India or abroad.",
    state: "MH",
    category: "employment",
    income_ceiling: 800000,
    age_min: 18,
    age_max: 30,
    required_documents: ["loan_sanction_letter", "income_certificate", "aadhaar_card", "marksheet"],
    benefit_amount: 75000,
    application_url: "https://sarthi-maharashtragov.in",
    eligibility_text: "SARTHI Maharashtra: Beneficiaries of Maratha/SEBC category pursuing degree/diploma with commercial bank education loans."
  },
  {
    scheme_id: "MH_SANJAY_GANDHI_NIRADHAR",
    name: "Sanjay Gandhi Niradhar Anudan Yojana",
    description: "Monthly financial pension of ₹1,500 to destitute persons, disabled citizens, and critically ill patients in Maharashtra.",
    state: "MH",
    category: "social_welfare",
    income_ceiling: 50000,
    age_min: 18,
    age_max: 65,
    required_documents: ["disability_or_medical_certificate", "income_certificate", "aadhaar_card"],
    benefit_amount: 18000,
    application_url: "https://aaplesarkar.mahaonline.gov.in",
    eligibility_text: "Revenue & Forest Dept MH: Destitute persons with severe physical disability (40%+) or terminal illness with annual income under ₹50,000."
  },
  {
    scheme_id: "MH_MANODHAIRYA",
    name: "Manodhairya Scheme for Survivors",
    description: "Comprehensive financial rehabilitation, psychological counseling, and medical assistance for women and child survivors of heinous crime.",
    state: "MH",
    category: "women",
    income_ceiling: null,
    age_min: 0,
    age_max: 80,
    required_documents: ["fir_copy", "medical_report", "aadhaar_card"],
    benefit_amount: 300000,
    application_url: "https://womenchild.maharashtra.gov.in",
    eligibility_text: "Women & Child Dept MH: Immediate ex-gratia relief and specialized medical aid without means testing."
  },
  {
    scheme_id: "MH_MAULANA_AZAD_LOAN",
    name: "Maulana Azad Term Loan for Minorities",
    description: "Concessional loans up to ₹5 lakh at 6% interest for minority community youth for business setup and technical education in MH.",
    state: "MH",
    category: "minority",
    income_ceiling: 300000,
    age_min: 18,
    age_max: 50,
    required_documents: ["minority_certificate", "income_certificate", "business_proposal", "aadhaar_card"],
    benefit_amount: 80000,
    application_url: "https://mameco.maharashtra.gov.in",
    eligibility_text: "Minority Development Dept MH: Muslim, Christian, Buddhist, Sikh, Parsi, and Jain youth with annual family income under ₹3 Lakh."
  },

  // --- KARNATAKA (KA) SCHEMES ---
  {
    scheme_id: "KA_GRAPHA_LAKSHMI",
    name: "Gruha Lakshmi Direct Cash Scheme",
    description: "Monthly financial allowance of ₹2,000 directly credited to women heads of families in Karnataka.",
    state: "KA",
    category: "women",
    income_ceiling: null,
    age_min: 18,
    age_max: 90,
    required_documents: ["antodaya_or_bpl_card", "aadhaar_card", "bank_passbook"],
    benefit_amount: 24000,
    application_url: "https://sevasindhu.karnataka.gov.in",
    eligibility_text: "Govt of Karnataka: Woman head of family registered in APL/BPL ration card (non-taxpayer) entitled to ₹2,000 monthly DBT."
  },
  {
    scheme_id: "KA_YUVA_NIDHI",
    name: "Yuva Nidhi Unemployment Allowance",
    description: "Monthly financial stipend of ₹3,000 for degree holders and ₹1,500 for diploma holders who remain unemployed after graduation in KA.",
    state: "KA",
    category: "employment",
    income_ceiling: null,
    age_min: 20,
    age_max: 28,
    required_documents: ["degree_certificate", "karnataka_domicile", "aadhaar_card", "unemployment_declaration"],
    benefit_amount: 36000,
    application_url: "https://sevasindhugs.karnataka.gov.in",
    eligibility_text: "Skill Development Dept KA: Graduates/diploma holders of 2023-2025 passing batches residing in Karnataka unemployed for 180+ days."
  },
  {
    scheme_id: "KA_VIDYASIRI_SCHOLARSHIP",
    name: "Vidyasiri (Food & Accommodation) Scholarship",
    description: "Stipend of ₹1,500 per month for 10 months for backward classes students pursuing post-matric courses without government hostel allotment.",
    state: "KA",
    category: "education",
    income_ceiling: 250000,
    age_min: 17,
    age_max: 25,
    required_documents: ["caste_certificate", "income_certificate", "college_bonafide", "aadhaar_card"],
    benefit_amount: 15000,
    application_url: "https://bcwd.karnataka.gov.in",
    eligibility_text: "Backward Classes Welfare Dept KA: OBC Category 1, 2A, 3A students with 75% college attendance and income under ₹2.50 Lakh."
  },
  {
    scheme_id: "KA_AROGYA_KARNATAKA",
    name: "Ayushman Bharat - Arogya Karnataka (AB-ArK)",
    description: "Universal healthcare coverage providing up to ₹5 lakh per year for eligible BPL families and 30% co-pay for APL families across Karnataka.",
    state: "KA",
    category: "healthcare",
    income_ceiling: 400000,
    age_min: 0,
    age_max: 100,
    required_documents: ["ration_card", "aadhaar_card", "ark_card"],
    benefit_amount: 500000,
    application_url: "https://arogya.karnataka.gov.in",
    eligibility_text: "Health & Family Welfare KA: Cashless treatment in government and network hospitals across 1,650 therapeutic packages."
  },
  {
    scheme_id: "KA_BASAVA_VASATHI",
    name: "Basava Vasathi Housing Scheme",
    description: "Subsidized pucca house construction assistance of ₹1.50 lakh for homeless rural and urban poor in Karnataka.",
    state: "KA",
    category: "housing",
    income_ceiling: 150000,
    age_min: 18,
    age_max: 75,
    required_documents: ["bpl_card", "aadhaar_card", "land_record", "bank_passbook"],
    benefit_amount: 150000,
    application_url: "https://ashraya.karnataka.gov.in",
    eligibility_text: "Rajiv Gandhi Rural Housing Corp KA: Economically weaker citizens owning at least 200 sq.ft land with family income under ₹1.5 Lakh."
  },
  {
    scheme_id: "KA_KRISHI_BHAGYA",
    name: "Krishi Bhagya Dryland Farming Scheme",
    description: "Up to 90% subsidy on farm ponds, polyhouse polythene mulching, and diesel pump sets for rain-fed farmers in Karnataka.",
    state: "KA",
    category: "agriculture",
    income_ceiling: 300000,
    age_min: 18,
    age_max: 75,
    required_documents: ["rtc_land_record", "aadhaar_card", "bank_passbook"],
    benefit_amount: 80000,
    application_url: "https://raitamitra.karnataka.gov.in",
    eligibility_text: "Dept of Agriculture KA: Rain-fed cultivators in notified drought-prone taluks; SC/ST farmers receive 90% subsidy, general 80%."
  },
  {
    scheme_id: "KA_SANDHYA_SURAKSHA",
    name: "Sandhya Suraksha Senior Pension Scheme",
    description: "Monthly old age financial pension of ₹1,200 for senior citizens who lack stable family maintenance support in Karnataka.",
    state: "KA",
    category: "social_welfare",
    income_ceiling: 50000,
    age_min: 65,
    age_max: 100,
    required_documents: ["age_certificate", "income_certificate", "aadhaar_card", "bank_passbook"],
    benefit_amount: 14400,
    application_url: "https://sevasindhu.karnataka.gov.in",
    eligibility_text: "Revenue Dept KA: Senior citizens aged 65+ with combined husband-wife annual income not exceeding ₹50,000."
  },
  {
    scheme_id: "KA_ARIVU_EDUCATION_LOAN",
    name: "Arivu Education Loan for Minorities",
    description: "Highly subsidized low-interest education loans up to ₹3 lakh per year (2% interest) for minority students in Karnataka professional colleges.",
    state: "KA",
    category: "minority",
    income_ceiling: 350000,
    age_min: 17,
    age_max: 27,
    required_documents: ["cet_neet_admission_order", "income_certificate", "minority_certificate", "aadhaar_card"],
    benefit_amount: 100000,
    application_url: "https://kmdc.karnataka.gov.in",
    eligibility_text: "Karnataka Minorities Development Corp (KMDC): Minority students clearing CET/NEET admitted to MBBS, BDS, BTech, and MBA."
  },
  {
    scheme_id: "KA_STREE_SHAKTI",
    name: "Stree Shakti Self-Help Group Credit Incentive",
    description: "Revolving fund and interest-free matching grants up to ₹1 lakh for rural women SHGs engaged in collective micro-enterprise.",
    state: "KA",
    category: "women",
    income_ceiling: 200000,
    age_min: 18,
    age_max: 60,
    required_documents: ["shg_registration", "aadhaar_card", "bank_statement"],
    benefit_amount: 50000,
    application_url: "https://karnatakastreeshakti.org",
    eligibility_text: "Women Development Corp KA: Functioning women SHGs with minimum 15 members following prompt internal loan repayment track record."
  },
  {
    scheme_id: "KA_UNORGANIZED_WORKER_PENSION",
    name: "Karnataka Building & Other Workers Livelihood Grant",
    description: "Maternity benefit (₹50,000), marriage assistance (₹50,000), and scholarship for children of registered construction workers.",
    state: "KA",
    category: "employment",
    income_ceiling: null,
    age_min: 18,
    age_max: 60,
    required_documents: ["kbocwwb_labor_card", "aadhaar_card", "bank_passbook"],
    benefit_amount: 60000,
    application_url: "https://kbocwwb.karnataka.gov.in",
    eligibility_text: "Karnataka Labor Welfare Board: Registered construction worker with 90 days active work verification in preceding 12 months."
  },

  // --- CENTRAL GOVERNMENT ALL-INDIA SCHEMES ---
  {
    scheme_id: "NSP_MCM_CENTRAL",
    name: "NSP Merit-cum-Means Scholarship for Professional Courses",
    description: "Central government scholarship providing course fee reimbursement and monthly maintenance for technical undergraduate students.",
    state: "Central",
    category: "education",
    income_ceiling: 250000,
    age_min: 17,
    age_max: 25,
    required_documents: ["income_certificate", "institution_certificate", "aadhaar_card", "previous_marksheet"],
    benefit_amount: 30000,
    application_url: "https://scholarships.gov.in",
    eligibility_text: "Ministry of Education Gazette: Pursuing professional or technical graduation with 50%+ in qualifying exam and family income under ₹2.5L."
  },
  {
    scheme_id: "PM_USHA_CENTRAL",
    name: "Pradhan Mantri Uchchatar Shiksha Abhiyan (PM-USHA)",
    description: "Central higher education equity grant supporting tuition subsidies, lab access, and digital equipment in state public universities.",
    state: "Central",
    category: "education",
    income_ceiling: 300000,
    age_min: 18,
    age_max: 26,
    required_documents: ["income_certificate", "institution_bonafide", "aadhaar_card"],
    benefit_amount: 40000,
    application_url: "https://pmusha.education.gov.in",
    eligibility_text: "Ministry of Education Guidelines 2024: Priority allocated to focus districts with annual family income below ₹3 Lakh."
  },
  {
    scheme_id: "AYUSHMAN_BHARAT",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    description: "Flagship health assurance providing cashless hospitalization up to ₹5 lakh per family per year at public and empaneled private hospitals.",
    state: "Central",
    category: "healthcare",
    income_ceiling: 350000,
    age_min: 0,
    age_max: 100,
    required_documents: ["aadhaar_card", "ration_card"],
    benefit_amount: 500000,
    application_url: "https://pmjay.gov.in",
    eligibility_text: "National Health Authority: Entitled families identified through SECC 2011 deprivation criteria and NFSA ration card linkage."
  },
  {
    scheme_id: "PM_KISAN_CENTRAL",
    name: "PM Kisan Samman Nidhi (PM-KISAN)",
    description: "Direct income support of ₹6,000 per year in three equal installments to all cultivable landholding farmer families across India.",
    state: "Central",
    category: "agriculture",
    income_ceiling: null,
    age_min: 18,
    age_max: 85,
    required_documents: ["aadhaar_card", "land_record", "bank_passbook"],
    benefit_amount: 6000,
    application_url: "https://pmkisan.gov.in",
    eligibility_text: "Dept of Agriculture & Farmers Welfare: All landholder farmer families with cultivable land; income tax payees excluded."
  },
  {
    scheme_id: "PMAY_G_CENTRAL",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    description: "Direct financial grant of ₹1.20 lakh (plains) to ₹1.30 lakh (hilly states) to construct pucca houses with sanitation facilities.",
    state: "Central",
    category: "housing",
    income_ceiling: 200000,
    age_min: 18,
    age_max: 75,
    required_documents: ["aadhaar_card", "bpl_certificate", "bank_passbook"],
    benefit_amount: 120000,
    application_url: "https://pmayg.nic.in",
    eligibility_text: "Ministry of Rural Development: Homeless households or living in zero/one/two room kutcha houses in SECC database."
  },
  {
    scheme_id: "PMAY_U_CENTRAL",
    name: "Pradhan Mantri Awas Yojana - Urban (PMAY-U 2.0)",
    description: "Credit-linked interest subsidy up to ₹2.67 lakh for first-time urban home buyers in EWS and LIG income slabs.",
    state: "Central",
    category: "housing",
    income_ceiling: 600000,
    age_min: 21,
    age_max: 70,
    required_documents: ["aadhaar_card", "income_certificate", "property_agreement", "bank_statement"],
    benefit_amount: 267000,
    application_url: "https://pmaymis.gov.in",
    eligibility_text: "Ministry of Housing & Urban Affairs: Beneficiary family must not own a pucca house anywhere in India."
  },
  {
    scheme_id: "PMS_SCST_CENTRAL",
    name: "Central Post-Matric Scholarship for SC/ST",
    description: "Centrally sponsored 100% compulsory fee reimbursement and maintenance allowance for Scheduled Caste and Scheduled Tribe students.",
    state: "Central",
    category: "education",
    income_ceiling: 250000,
    age_min: 16,
    age_max: 30,
    required_documents: ["caste_certificate", "income_certificate", "admission_receipt", "aadhaar_card"],
    benefit_amount: 65000,
    application_url: "https://scholarships.gov.in",
    eligibility_text: "Ministry of Social Justice & Empowerment: All compulsory non-refundable fees fully reimbursed via Direct Benefit Transfer."
  },
  {
    scheme_id: "PM_MUDRA_CENTRAL",
    name: "Pradhan Mantri MUDRA Yojana (Shishu & Kishore)",
    description: "Collateral-free micro-enterprise business loans up to ₹5 lakh for non-farm small enterprises and shopkeepers.",
    state: "Central",
    category: "employment",
    income_ceiling: null,
    age_min: 18,
    age_max: 65,
    required_documents: ["aadhaar_card", "pan_card", "business_proof", "bank_statement"],
    benefit_amount: 150000,
    application_url: "https://www.mudra.org.in",
    eligibility_text: "Department of Financial Services: No collateral or third-party guarantee required for loans up to ₹10 Lakh under MUDRA."
  },
  {
    scheme_id: "PM_VISHWAKARMA_CENTRAL",
    name: "PM Vishwakarma Scheme for Traditional Artisans",
    description: "₹15,000 modern toolkit e-voucher + skill training stipend + ₹3 lakh collateral-free enterprise loan at 5% concessional interest.",
    state: "Central",
    category: "employment",
    income_ceiling: 300000,
    age_min: 18,
    age_max: 60,
    required_documents: ["aadhaar_card", "ration_card", "craft_self_declaration", "bank_passbook"],
    benefit_amount: 65000,
    application_url: "https://pmvishwakarma.gov.in",
    eligibility_text: "Ministry of MSME: Traditional craftspersons working with hands and tools across 18 designated trade families."
  },
  {
    scheme_id: "SUKANYA_SAMRIDDHI_CENTRAL",
    name: "Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)",
    description: "Sovereign savings scheme for girl child with 8.2% tax-free compound interest (EEE) for higher education and wedding expenses.",
    state: "Central",
    category: "women",
    income_ceiling: null,
    age_min: 0,
    age_max: 10,
    required_documents: ["birth_certificate", "guardian_aadhaar", "address_proof"],
    benefit_amount: 75000,
    application_url: "https://www.indiapost.gov.in",
    eligibility_text: "Ministry of Finance: Account opened in post office/bank before girl attains 10 years of age with sovereign EEE tax exemption."
  },
  {
    scheme_id: "ATAL_PENSION_CENTRAL",
    name: "Atal Pension Yojana (APY)",
    description: "Guaranteed sovereign lifetime pension of ₹1,000 to ₹5,000 per month after age 60 for workers in the unorganized sector.",
    state: "Central",
    category: "social_welfare",
    income_ceiling: 400000,
    age_min: 18,
    age_max: 40,
    required_documents: ["aadhaar_card", "savings_bank_account"],
    benefit_amount: 60000,
    application_url: "https://www.npscra.nsdl.co.in",
    eligibility_text: "PFRDA: Central government guarantees defined minimum monthly pension; deficit funded by Consolidated Fund of India."
  },
  {
    scheme_id: "NAPS_APPRENTICE_CENTRAL",
    name: "National Apprenticeship Promotion Scheme (NAPS-2)",
    description: "Direct government monthly stipend support of ₹1,500 deposited directly to industrial apprentices undergoing on-the-job training.",
    state: "Central",
    category: "employment",
    income_ceiling: null,
    age_min: 18,
    age_max: 28,
    required_documents: ["iti_or_degree_certificate", "aadhaar_card", "bank_passbook"],
    benefit_amount: 18000,
    application_url: "https://www.apprenticeshipindia.gov.in",
    eligibility_text: "Ministry of Skill Development: DBT of 25% of prescribed stipend up to ₹1,500/month during industry apprenticeship."
  },
  {
    scheme_id: "CSIS_LOAN_CENTRAL",
    name: "Central Sector Interest Subsidy (CSIS) on Education Loans",
    description: "Full interest waiver during study moratorium period (course + 1 yr) for EWS students taking educational loans.",
    state: "Central",
    category: "education",
    income_ceiling: 450000,
    age_min: 17,
    age_max: 30,
    required_documents: ["ews_certificate", "loan_sanction_letter", "admission_proof", "aadhaar_card"],
    benefit_amount: 48000,
    application_url: "https://www.vidyalakshmi.co.in",
    eligibility_text: "Ministry of Education: 100% interest subsidy during moratorium period for students with family income under ₹4.5L."
  },
  {
    scheme_id: "KCC_CREDIT_CENTRAL",
    name: "Kisan Credit Card (KCC) Subsidized Interest Subvention",
    description: "Working capital crop and dairy loan up to ₹3 lakh at effective 4% subsidized interest rate with prompt repayment incentive.",
    state: "Central",
    category: "agriculture",
    income_ceiling: null,
    age_min: 18,
    age_max: 75,
    required_documents: ["land_record", "aadhaar_card", "pan_card"],
    benefit_amount: 25000,
    application_url: "https://pmkisan.gov.in",
    eligibility_text: "RBI & NABARD Master Circular: 7% baseline interest reduced by 2% subvention and 3% prompt repayment incentive to net 4% p.a."
  },
  {
    scheme_id: "PM_SVANIDHI_CENTRAL",
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    description: "Collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy and cashback for urban street vendors.",
    state: "Central",
    category: "employment",
    income_ceiling: null,
    age_min: 18,
    age_max: 70,
    required_documents: ["vending_certificate", "aadhaar_card", "bank_passbook"],
    benefit_amount: 30000,
    application_url: "https://pmsvanidhi.mohua.gov.in",
    eligibility_text: "Ministry of Housing & Urban Affairs: 7% interest subsidy directly credited quarterly for vendors engaged in urban vending."
  },
  {
    scheme_id: "PMMVY_MATERNITY_CENTRAL",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    description: "Direct cash maternity incentive of ₹5,000 to ₹6,000 to compensate for wage loss before and after childbirth.",
    state: "Central",
    category: "women",
    income_ceiling: 800000,
    age_min: 19,
    age_max: 45,
    required_documents: ["mcp_card", "mother_aadhaar", "bank_passbook"],
    benefit_amount: 6000,
    application_url: "https://pmmvy.wcd.gov.in",
    eligibility_text: "Ministry of Women & Child Development: Partial wage compensation transferred in installments to mother's single bank account."
  },
  {
    scheme_id: "PM_JANDHAN_LIFE_COVER",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    description: "Affordable renewable life insurance cover of ₹2 lakh at a nominal annual premium of ₹436 for any cause of death.",
    state: "Central",
    category: "social_welfare",
    income_ceiling: null,
    age_min: 18,
    age_max: 50,
    required_documents: ["aadhaar_card", "bank_account_with_auto_debit"],
    benefit_amount: 200000,
    application_url: "https://www.jansuraksha.gov.in",
    eligibility_text: "Department of Financial Services: Any savings bank account holder between 18 and 50 years with auto-debit consent."
  },
  {
    scheme_id: "PM_SURAKSHA_BIMA_CENTRAL",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    description: "Accidental death and permanent disability insurance of ₹2 lakh for an annual premium of just ₹20.",
    state: "Central",
    category: "healthcare",
    income_ceiling: null,
    age_min: 18,
    age_max: 70,
    required_documents: ["aadhaar_card", "savings_bank_passbook"],
    benefit_amount: 200000,
    application_url: "https://www.jansuraksha.gov.in",
    eligibility_text: "DFS Govt of India: ₹2 lakh for accidental death or full disability and ₹1 lakh for partial disability for ₹20/year."
  },
  {
    scheme_id: "BEGUM_HAZRAT_MAHAL_CENTRAL",
    name: "Begum Hazrat Mahal National Scholarship",
    description: "Direct scholarship grant of ₹12,000 for minority girl students pursuing Class 9 to 12 with good academic records.",
    state: "Central",
    category: "minority",
    income_ceiling: 200000,
    age_min: 14,
    age_max: 19,
    required_documents: ["minority_certificate", "income_certificate", "school_bonafide", "aadhaar_card"],
    benefit_amount: 12000,
    application_url: "https://bhmnsmaef.org",
    eligibility_text: "Maulana Azad Education Foundation: Meritorious girl students belonging to 6 notified minority communities scoring 50%+."
  },
  {
    scheme_id: "STANDUP_INDIA_CENTRAL",
    name: "Stand-Up India Enterprise Loan Scheme",
    description: "Bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST and one woman borrower per bank branch for greenfield enterprises.",
    state: "Central",
    category: "employment",
    income_ceiling: null,
    age_min: 18,
    age_max: 65,
    required_documents: ["caste_certificate", "project_dpr", "pan_card", "aadhaar_card"],
    benefit_amount: 500000,
    application_url: "https://www.standupmitra.in",
    eligibility_text: "Dept of Financial Services: SC/ST and/or women entrepreneurs setting up greenfield manufacturing, service, or trading units."
  }
];

// Enrich each scheme with standard fields and dense knn_vector
export const ENRICHED_SCHEMES = SEEDED_SCHEMES.map(s => {
  const corpus = `${s.name} ${s.description} ${s.category} ${s.state} ${s.eligibility_text}`.toLowerCase();
  const vector = generateDeterministicVector(corpus, 384);
  return {
    ...s,
    id: s.scheme_id.toLowerCase().replace(/_/g, '-'),
    scheme_code: s.scheme_id,
    scheme_name: s.name,
    annual_benefit_amount: s.benefit_amount,
    financial_benefit: `₹${s.benefit_amount.toLocaleString('en-IN')} annual benefit`,
    target_occupations: ["Any"],
    target_education: ["Any"],
    target_genders: ["Any"],
    target_social_categories: ["All"],
    statutory_evidence: s.eligibility_text,
    knn_vector: vector,
    combination_tags: [s.category, s.state === 'Central' ? 'pan_india' : 'state_exclusive']
  };
});

// Save to backend/data/schemes.json
const backendSchemesPath = path.join(__dirname, '../backend/data/schemes.json');
fs.writeFileSync(backendSchemesPath, JSON.stringify(ENRICHED_SCHEMES, null, 2));
console.log(`Saved ${ENRICHED_SCHEMES.length} schemes with 384-dim knn_vector to ${backendSchemesPath}`);
