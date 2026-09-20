import React from 'react';
import { X, ExternalLink, CheckCircle2, XCircle, FileText, Upload, ShieldCheck, BookOpen, AlertTriangle } from 'lucide-react';

export default function SchemeDetailModal({ scheme, onClose, onUploadDocument, onOpenChecklist }) {
  if (!scheme) return null;

  const evaluation = scheme.evaluation || {};
  const isEligible = evaluation.status === 'ELIGIBLE' || evaluation.status === 'PARTIALLY_ELIGIBLE';
  const evidence = scheme.evidenceExplanation || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090C16] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/30">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {scheme.scheme_code}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {scheme.category} • {scheme.level}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950/30 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cedar Authorized</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Title & Score Summary */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {scheme.scheme_name}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="flex-shrink-0 text-center px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08]">
                <div className="text-2xl font-mono font-extrabold text-blue-400">
                  {evaluation.eligibilityScore}%
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Corretto Score
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Evidence Agent Statutory Reasoning */}
          <div className="rounded-xl bg-surface-soft/80 border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Evidence Agent Statutory Synthesis</span>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed">
              {isEligible ? evidence.whyEligible : evidence.whyIneligible}
            </p>

            {scheme.statutory_evidence && (
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] text-xs font-mono text-zinc-400 leading-relaxed">
                <span className="text-zinc-500 font-bold block mb-1">Official Gazette / Directive Citation:</span>
                "{scheme.statutory_evidence}"
              </div>
            )}
          </div>

          {/* Section 2: Corretto Deterministic Criteria Table */}
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
              Corretto Rules Engine Breakdown (Hard Demographics):
            </div>

            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.03] text-zinc-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="p-3">Criterion</th>
                    <th className="p-3">Required Rule</th>
                    <th className="p-3">Your Profile</th>
                    <th className="p-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {evaluation.criteriaResults?.map((c, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-medium text-zinc-200">{c.label}</td>
                      <td className="p-3 text-zinc-400">{c.required}</td>
                      <td className="p-3 text-zinc-200 font-semibold">{c.actual}</td>
                      <td className="p-3 text-right">
                        {c.passed ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-rose-950/40 text-rose-400 border border-rose-800/50">
                            <XCircle className="w-3 h-3" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Document Status & Firecracker MicroVM Trigger */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Required Documents & Verification Status:
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Processed in Firecracker microVM
              </span>
            </div>

            <div className="space-y-2">
              {scheme.required_documents?.map((doc) => {
                const isMissing = evaluation.missingDocuments?.some((m) => m.id === doc.id);
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition-colors ${
                      isMissing
                        ? 'bg-amber-950/10 border-amber-900/30 text-amber-200'
                        : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {isMissing ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold">{doc.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          {isMissing ? 'Pending sandbox verification' : 'Verified via Firecracker OCR'}
                        </div>
                      </div>
                    </div>

                    {isMissing && (
                      <button
                        onClick={() => onUploadDocument(doc.id)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Verify Doc</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-black/40">
          <button
            onClick={() => {
              onClose();
              onOpenChecklist(scheme);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Application Checklist</span>
          </button>

          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono border border-white/[0.08] transition-colors"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
