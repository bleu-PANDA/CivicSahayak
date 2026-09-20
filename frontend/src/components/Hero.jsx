import React, { useState } from 'react';
import { Search, ArrowRight, UserCheck, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

export const PRESET_CITIZENS = [
  {
    id: 'preset-student-up',
    title: 'Student (UP)',
    subtitle: 'Age 21 • ₹2.5L Income',
    tag: 'Education',
    query: "I'm a 21-year-old undergraduate student from Uttar Pradesh with family annual income of ₹2.5 lakh looking for higher education scholarships.",
    profile: { age: 21, state: 'Uttar Pradesh', family_income_annual: 250000, occupation: 'Student', education_level: 'Undergraduate', gender: 'Any', category: 'General' }
  },
  {
    id: 'preset-farmer-bihar',
    title: 'Small Farmer (Bihar)',
    subtitle: 'Age 42 • 1.5ha Land',
    tag: 'Agriculture',
    query: "I am a 42-year-old farmer from Bihar with 1.5 hectares of land, annual income ₹1.8 lakh, seeking crop support and subsidized farm credit.",
    profile: { age: 42, state: 'Bihar', family_income_annual: 180000, occupation: 'Farmer', education_level: 'Secondary', gender: 'Male', category: 'OBC' }
  },
  {
    id: 'preset-artisan-rj',
    title: 'Artisan (Rajasthan)',
    subtitle: 'Age 34 • Single Mother',
    tag: 'Livelihood',
    query: "I am a 34-year-old woman artisan and tailor from Rajasthan earning ₹1.2 lakh annually looking for modern tool incentives and loan assistance.",
    profile: { age: 34, state: 'Rajasthan', family_income_annual: 120000, occupation: 'Artisan', education_level: 'Secondary', gender: 'Female', category: 'OBC' }
  },
  {
    id: 'preset-scholar-mh',
    title: 'Scholar (Maharashtra)',
    subtitle: 'Age 19 • SC Category',
    tag: 'Scholarship',
    query: "I am a 19-year-old engineering student from Maharashtra from Scheduled Caste community with annual family income of ₹2.1 lakh.",
    profile: { age: 19, state: 'Maharashtra', family_income_annual: 210000, occupation: 'Student', education_level: 'Undergraduate', gender: 'Any', category: 'SC' }
  },
  {
    id: 'preset-vendor-delhi',
    title: 'Vendor (Delhi)',
    subtitle: 'Age 38 • Micro-Credit',
    tag: 'Enterprise',
    query: "I am a 38-year-old street food cart vendor in Delhi seeking collateral-free working capital loan and social security retirement pension.",
    profile: { age: 38, state: 'Delhi', family_income_annual: 160000, occupation: 'Street Vendor', education_level: 'Secondary', gender: 'Male', category: 'General' }
  }
];

export const CATEGORIES = [
  'All',
  'Education',
  'Healthcare',
  'Agriculture',
  'Housing',
  'Enterprise',
  'Welfare'
];

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

export default function Hero({ onEvaluate, isLoading, currentQuery, setCurrentQuery, selectedCategory, setSelectedCategory }) {
  const [localInput, setLocalInput] = useState(currentQuery || '');

  // Keep localInput in sync if currentQuery changes externally (e.g. from preset/example selection)
  React.useEffect(() => {
    setLocalInput(currentQuery || '');
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = localInput.trim();
    if (!query) return;

    // Detect category from query automatically if present
    const detectedCategory = detectCategoryFromQuery(query);
    const finalCategory = detectedCategory || selectedCategory || 'All';
    if (detectedCategory) {
      setSelectedCategory(detectedCategory);
    }
    setCurrentQuery(query);
    onEvaluate(query, null, finalCategory);
  };

  const handleSelectPreset = (preset) => {
    setLocalInput(preset.query);
    setCurrentQuery(preset.query);
    let cat = preset.tag;
    if (cat === 'Livelihood') cat = 'Enterprise';
    if (cat === 'Scholarship') cat = 'Education';
    const detected = detectCategoryFromQuery(preset.query) || cat || 'All';
    setSelectedCategory(detected);
    onEvaluate(preset.query, preset.profile, detected);
  };

  return (
    <div className="relative pt-12 pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Deterministic Policy & Welfare Discovery</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15] mb-4">
            Find Government Benefits <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              You Actually Qualify For
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Describe your situation in plain words. Get verified scheme matches with transparent eligibility scoring and required documents.
          </p>
        </div>

        {/* Natural Language Command Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl bg-[#090C16]/90 border border-white/[0.12] hover:border-blue-500/35 focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/25 focus-within:shadow-[0_0_35px_rgba(59,130,246,0.22)] p-2 transition-all duration-300 shadow-xl">
              <div className="flex items-center flex-1 px-3 py-1.5">
                <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-blue-400 mr-3 flex-shrink-0 transition-colors duration-200" />
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalInput(val);
                    setCurrentQuery(val);
                    // Dynamically switch category pill if category keywords are detected while typing
                    const detected = detectCategoryFromQuery(val);
                    if (detected && detected !== selectedCategory) {
                      setSelectedCategory(detected);
                    }
                  }}
                  placeholder="Tell us about yourself (e.g., student from UP, family income 2.5 lakh...)"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
                />
                {localInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalInput('');
                      setCurrentQuery('');
                    }}
                    className="text-zinc-500 hover:text-zinc-300 px-1 text-xs transition-colors"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 sm:mt-0 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm disabled:opacity-50 group"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Find Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Example Prompt Reference Below Search Box */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3 text-xs text-zinc-400 px-2 text-center">
            <span className="text-zinc-500 font-medium">Example:</span>
            <button
              type="button"
              onClick={() => {
                const exPrompt = "I'm a 21-year-old undergraduate student from Uttar Pradesh with family annual income of ₹2.5 lakh looking for higher education scholarships.";
                setLocalInput(exPrompt);
                setCurrentQuery(exPrompt);
                setSelectedCategory('Education');
                onEvaluate(exPrompt, PRESET_CITIZENS[0].profile, 'Education');
              }}
              className="text-zinc-400 hover:text-blue-300 underline underline-offset-4 decoration-white/20 hover:decoration-blue-400 transition-all text-left italic cursor-pointer group inline-flex items-center gap-1.5 max-w-full"
              title="Click to try this example prompt"
            >
              <span className="truncate max-w-[560px]">
                "I'm a 21-year-old undergraduate student from Uttar Pradesh with family annual income of ₹2.5 lakh looking for higher education scholarships."
              </span>
              <span className="text-[10px] not-italic px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 whitespace-nowrap">
                Try this
              </span>
            </button>
          </div>

          {/* Category Filter Pills (Calm & Clean) */}
          <div className="flex items-center justify-center space-x-2 mt-5 overflow-x-auto py-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onEvaluate(localInput, null, cat);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Citizen Presets (Interactive Highlight Cards) */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs font-mono text-zinc-500">
              Or try a sample profile:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PRESET_CITIZENS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-3.5 rounded-xl bg-surface-soft/60 border border-white/[0.06] hover:border-blue-400/40 hover:bg-white/[0.08] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_18px_rgba(59,130,246,0.18)] hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-blue-400/80 group-hover:text-blue-300 mb-1 transition-colors">
                    {preset.tag}
                  </div>
                  <div className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {preset.title}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {preset.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

