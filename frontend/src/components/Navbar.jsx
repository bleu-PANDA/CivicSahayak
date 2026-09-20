import React from 'react';
import { ShieldCheck, Cpu, Terminal, Layers, FileCheck, Search, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, verifiedDocCount = 0 }) {
  const navItems = [
    { id: 'discovery', label: 'Discovery', icon: Search },
    { id: 'sandbox', label: 'Sandbox', icon: Cpu, badge: verifiedDocCount > 0 ? verifiedDocCount : null },
    { id: 'bundler', label: 'Bundler', icon: Layers },
    { id: 'checklist', label: 'Checklist', icon: FileCheck },
    { id: 'console', label: 'Telemetry', icon: Terminal },
    { id: 'architecture', label: 'Architecture', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#02040A]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-14">
          
          {/* Brand */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group transition-transform duration-200 hover:scale-[1.03]" 
            onClick={() => setActiveTab('discovery')}
          >
            <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-400 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] transition-all duration-200">
              <ShieldCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <span className="font-semibold tracking-tight text-white text-sm sm:text-base">
              Civic<span className="text-blue-400">Sahayak</span>
            </span>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                    isActive
                      ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.08]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Indicator (Calm & Minimal) */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Engine Active</span>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex md:hidden overflow-x-auto py-1.5 space-x-1 border-t border-white/[0.05] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-medium'
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

