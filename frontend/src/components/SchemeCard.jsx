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
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isPartial
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  const scoreColor = isEligible
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
    : isPartial
    ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
    : 'text-rose-400 border-rose-500/40 bg-rose-950/20';

  return (
    <div className="card-ssych rounded-xl p-5 flex flex-col justify-between group">
      <div>
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.05] text-zinc-300 border border-white/[0.1]">
              {scheme.scheme_code}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {scheme.category}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {scheme.level === 'Central' ? 'Central Scheme' : `State: ${scheme.state}`}
            </span>
          </div>

          <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${statusBadgeColor}`}>
            {evaluation.status.replace('_', ' ')}
          </div>
        </div>

        {/* Scheme Title & Description */}
        <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors mb-1.5 leading-snug">
          {scheme.scheme_name}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Metric Row: Score & Financial Benefit */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-black/40 border border-white/[0.05] mb-4">
          
          {/* Eligibility Score */}
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono font-bold text-sm ${scoreColor}`}>
              {score}%
            </div>
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Corretto Score</div>
              <div className="text-xs font-medium text-zinc-200">
                {isEligible ? 'High Match' : isPartial ? 'Borderline' : 'Exceeds Criteria'}
              </div>
            </div>
          </div>

          {/* Financial Benefit */}
          <div className="flex items-center space-x-2 pl-2 border-l border-white/[0.06]">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Annual Benefit</div>
              <div className="text-xs font-semibold text-zinc-200 truncate" title={scheme.financial_benefit}>
                {scheme.financial_benefit}
              </div>
            </div>
          </div>

        </div>

        {/* Criteria Breakdown Badges */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Deterministic Criteria:</div>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.criteriaResults?.map((c, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                  c.passed
                    ? 'bg-emerald-950/20 text-emerald-300 border-emerald-900/40'
                    : 'bg-rose-950/20 text-rose-300 border-rose-900/40'
                }`}
                title={c.detail}
              >
                {c.passed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-400" />
                )}
                <span>{c.label}:</span>
                <span className="font-semibold">{c.actual}</span>
              </span>
            ))}

            {evaluation.missingDocuments?.length > 0 && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/20 text-amber-300 border border-amber-900/40">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Missing: {evaluation.missingDocuments.length} doc{evaluation.missingDocuments.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectScheme(scheme)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-200 border border-white/[0.08] transition-colors"
        >
          <span>{isEligible ? 'Why am I eligible?' : 'Why ineligible?'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <button
          onClick={() => onOpenChecklist(scheme)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-mono border border-blue-500/30 transition-colors"
          title="Open Application Checklist"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Checklist</span>
        </button>

        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors"
          title="Official Government Portal"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
