import React, { useState, useEffect } from 'react';
import { FileCheck, ExternalLink, CheckSquare, Square, Copy, Check, Clock, AlertCircle, Printer } from 'lucide-react';

export default function ApplicationChecklist({ selectedScheme, allSchemes = [], verifiedDocIds = [] }) {
  const getSchemeId = (s) => s?.id || s?.scheme_id || s?.scheme_code || 'UP_SCHOLARSHIP_2024';
  const [activeSchemeId, setActiveSchemeId] = useState(getSchemeId(selectedScheme));
  const [checklistData, setChecklistData] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);

  // Switch when selectedScheme prop changes
  useEffect(() => {
    if (selectedScheme) {
      setActiveSchemeId(getSchemeId(selectedScheme));
    }
  }, [selectedScheme]);

  useEffect(() => {
    if (!activeSchemeId) return;
    fetch(`/api/checklist/${encodeURIComponent(activeSchemeId)}`)
      .then(res => res.json())
      .then(raw => {
        // Normalize fields for both camelCase and snake_case
        const data = {
          schemeName: raw.schemeName || raw.scheme_name || raw.name || 'Government Scheme',
          schemeId: raw.schemeId || raw.scheme_id || raw.scheme_code || activeSchemeId,
          officialPortalUrl: raw.officialPortalUrl || raw.official_url || raw.application_url || 'https://scholarships.gov.in',
          estimatedProcessingDays: raw.estimatedProcessingDays || raw.estimated_processing_days || '30-45 days',
          applicationFee: raw.applicationFee || raw.application_fee || '₹0 (Free Government Portal)',
          requiredDocuments: (raw.requiredDocuments || raw.required_documents || []).map(d => typeof d === 'string' ? { id: d, name: d.replace(/_/g, ' ').toUpperCase(), essential: true } : d),
          steps: (raw.steps || []).map((s, idx) => ({
            stepNumber: s.stepNumber || s.step_number || (idx + 1),
            title: s.title || `Step ${idx + 1}`,
            description: s.description || ''
          }))
        };
        setChecklistData(data);
        // Pre-check verified documents
        const initialChecked = {};
        (data.requiredDocuments || []).forEach(doc => {
          if (verifiedDocIds.includes(doc.id)) {
            initialChecked[doc.id] = true;
          }
        });
        setCheckedItems(initialChecked);
      })
      .catch(err => console.error('Error fetching checklist:', err));
  }, [activeSchemeId, verifiedDocIds]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = () => {
    if (!checklistData) return;
    const text = `CivicSahayak Application Checklist - ${checklistData.schemeName}\nOfficial Portal: ${checklistData.officialPortalUrl}\nProcessing Time: ${checklistData.estimatedProcessingDays}\n\nRequired Documents:\n` +
      checklistData.requiredDocuments.map(d => `[${checkedItems[d.id] ? 'X' : ' '}] ${d.name}`).join('\n') +
      `\n\nNext Steps:\n` +
      checklistData.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.description}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeScheme = allSchemes.find(s => (s.id === activeSchemeId || s.scheme_id === activeSchemeId || s.scheme_code === activeSchemeId)) || selectedScheme;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner (Calm & Clear) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090C16] border border-white/[0.08] shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Application Checklist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Required Documents & Filing Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
            Follow this step-by-step checklist to prepare official documents and submit directly to government portals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 text-xs font-mono border border-white/[0.08] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 text-xs font-mono border border-white/[0.08] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Scheme Quick Switcher Pills */}
      {allSchemes.length > 0 && (
        <div>
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
            Switch Target Scheme:
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {allSchemes.slice(0, 8).map((s, idx) => {
              const sid = s.id || s.scheme_id || s.scheme_code || `scheme-${idx}`;
              return (
                <button
                  key={sid}
                  onClick={() => setActiveSchemeId(sid)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    activeSchemeId === sid
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-surface-soft/60 text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
                  }`}
                >
                  {s.scheme_code || s.scheme_id || s.name || s.scheme_name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklist Content */}
      {checklistData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 7 Cols: Interactive Document Checklist */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Required Documents Card */}
            <div className="p-6 rounded-2xl bg-surface-soft/80 border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Mandatory Statutory Documents</span>
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {Object.values(checkedItems).filter(Boolean).length} / {checklistData.requiredDocuments?.length} collected
                </span>
              </div>

              <div className="space-y-2.5">
                {checklistData.requiredDocuments?.map((doc) => {
                  const isChecked = !!checkedItems[doc.id];
                  const isAutoVerified = verifiedDocIds.includes(doc.id);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleCheck(doc.id)}
                      className={`flex items-start justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-black/30 border-white/[0.07] text-zinc-300 hover:border-blue-400/40 hover:bg-black/50 hover:scale-[1.01] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button type="button" className="mt-0.5 text-zinc-400">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 transition-transform duration-150 scale-110" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors" />
                          )}
                        </button>
                        <div>
                          <div className={`text-xs font-mono font-medium ${isChecked ? 'line-through text-zinc-400' : 'text-zinc-100'}`}>
                            {doc.name}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            {isAutoVerified ? 'Auto-verified via Firecracker OCR sandbox' : doc.essential ? 'Mandatory for eligibility' : 'Supplementary'}
                          </div>
                        </div>
                      </div>

                      {isAutoVerified && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                          Verified ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div className="p-6 rounded-2xl bg-surface-soft/80 border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white pb-3 border-b border-white/[0.06]">
                Sequential Submission Roadmap
              </h3>

              <div className="space-y-3">
                {checklistData.steps?.map((step) => (
                  <div 
                    key={step.stepNumber} 
                    className="flex items-start space-x-3.5 p-3 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03] hover:translate-x-1.5 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600/30 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-blue-200 transition-colors mb-0.5">
                        {step.title}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right 5 Cols: Meta & Portal Link */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Portal Action Card */}
            <div className="p-6 rounded-2xl bg-[#090C16] border border-white/[0.1] shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-blue-400 uppercase">
                <span>Direct Official Destination</span>
              </div>

              <h4 className="text-lg font-bold text-white">
                {checklistData.schemeName}
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/[0.05]">
                  <span className="text-zinc-400 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Est. Processing:</span>
                  </span>
                  <span className="text-white font-semibold">{checklistData.estimatedProcessingDays}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/[0.05]">
                  <span className="text-zinc-400">Application Fee:</span>
                  <span className="text-emerald-400 font-semibold">{checklistData.applicationFee}</span>
                </div>
              </div>

              <a
                href={checklistData.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors shadow-glow-sm"
              >
                <span>Launch Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] font-mono text-zinc-500 text-center">
                Never pay middle-men or informal agents. Applications are 100% free on official .gov.in domains.
              </p>
            </div>

            {/* Rejection Prevention Tips */}
            <div className="p-5 rounded-2xl bg-amber-950/10 border border-amber-900/30 text-amber-200 text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Rejection Prevention Alert:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                Ensure your bank account is seeded with Aadhaar on the NPCI mapper before final application submission. 84% of payment DBT rejections occur due to dormant accounts or unlinked NPCI maps.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
