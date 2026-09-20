import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, CheckCircle2, IndianRupee, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function SchemeBundler({ currentBundle, onSelectScheme }) {
  const [curatedBundles, setCuratedBundles] = useState([]);
  const [selectedBundleId, setSelectedBundleId] = useState('bundle-higher-edu');

  useEffect(() => {
    fetch('/api/combinations')
      .then(res => res.json())
      .then(data => {
        if (data.bundles) {
          setCuratedBundles(data.bundles);
        }
      })
      .catch(err => console.error('Error fetching combinations:', err));
  }, []);

  const activeCuratedBundle = curatedBundles.find(b => b.id === selectedBundleId) || curatedBundles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#090C16] border border-white/[0.08] shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Synergistic Scheme Bundles</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Stack Complementary Benefits
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Combine tuition waivers, healthcare insurance, and monthly maintenance stipends without legal conflict.
        </p>
      </div>


      {/* Dynamic Bundle from Current Query if Available */}
      {currentBundle && currentBundle.schemes?.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-purple-950/30 border border-blue-500/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Personalized Recommendation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Optimized Scheme Bundle for Your Profile
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Combined Annual Benefit</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-400 flex items-center sm:justify-end">
                <IndianRupee className="w-5 h-5" />
                <span>{(currentBundle.totalAnnualFinancialUnlock || 0).toLocaleString('en-IN')}</span>
                <span className="text-xs text-zinc-400 font-normal ml-1">/ year</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentBundle.schemes.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-blue-400">{s.scheme_code}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{s.eligibilityScore}% Match</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{s.scheme_name}</h4>
                </div>
                <div className="pt-2 border-t border-white/[0.05] text-xs font-mono text-zinc-300 font-medium">
                  {s.financial_benefit}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.06] text-xs font-mono text-zinc-300 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300">Statutory Compatibility Verified: </span>
              {currentBundle.synergyDescription}
            </div>
          </div>
        </div>
      )}

      {/* Curated Pre-Built Bundles */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Curated Citizen Triad Packages:
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {curatedBundles.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBundleId(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-2 ${
                selectedBundleId === b.id
                  ? 'bg-blue-600/30 text-white border border-blue-500/50 shadow-sm'
                  : 'bg-surface-soft/60 text-zinc-400 border border-white/[0.07] hover:bg-surface-raised'
              }`}
            >
              <span>{b.title}</span>
            </button>
          ))}
        </div>

        {activeCuratedBundle && (
          <div className="p-6 rounded-2xl bg-surface-soft/80 border border-white/[0.08] shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Target Beneficiary</span>
                <h3 className="text-xl font-bold text-white">{activeCuratedBundle.title}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{activeCuratedBundle.targetCitizen}</p>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.08] text-right">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Financial Unlock</div>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  ₹{(activeCuratedBundle.totalAnnualFinancialUnlock || 0).toLocaleString('en-IN')} / yr
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCuratedBundle.schemes?.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/[0.06] hover:border-blue-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span>{s.scheme_code}</span>
                      <span className="text-blue-400">{s.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{s.scheme_name}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{s.description}</p>
                  </div>
                  <div className="pt-2 border-t border-white/[0.05] text-xs font-mono text-emerald-400 font-semibold">
                    {s.financial_benefit}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono text-zinc-300">
              <span className="text-cyan-400 font-bold block mb-1">Synergistic Legal Rationale:</span>
              {activeCuratedBundle.synergyNote}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
