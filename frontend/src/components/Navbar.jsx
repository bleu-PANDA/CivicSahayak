import React from 'react';
import { ShieldCheck, Cpu, Terminal, Layers, FileCheck, Search, Sparkles, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, verifiedDocCount = 0 }) {
  const navItems = [
    { id: 'discovery', label: 'Discovery Engine', icon: Search },
    { id: 'sandbox', label: 'Doc Sandbox (Firecracker)', icon: Cpu, badge: verifiedDocCount > 0 ? `${verifiedDocCount} verified` : null },
    { id: 'bundler', label: 'Scheme Bundler', icon: Layers },
    { id: 'checklist', label: 'Application Checklist', icon: FileCheck },
    { id: 'console', label: 'Agent Telemetry', icon: Terminal },
    { id: 'architecture', label: 'System Blueprint', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#02040A]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('discovery')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-glow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold tracking-tight text-white text-base">Civic<span className="text-blue-400">OS</span></span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                v1.0 Sovereign AI
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/30 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Cedar AuthZ & MicroVM Ready</span>
            </div>

            <button
              onClick={() => setActiveTab('console')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 border border-white/[0.08] transition-colors"
              title="Open Strands Agent Live Stream"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Telemetry</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-white/[0.05] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3 h-3 text-blue-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
