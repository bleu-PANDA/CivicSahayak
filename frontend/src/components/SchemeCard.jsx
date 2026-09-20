import React from 'react';
import { ExternalLink, CheckCircle2, XCircle, AlertTriangle, FileText, ChevronRight, IndianRupee } from 'lucide-react';

export default function SchemeCard({ scheme, onSelectScheme, onOpenChecklist }) {
  const evaluation = scheme.evaluation || {
    eligibilityScore: 85,
    status: 'ELIGIBLE',
    criteriaResults: [],
    missingDocuments: []
  };

  const score = evaluation.eligibilityScore;
  const isEligible = evaluation.status === 'ELIGIBLE';
  const isPartial = evaluation.status === 'PARTIALLY_ELIGIBLE';

  const statusBadgeColor = isEligible
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
    : isPartial
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/25';

  const scoreColor = isEligible
    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    : isPartial
    ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    : 'text-rose-400 border-rose-500/30 bg-rose-950/20';

  return (
    <div className="card-ssych rounded-2xl p-6 flex flex-col justify-between group space-y-5">
      <div className="space-y-4">
        
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {scheme.scheme_code}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-blue-400/90 font-medium">
              {scheme.category}
            </span>
          </div>

          <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${statusBadgeColor}`}>
            {isEligible ? 'Eligible' : isPartial ? 'Partial' : 'Ineligible'}
          </div>
        </div>

        {/* Scheme Title & Description */}
        <div>
          <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug">
            {scheme.scheme_name}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* Metric Row: Score & Financial Benefit */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/30 border border-white/[0.05]">
          
          {/* Eligibility Score */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-xs sm:text-sm ${scoreColor}`}>
              {score}%
            </div>
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Match Score</div>
              <div className="text-xs font-medium text-zinc-200">
                {isEligible ? 'High Fit' : isPartial ? 'Borderline' : 'Low Fit'}
              </div>
            </div>
          </div>

          {/* Financial Benefit */}
          <div className="flex items-center space-x-2 pl-3 border-l border-white/[0.06]">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Benefit</div>
              <div className="text-xs font-medium text-zinc-200 truncate" title={scheme.financial_benefit}>
                {scheme.financial_benefit}
              </div>
            </div>
          </div>

        </div>

        {/* Key Deterministic Criteria */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {evaluation.criteriaResults?.slice(0, 3).map((c, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                c.passed
                  ? 'bg-emerald-950/15 text-emerald-300/90 border-emerald-900/30'
                  : 'bg-rose-950/15 text-rose-300/90 border-rose-900/30'
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              ) : (
                <XCircle className="w-2.5 h-2.5 text-rose-400" />
              )}
              <span>{c.label}</span>
            </span>
          ))}

          {evaluation.missingDocuments?.length > 0 && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/15 text-amber-300/90 border border-amber-900/30">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
              <span>{evaluation.missingDocuments.length} doc required</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectScheme(scheme)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-xs font-mono text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <button
          onClick={() => onOpenChecklist(scheme)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-mono border border-blue-500/20 transition-colors"
          title="Open Checklist"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Checklist</span>
        </button>

        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
          title="Official Government Portal"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
