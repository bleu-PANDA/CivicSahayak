import React, { useState } from 'react';
import { Database, ShieldCheck, Cpu, Layers, Terminal, Server, CheckCircle2, Box, Globe, Lock } from 'lucide-react';

export const ARCHITECTURE_COMPONENTS = [
  {
    id: 'frontend',
    name: 'Frontend Web App',
    technology: 'React + Vite + TailwindCSS',
    cost: '$0.00',
    role: 'ssych UI data-dense citizen interface with natural language command bar, real-time scheme scoring gauges, document sandbox, and checklist generator.',
    productionMapping: 'AWS CloudFront + S3 static hosting or EKS Pod'
  },
  {
    id: 'api-server',
    name: 'Gateway API Server',
    technology: 'Node.js + Express',
    cost: '$0.00',
    role: 'Orchestrates Strands multi-agent task delegation, Cedar authorization checks, and REST endpoints.',
    productionMapping: 'AWS EKS Distro / AWS Lambda via SAM'
  },
  {
    id: 'strands-agents',
    name: 'Strands Multi-Agent SDK',
    technology: 'Strands Agents Framework',
    cost: '$0.00',
    role: '6 specialized agents (Profile, Scheme, Eligibility, Evidence, Recommendation, Orchestrator) coordinating tasks.',
    productionMapping: 'Autonomous Agent Pods in EKS Distro'
  },
  {
    id: 'corretto-rules',
    name: 'Rules Engine',
    technology: 'Amazon Corretto Java 21',
    cost: '$0.00',
    role: 'Deterministic weighted rules evaluator. Decouples legal eligibility from probabilistic LLM hallucinations.',
    productionMapping: 'Spring Boot Microservice on EKS'
  },
  {
    id: 'cedar-auth',
    name: 'Cedar Authorization Engine',
    technology: 'Cedar Policy Engine (AWS Open Source)',
    cost: '$0.00',
    role: 'Policy-Based Access Control (PBAC). Enforces least privilege: citizens see only their records; agents access only designated tools.',
    productionMapping: 'Amazon Verified Permissions / Cedar Microservice'
  },
  {
    id: 'firecracker-sandbox',
    name: 'Document Processing Sandbox',
    technology: 'Firecracker MicroVMs',
    cost: '$0.00',
    role: 'Spawns ephemeral, memory-capped Linux KVM microVMs with Tesseract OCR. Destroyed immediately after extraction (Zero Data Retention).',
    productionMapping: 'AWS Lambda / EKS Firecracker Provider'
  },
  {
    id: 'opensearch',
    name: 'Statutory Knowledge Base',
    technology: 'OpenSearch (Local / Container)',
    cost: '$0.00',
    role: 'Stores 20+ government scheme notifications, gazette rules, and statutory evidence. Powers BM25 and vector search.',
    productionMapping: 'Amazon OpenSearch Service'
  },
  {
    id: 'database',
    name: 'Persistence & Audit Store',
    technology: 'PostgreSQL',
    cost: '$0.00',
    role: 'Stores user profiles, application history, and agent_logs table for complete auditability.',
    productionMapping: 'Amazon RDS PostgreSQL'
  }
];

export default function ArchitectureView() {
  const [selectedCompId, setSelectedCompId] = useState('strands-agents');
  const selectedComp = ARCHITECTURE_COMPONENTS.find(c => c.id === selectedCompId) || ARCHITECTURE_COMPONENTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner (Calm & Focused) */}
      <div className="p-6 rounded-2xl bg-[#090C16] border border-white/[0.08] shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>System Blueprint</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sovereign Open-Source Architecture
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
          Built with open-source tools matching enterprise AWS production services: Finch, Corretto 21, Cedar PBAC, Firecracker, and OpenSearch.
        </p>
      </div>

      {/* Visual Component Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ARCHITECTURE_COMPONENTS.map((comp) => {
          const isSelected = selectedCompId === comp.id;
          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompId(comp.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/20 border-blue-500/50 shadow-glow-sm'
                  : 'bg-surface-soft/60 border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                  <span>{comp.cost} Dev Cost</span>
                  <span className="text-emerald-400 font-bold">Open-Source</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{comp.name}</h3>
                <div className="text-xs font-mono text-blue-400 mb-2">{comp.technology}</div>
              </div>
              <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-zinc-400">
                Click to inspect role & production mapping →
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Component Deep Dive */}
      <div className="p-6 rounded-2xl bg-surface-soft/80 border border-white/[0.08] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">Component Specification</span>
            <h3 className="text-lg font-bold text-white">{selectedComp.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
              {selectedComp.technology}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Local Implementation Role:</div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
              {selectedComp.role}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Production AWS / Sovereign Deployment:</div>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans">
              {selectedComp.productionMapping}
            </p>
            <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04]">
              Zero code changes required to transition from local Finch to AWS EKS or Air-Gapped State Data Centers.
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Triad Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
            <Server className="w-4 h-4" />
            <span>Option 1: AWS EKS Cloud</span>
          </div>
          <h4 className="text-sm font-bold text-white">Full AWS Managed Services</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Deploy containers onto AWS EKS, replace LocalStack with Amazon S3, use Amazon Managed OpenSearch and RDS.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
            <Box className="w-4 h-4" />
            <span>Option 2: EKS Anywhere</span>
          </div>
          <h4 className="text-sm font-bold text-white">On-Premises Government Data Centers</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Keep citizen biometric and demographic data strictly within sovereign national boundaries using EKS Anywhere.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090C16] border border-white/[0.08] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>Option 3: Air-Gapped Offline</span>
          </div>
          <h4 className="text-sm font-bold text-white">Zero External Internet Dependency</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Runs 100% on self-contained local clusters or edge kiosks without relying on external commercial cloud APIs.
          </p>
        </div>
      </div>

    </div>
  );
}
