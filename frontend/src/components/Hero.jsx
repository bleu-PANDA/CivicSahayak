import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, UserCheck, Shield, ChevronRight, SlidersHorizontal } from 'lucide-react';

export const PRESET_CITIZENS = [
  {
    id: 'preset-student-up',
    title: '21yo Student from UP',
    tag: 'Education & Health',
    query: "I'm a 21-year-old undergraduate student from Uttar Pradesh with family annual income of ₹2.5 lakh looking for higher education scholarships.",
    profile: { age: 21, state: 'Uttar Pradesh', family_income_annual: 250000, occupation: 'Student', education_level: 'Undergraduate', gender: 'Any', category: 'General' }
  },
  {
    id: 'preset-farmer-bihar',
    title: 'Smallholder Farmer (Bihar)',
    tag: 'Agriculture & Credit',
    query: "I am a 42-year-old farmer from Bihar with 1.5 hectares of land, annual income ₹1.8 lakh, seeking crop support and subsidized farm credit.",
    profile: { age: 42, state: 'Bihar', family_income_annual: 180000, occupation: 'Farmer', education_level: 'Secondary', gender: 'Male', category: 'OBC' }
  },
  {
    id: 'preset-artisan-rj',
    title: 'Single Mother Artisan (Rajasthan)',
    tag: 'Craft & Enterprise',
    query: "I am a 34-year-old woman artisan and tailor from Rajasthan earning ₹1.2 lakh annually looking for modern tool incentives and loan assistance.",
    profile: { age: 34, state: 'Rajasthan', family_income_annual: 120000, occupation: 'Artisan', education_level: 'Secondary', gender: 'Female', category: 'OBC' }
  },
  {
    id: 'preset-scholar-mh',
    title: 'SC Scholar (Maharashtra)',
    tag: 'Full Fee Reimbursement',
    query: "I am a 19-year-old engineering student from Maharashtra from Scheduled Caste community with annual family income of ₹2.1 lakh.",
    profile: { age: 19, state: 'Maharashtra', family_income_annual: 210000, occupation: 'Student', education_level: 'Undergraduate', gender: 'Any', category: 'SC' }
  },
  {
    id: 'preset-vendor-delhi',
    title: 'Urban Street Vendor (Delhi)',
    tag: 'Micro-Credit & Pension',
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
  'Entrepreneurship',
  'Women & Child',
  'Social Security'
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
    <div className="relative pt-8 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pill Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.09] text-xs font-mono text-zinc-300 backdrop-blur-md shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-zinc-400 font-sans">Zero AWS Cost Architecture</span>
            <span className="text-zinc-600">•</span>
            <span className="text-blue-400">Strands Agents + Corretto Engine</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-4">
            Discover Government Schemes <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              You Actually Qualify For.
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Multi-agent reasoning with deterministic Corretto rules evaluation, Firecracker microVM document sandboxing, and OpenSearch statutory evidence retrieval across 20+ Indian government schemes.
          </p>
        </div>

        {/* Natural Language Command Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl bg-[#090C16] border border-white/[0.12] p-2 shadow-2xl">
              <div className="flex items-center flex-1 px-3 py-1">
                <Search className="w-5 h-5 text-zinc-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Describe your situation in natural language (age, state, income, profession...)"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 sm:mt-0 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium transition-all shadow-glow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Evaluate Eligibility</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Category Filter Bar */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-mono text-zinc-500 flex items-center pl-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3 mr-1" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  onEvaluate(localInput, null, cat);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.07] hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Citizen Presets */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono text-zinc-400 flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Quick Citizen Presets (Click to evaluate in 1-second):
            </span>
            <span className="text-[11px] font-mono text-zinc-500">20+ Indian Government Schemes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {PRESET_CITIZENS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-3 rounded-lg bg-surface-soft/80 border border-white/[0.07] hover:border-blue-500/40 hover:bg-surface-raised transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-blue-400/90 mb-1 tracking-wider uppercase">
                    {preset.tag}
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {preset.title}
                  </div>
                </div>
                <div className="mt-2.5 flex items-center text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                  <span>Run Pipeline</span>
                  <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
