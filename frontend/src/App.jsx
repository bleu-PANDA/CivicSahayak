import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero, { PRESET_CITIZENS } from './components/Hero';
import SchemeCard from './components/SchemeCard';
import SchemeDetailModal from './components/SchemeDetailModal';
import DocumentSandbox from './components/DocumentSandbox';
import SchemeBundler from './components/SchemeBundler';
import ApplicationChecklist from './components/ApplicationChecklist';
import AgentTelemetryConsole from './components/AgentTelemetryConsole';
import ArchitectureView from './components/ArchitectureView';
import { Sparkles, Shield, User, Filter, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(PRESET_CITIZENS[0].query);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Data states
  const [userProfile, setUserProfile] = useState(PRESET_CITIZENS[0].profile);
  const [schemes, setSchemes] = useState([]);
  const [recommendedBundle, setRecommendedBundle] = useState(null);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [verifiedDocIds, setVerifiedDocIds] = useState(['income_certificate']);
  
  // Modal & Target States
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);
  const [targetChecklistScheme, setTargetChecklistScheme] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run evaluation
  const handleEvaluate = async (queryText, profileOverride = null, category = 'All') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText || currentQuery,
          profile: profileOverride || userProfile,
          verifiedDocIds,
          category: category || selectedCategory
        })
      });

      const data = await response.json();
      if (data.success) {
        setUserProfile(data.profile);
        setSchemes(data.schemes);
        setRecommendedBundle(data.recommendation);
        setTelemetryLogs(data.telemetryLogs);
        showToast(`Evaluation complete: ${data.schemes.length} schemes ranked by Corretto`);
      }
    } catch (err) {
      console.error('Evaluation API error:', err);
      showToast('Error executing agent pipeline. Using cached rules.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleEvaluate(PRESET_CITIZENS[0].query, PRESET_CITIZENS[0].profile, 'All');
  }, []);

  // When a document is verified in the Firecracker sandbox
  const handleDocumentVerified = (docType, extractedData) => {
    if (!verifiedDocIds.includes(docType)) {
      const updated = [...verifiedDocIds, docType];
      setVerifiedDocIds(updated);

      // Re-evaluate with updated verified document list
      handleEvaluate(currentQuery, userProfile, selectedCategory);
      showToast(`Firecracker verified ${docType}! Scores updated with higher confidence.`);
    }
  };

  const handleOpenChecklist = (scheme) => {
    setTargetChecklistScheme(scheme);
    setActiveTab('checklist');
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans bg-[#02040A]">
      
      {/* Fixed Still Background Image (Bright & Visible) */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/bg-india-gate.jpg"
          alt="India Gate Background"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.04]"
        />
        {/* Soft subtle tint for card separation while keeping India Gate clearly visible */}
        <div className="absolute inset-0 bg-[#02040A]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/70 via-transparent to-black/10" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        verifiedDocCount={verifiedDocIds.length}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-blue-600/90 text-white font-mono text-xs shadow-2xl border border-blue-400/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pb-24">
        
        {/* Tab 1: Discovery Engine */}
        {activeTab === 'discovery' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <Hero
              onEvaluate={handleEvaluate}
              isLoading={isLoading}
              currentQuery={currentQuery}
              setCurrentQuery={setCurrentQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Extracted Profile Bar (Calm & Clean) */}
            {userProfile && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-3 px-5 rounded-2xl bg-surface-soft/60 border border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <span className="text-zinc-500 font-medium">Citizen Profile:</span>
                    <span className="text-white font-medium">
                      Age {userProfile.age}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-300">{userProfile.state}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400">₹{(userProfile.family_income_annual || 0).toLocaleString('en-IN')}/yr</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-blue-300">{userProfile.occupation}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">{userProfile.category}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-zinc-400">
                    <span>{schemes.length} matching programs</span>
                    <button
                      onClick={() => setActiveTab('sandbox')}
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                    >
                      <span>Verify documents</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Schemes Results Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Evaluated Benefits
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    {schemes.length} schemes
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-500 hidden sm:block">
                  Corretto 21 Deterministic Scoring
                </div>
              </div>

              {/* Grid Cards (Spacious) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onSelectScheme={setSelectedSchemeForModal}
                    onOpenChecklist={handleOpenChecklist}
                  />
                ))}
              </div>

              {schemes.length === 0 && !isLoading && (
                <div className="p-16 text-center rounded-2xl bg-surface-soft/40 border border-white/[0.06]">
                  <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                  <div className="text-sm font-medium text-zinc-300">No schemes found matching this criteria</div>
                  <p className="text-xs text-zinc-500 mt-1">Try broadening your description or selecting 'All' categories.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Document Sandbox (Firecracker) */}
        {activeTab === 'sandbox' && (
          <DocumentSandbox
            onDocumentVerified={handleDocumentVerified}
            verifiedDocIds={verifiedDocIds}
          />
        )}

        {/* Tab 3: Scheme Bundler */}
        {activeTab === 'bundler' && (
          <SchemeBundler
            currentBundle={recommendedBundle}
            onSelectScheme={setSelectedSchemeForModal}
          />
        )}

        {/* Tab 4: Application Checklist */}
        {activeTab === 'checklist' && (
          <ApplicationChecklist
            selectedScheme={targetChecklistScheme || schemes[0]}
            allSchemes={schemes}
            verifiedDocIds={verifiedDocIds}
          />
        )}

        {/* Tab 5: Agent Telemetry Console */}
        {activeTab === 'console' && (
          <AgentTelemetryConsole
            telemetryLogs={telemetryLogs}
            onRunSampleTrace={() => handleEvaluate(currentQuery, userProfile, selectedCategory)}
          />
        )}

        {/* Tab 6: Architecture View */}
        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

      </main>

      {/* Deep Dive Modal */}
      {selectedSchemeForModal && (
        <SchemeDetailModal
          scheme={selectedSchemeForModal}
          onClose={() => setSelectedSchemeForModal(null)}
          onUploadDocument={(docId) => {
            setSelectedSchemeForModal(null);
            setActiveTab('sandbox');
          }}
          onOpenChecklist={(scheme) => {
            setSelectedSchemeForModal(null);
            handleOpenChecklist(scheme);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#02040A] py-8 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">CivicOS</span>
            <span>—</span>
            <span>Government Benefits Discovery Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Zero AWS Cost</span>
            <span>•</span>
            <span>Sovereign AI</span>
            <span>•</span>
            <span>Social Impact Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
