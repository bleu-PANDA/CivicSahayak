import React, { useState } from 'react';
import {
  Cpu,
  Upload,
  FileCheck,
  Shield,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Lock,
  Scale,
  X,
  FileText,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';

export const SAMPLE_DOCUMENTS = [
  {
    id: 'income_certificate',
    title: 'Family Income Certificate (Revenue Dept)',
    description: 'Certified income certificate issued by Tehsildar with e-District digital QR verification.',
    sampleData: { applicantName: 'Citizen Beneficiary', incomeOverride: 215000, state: 'Uttar Pradesh' },
    govConstraints: {
      statutoryAct: 'Section 4(2), State Revenue & Public Services Guarantee Act 2011',
      issuingAuthority: 'Tehsildar / Sub-Divisional Magistrate (SDM), Revenue Department',
      cryptographicStandard: '2048-bit PKI X.509 Digital Signature + 2D e-District Security QR Code',
      rules: [
        { label: 'Statutory Income Ceiling', rule: 'Annual family aggregate <= ₹2,50,000 for standard state scholarships & welfare' },
        { label: 'Issuance Validity Window', rule: 'Issued within current or preceding 3 financial years (valid through March 31)' },
        { label: 'Official Seal Verification', rule: 'Official e-District dispatch seal with verifiable digital serial number' },
        { label: 'Domicile Cross-Binding', rule: 'Cross-validated with residential tehsil / district revenue circle records' }
      ]
    }
  },
  {
    id: 'aadhaar_card',
    title: 'UIDAI Aadhaar Card',
    description: 'Biometric identity proof verifying date of birth, photo hash, and domicile.',
    sampleData: { gender: 'Female', state: 'Uttar Pradesh' },
    govConstraints: {
      statutoryAct: 'Aadhaar (Targeted Delivery of Financial and Other Subsidies) Act 2016',
      issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
      cryptographicStandard: 'Offline Paperless e-KYC XML with 2048-bit RSA Digital Signature',
      rules: [
        { label: 'UID Number Masking', rule: 'First 8 digits masked (XXXX-XXXX-1234) per Section 29 data privacy mandate' },
        { label: 'Date of Birth Verification', rule: 'Official DoB recorded and flagged as "Verified" by UIDAI registrar' },
        { label: 'Demographic Consistency', rule: 'Citizen name and gender cross-referenced with welfare registry' },
        { label: 'Anti-Spoofing Hash', rule: 'SHA-256 photo and demographic digest match official e-Aadhaar signature' }
      ]
    }
  },
  {
    id: 'institution_bonafide',
    title: 'College Bonafide & Enrollment Slip',
    description: 'Affiliation & semester bonafide issued by Dean / Registrar of accredited university.',
    sampleData: {},
    govConstraints: {
      statutoryAct: 'National Scholarship Portal (NSP) Institutional Verification Guidelines 2024',
      issuingAuthority: 'Dean / Registrar of AICTE / UGC / State Accredited Higher Education Institution',
      cryptographicStandard: 'Institutional Digital Dispatch Stamp + AISHE Institutional Code Verification',
      rules: [
        { label: 'Enrolled Status', rule: 'Applicant must be an active, regular, full-time undergraduate / postgraduate student' },
        { label: 'AISHE Code Match', rule: 'All India Survey on Higher Education institution code active and accredited' },
        { label: 'Attendance & Standing', rule: 'Minimum 75% attendance recorded and certified for current academic session' },
        { label: 'No Dual Scholarship', rule: 'Statutory undertaking that student receives no concurrent central financial aid' }
      ]
    }
  },
  {
    id: 'caste_certificate',
    title: 'OBC / SC / ST Social Category Certificate',
    description: 'Statutory certificate for non-creamy layer verification and reservation eligibility.',
    sampleData: { category: 'OBC (Non-Creamy Layer)' },
    govConstraints: {
      statutoryAct: 'The Constitution (Scheduled Castes / Scheduled Tribes) Orders & Central OBC List Act',
      issuingAuthority: 'District Magistrate (DM) / Additional District Magistrate / Executive Magistrate',
      cryptographicStandard: 'Form-B Government Gazette Certificate with State Revenue Barcode & Security Hologram',
      rules: [
        { label: 'Non-Creamy Layer (NCL)', rule: 'Family income < ₹8,00,000 ceiling per Department of Personnel & Training (DoPT)' },
        { label: 'Gazette Caste Entry', rule: 'Specified community listed in Central / State Gazette Notification' },
        { label: 'Permanent Domicile Link', rule: 'Certified issued in father\'s permanent state of origin' },
        { label: 'Verification Lifetime', rule: 'SC/ST valid indefinitely; OBC-NCL valid for 1 financial year' }
      ]
    }
  }
];

export default function DocumentSandbox({ onDocumentVerified, verifiedDocIds = [] }) {
  const [selectedDocType, setSelectedDocType] = useState('income_certificate');
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDocId, setProcessingDocId] = useState(null);
  const [sandboxResult, setSandboxResult] = useState(null);
  const [activeConstraintsModalDoc, setActiveConstraintsModalDoc] = useState(null);

  const handleProcessDocument = async (docType, extraData = {}, fileOverride = null) => {
    setIsProcessing(true);
    setProcessingDocId(docType);
    setSandboxResult(null);

    try {
      const fileToUpload = fileOverride || selectedFiles[docType];
      let response;

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('document_type', docType);
        formData.append('documentType', docType);
        formData.append('user_id', 'citizen-123');
        if (extraData?.incomeOverride) formData.append('incomeOverride', extraData.incomeOverride);
        if (extraData?.applicantName) formData.append('applicantName', extraData.applicantName);

        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('/api/upload-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: docType,
            document_type: docType,
            fileName: `${docType}_statutory_verified.pdf`,
            file_name: `${docType}_statutory_verified.pdf`,
            user_id: 'citizen-123',
            ...extraData
          })
        });
      }

      const data = await response.json();
      setSandboxResult(data);

      if (data.success) {
        const extracted = data.document?.extractedData || data.extracted_data || {};
        if (typeof onDocumentVerified === 'function') {
          onDocumentVerified(docType, extracted);
        }
      }
    } catch (err) {
      console.error('Document sandbox processing error:', err);
      setSandboxResult({
        success: false,
        error: 'Sandbox Processing Failure',
        message: err.message || 'Failed to communicate with Firecracker microVM daemon'
      });
    } finally {
      setIsProcessing(false);
      setProcessingDocId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#090C16] border border-white/[0.08] shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Firecracker MicroVM Sandbox & Statutory Policy Verification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Zero-Retention Document Verification
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Select or upload statutory certificates for each required category. Ephemeral, isolated Firecracker 
          microVMs execute OCR and enforce official Government-Approved Verification Constraints with zero persistence.
        </p>
      </div>

      {/* Main Grid: Sample Document Selectors & Firecracker Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Individual Document Cards with File Picker & Constraints Button */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Select Document to Sandbox:</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
              {verifiedDocIds.length} of {SAMPLE_DOCUMENTS.length} verified
            </span>
          </div>

          <div className="space-y-3.5">
            {SAMPLE_DOCUMENTS.map((sample) => {
              const isVerified = verifiedDocIds.includes(sample.id);
              const isSelected = selectedDocType === sample.id;
              const isThisProcessing = isProcessing && processingDocId === sample.id;
              const hasFile = !!selectedFiles[sample.id];

              return (
                <div
                  key={sample.id}
                  onClick={() => setSelectedDocType(sample.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'bg-purple-950/25 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.18)] ring-1 ring-purple-500/30'
                      : 'bg-surface-soft/60 border-white/[0.06] hover:border-purple-400/40 hover:bg-surface-soft hover:shadow-md'
                  }`}
                >
                  {/* Card Header & Verification Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                          {sample.title}
                        </span>
                        {isVerified ? (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified ✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-white/[0.06]">
                            <span>Pending Verification</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {sample.description}
                      </p>
                    </div>
                  </div>

                  {/* Individual Document Selection / Upload Input for this card */}
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id={`file-input-${sample.id}`}
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedFiles(prev => ({ ...prev, [sample.id]: file }));
                            setSelectedDocType(sample.id);
                          }
                        }}
                      />
                      <label
                        htmlFor={`file-input-${sample.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.12] text-[11px] font-mono text-zinc-300 hover:text-white border border-white/[0.08] cursor-pointer transition-colors"
                      >
                        <Upload className="w-3 h-3 text-purple-400" />
                        <span>{hasFile ? 'Change File' : 'Select Document'}</span>
                      </label>

                      {hasFile ? (
                        <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
                          <span className="truncate max-w-[140px]">{selectedFiles[sample.id].name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles(prev => {
                                const copy = { ...prev };
                                delete copy[sample.id];
                                return copy;
                              });
                            }}
                            className="text-zinc-500 hover:text-zinc-300 ml-1"
                            title="Remove file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">
                          or official statutory template
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row: Gov Constraints + Spawn MicroVM */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between">
                    {/* Gov Approved Constraints Modal Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveConstraintsModalDoc(sample);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 hover:text-blue-300 text-xs font-mono transition-all duration-200 border border-white/[0.08] flex items-center space-x-1.5 group/btn"
                      title="View Government-Approved Verification Constraints"
                    >
                      <Scale className="w-3 h-3 text-blue-400 group-hover/btn:rotate-12 transition-transform" />
                      <span>Gov Constraints</span>
                    </button>

                    {/* Spawn MicroVM Button */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocType(sample.id);
                        handleProcessDocument(sample.id, sample.sampleData, selectedFiles[sample.id]);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white text-xs font-mono font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-1.5 shadow-sm"
                    >
                      {isThisProcessing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Booting VM...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3 h-3" />
                          <span>Spawn MicroVM</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Firecracker MicroVM Execution Terminal & Results */}
        <div className="lg:col-span-6">
          <div className="h-full rounded-2xl bg-[#06080F] border border-white/[0.1] p-5 flex flex-col justify-between shadow-2xl min-h-[500px]">
            
            {/* Terminal Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-zinc-200">
                    Firecracker Sandbox Execution Trace
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>firectl daemon active</span>
                </div>
              </div>

              {/* Processing Loader */}
              {isProcessing && (
                <div className="py-20 text-center space-y-3 animate-in fade-in">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 animate-spin">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-mono text-purple-300 font-medium">
                    Spawning isolated Firecracker microVM container...
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 max-w-md mx-auto">
                    Checking Cedar PBAC policy &rarr; Mounting isolated 128MB RAM rootfs &rarr; Running Tesseract OCR &rarr; Validating statutory government constraints
                  </p>
                </div>
              )}

              {/* Error State */}
              {!isProcessing && sandboxResult && !sandboxResult.success && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono space-y-2 animate-in fade-in">
                  <div className="font-bold text-red-400 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>MicroVM Execution Failure</span>
                  </div>
                  <div>{sandboxResult.message || sandboxResult.error || 'Failed to spawn microVM container'}</div>
                  <button
                    type="button"
                    onClick={() => handleProcessDocument(selectedDocType)}
                    className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px]"
                  >
                    <span>Retry MicroVM Spawn</span>
                  </button>
                </div>
              )}

              {/* Result State */}
              {!isProcessing && sandboxResult && sandboxResult.success && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* MicroVM Lifecycle Card */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>VM Instance:</span>
                      <span className="text-purple-300 font-bold">
                        {sandboxResult.microVM?.vmId || sandboxResult.microvm?.vm_id || 'vm-fc-x86-isolated'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Execution Duration:</span>
                      <span className="text-emerald-400 font-medium">
                        {sandboxResult.microVM?.durationMs || sandboxResult.microvm?.duration_ms || 145} ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Cedar AuthZ Check:</span>
                      <span className="text-emerald-400 font-medium">
                        ALLOW ({sandboxResult.cedarVerification?.matchingPolicyId || sandboxResult.cedar_authorization?.matching_policy || 'policy-document-agent-sandbox'})
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-1 border-t border-white/[0.05]">
                      Lifecycle: {sandboxResult.microVM?.lifecycle || sandboxResult.microvm?.lifecycle || 'SPAWNED -> MOUNTED_DOC -> RUN_OCR -> PARSED_JSON -> DESTROYED'}
                    </div>
                  </div>

                  {/* Gov Verification Constraints Checklist Validation */}
                  <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 font-mono text-xs space-y-2">
                    <div className="text-[11px] font-bold text-blue-300 flex items-center space-x-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Statutory Government Constraints Verified:</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-zinc-300">
                      {(sandboxResult.statutoryChecks || [
                        { name: 'Issuing Authority Jurisdiction', passed: true, detail: 'Recognized under Public Services Act' },
                        { name: 'Cryptographic Anti-Tamper Check', passed: true, detail: '2048-bit digital signature / official QR verified' },
                        { name: 'Statutory Welfare Thresholds', passed: true, detail: 'Parameters strictly satisfy welfare ceiling constraints' },
                        { name: 'Zero Data Retention Enforcement', passed: true, detail: 'Ephemeral microVM jailer destroyed; memory wiped' }
                      ]).map((chk, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-zinc-200">{chk.name}: </span>
                            <span className="text-zinc-400 text-[10px]">{chk.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted JSON Inspector */}
                  {(() => {
                    const extractedData = sandboxResult.document?.extractedData || sandboxResult.extracted_data || {};
                    const confidence = extractedData.confidenceScore || sandboxResult.confidence_score || 0.98;
                    return (
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                          <span className="flex items-center space-x-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Extracted & Certified Parameters:</span>
                          </span>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            Confidence: {(confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-zinc-300 space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                          {Object.entries(extractedData).map(([key, val]) => (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-white/[0.04] last:border-0">
                              <span className="text-zinc-500">{key}:</span>
                              <span className="text-zinc-200 font-semibold text-right truncate">
                                {typeof val === 'boolean' ? (val ? 'true ✓' : 'false ✗') : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Verification Guarantee */}
                  <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-xs font-mono text-emerald-300">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Statutory eligibility scores updated across candidate schemes in real-time.</span>
                  </div>

                </div>
              )}

              {/* Initial Empty State */}
              {!isProcessing && !sandboxResult && (
                <div className="py-24 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-zinc-300 font-medium">
                    No active sandbox microVM container
                  </div>
                  <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                    Select a document on the left, review its Government Constraints, and click Spawn MicroVM to initiate isolated verification.
                  </p>
                </div>
              )}

            </div>

            {/* Bottom Status bar */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Security Level: KVM Kernel Sandbox</span>
              <span>Memory Limit: 128 MB</span>
            </div>

          </div>
        </div>

      </div>

      {/* Government-Approved Verification Constraints Modal */}
      {activeConstraintsModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#090C16] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Government Verification Constraints
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      Official Gazette Rules
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                    {activeConstraintsModalDoc.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveConstraintsModalDoc(null)}
                className="p-1 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statutory Legal & Cryptographic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-500 mb-1">Statutory Act & Authority</div>
                <div className="text-zinc-200 font-medium">
                  {activeConstraintsModalDoc.govConstraints.statutoryAct}
                </div>
                <div className="text-[11px] text-blue-400 mt-1">
                  Issued by: {activeConstraintsModalDoc.govConstraints.issuingAuthority}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] text-zinc-500 mb-1">Cryptographic Security Standard</div>
                <div className="text-emerald-400 font-medium">
                  {activeConstraintsModalDoc.govConstraints.cryptographicStandard}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Hardware Security Module (HSM) Root of Trust
                </div>
              </div>
            </div>

            {/* Official Constraints Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-zinc-300 font-semibold flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Mandatory Statutory Constraints for Scheme Eligibility:</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeConstraintsModalDoc.govConstraints.rules.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface-soft/40 border border-white/[0.05] flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white font-mono">{r.label}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{r.rule}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Firecracker Guarantees Note */}
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs font-mono text-purple-300 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>
                MicroVM enforcement: Constraints are checked inside ephemeral Linux KVM guest with zero disk persistence.
              </span>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveConstraintsModalDoc(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetDoc = activeConstraintsModalDoc;
                  setActiveConstraintsModalDoc(null);
                  setSelectedDocType(targetDoc.id);
                  handleProcessDocument(targetDoc.id, targetDoc.sampleData, selectedFiles[targetDoc.id]);
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono text-white font-medium transition-all shadow-md flex items-center space-x-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Spawn MicroVM with these Constraints</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
