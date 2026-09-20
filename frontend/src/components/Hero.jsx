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

export default function Hero({ onEvaluate, isLoading, currentQuery, setCurrentQuery, selectedCategory, setSelectedCategory }) {
  const [localInput, setLocalInput] = useState(currentQuery || "I'm a 21-year-old student from Uttar Pradesh. My family income is ₹2.5 lakh and I want financial assistance for higher education.");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localInput.trim()) return;
    onEvaluate(localInput, null, selectedCategory);
  };

  const handleSelectPreset = (preset) => {
    setLocalInput(preset.query);
    setCurrentQuery(preset.query);
    onEvaluate(preset.query, preset.profile, selectedCategory);
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
            <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl bg-[#090C16] border border-white/[0.1] hover:border-white/[0.18] p-2 transition-all shadow-xl">
              <div className="flex items-center flex-1 px-3 py-1.5">
                <Search className="w-4 h-4 text-zinc-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Tell us about yourself (e.g., student from UP, family income 2.5 lakh...)"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 sm:mt-0 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Find Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Category Filter Pills (Calm & Clean) */}
          <div className="flex items-center justify-center space-x-2 mt-5 overflow-x-auto py-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onEvaluate(localInput, null, cat);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Citizen Presets (Clean Minimalist Cards) */}
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
                className="text-left p-3.5 rounded-xl bg-surface-soft/60 border border-white/[0.06] hover:border-blue-500/30 hover:bg-surface-soft transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-blue-400/80 mb-1">
                    {preset.tag}
                  </div>
                  <div className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {preset.title}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-zinc-500">
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

