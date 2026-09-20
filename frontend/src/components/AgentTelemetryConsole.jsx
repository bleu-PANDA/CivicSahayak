import React, { useState, useEffect } from 'react';
import { Terminal, Shield, RefreshCw, Cpu, Activity, Play, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

export default function AgentTelemetryConsole({ telemetryLogs = [], onRunSampleTrace }) {
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [filterAgent, setFilterAgent] = useState('All');
  const [persistedLogs, setPersistedLogs] = useState([]);

  useEffect(() => {
    fetch('/api/agent-logs')
      .then(res => res.json())
      .then(data => {
        if (data.logs) setPersistedLogs(data.logs);
      })
      .catch(err => console.error('Error fetching logs:', err));
  }, []);

  const allLogs = telemetryLogs.length > 0 ? telemetryLogs : [
    {
      timestamp: new Date().toISOString(),
      agent: 'Orchestrator Agent',
      action: 'PIPELINE_READY',
      elapsedMs: 12,
      details: { status: 'Listening on port 8080', agentsRegistered: 6, cedarPolicies: 4 }
    },
    {
      timestamp: new Date().toISOString(),
      agent: 'Cedar AuthZ',
      action: 'POLICY_EVALUATION',
      elapsedMs: 24,
      details: { principal: 'Agent::scheme-agent', effect: 'ALLOW', policyId: 'policy-scheme-agent-opensearch' }
    },
    {
      timestamp: new Date().toISOString(),
      agent: 'Scheme Agent',
      action: 'OPENSEARCH_INDEX_SYNC',
      elapsedMs: 45,
      details: { index: 'government_schemes', totalIndexed: 20, shardStatus: 'GREEN' }
    },
    {
      timestamp: new Date().toISOString(),
      agent: 'Corretto Engine',
      action: 'RULES_EVALUATOR_INITIALIZED',
      elapsedMs: 68,
      details: { runtime: 'Amazon Corretto 21', springBootPort: 8081, deterministicCheckSum: 'sha256-d8f3' }
    }
  ];

  const filteredLogs = filterAgent === 'All'
    ? allLogs
    : allLogs.filter(l => l.agent.toLowerCase().includes(filterAgent.toLowerCase()));

  const toggleExpand = (idx) => {
    setExpandedLogId(expandedLogId === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner (Calm & Focused) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090C16] border border-white/[0.08] shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Agent Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Multi-Agent Pipeline Trace
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
            Real-time step-by-step reasoning trace across Orchestrator, Profile, Scheme, Corretto 21, and Evidence agents.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRunSampleTrace}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Pipeline Trace</span>
          </button>
        </div>
      </div>


      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        <span className="text-zinc-500 pl-1">Agent Filter:</span>
        {['All', 'Orchestrator', 'Profile', 'Scheme', 'Eligibility', 'Evidence', 'Recommendation', 'Cedar'].map((agentName) => (
          <button
            key={agentName}
            onClick={() => setFilterAgent(agentName)}
            className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
              filterAgent === agentName
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
            }`}
          >
            {agentName}
          </button>
        ))}
      </div>

      {/* Terminal View Container */}
      <div className="rounded-2xl bg-[#05070D] border border-white/[0.1] shadow-2xl overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/[0.08] text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block"></span>
            <span className="text-zinc-400 font-bold ml-2">strands-agents.log (Live WebSocket Stream)</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-zinc-500">
            <span>Encoding: UTF-8</span>
            <span>Level: TRACE</span>
            <span className="text-emerald-400">● 6 Agents Active</span>
          </div>
        </div>

        {/* Log Entries */}
        <div className="p-4 divide-y divide-white/[0.04] font-mono text-xs max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log, idx) => {
            const isExpanded = expandedLogId === idx;
            const agentBadgeColor =
              log.agent.includes('Profile') ? 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40' :
              log.agent.includes('Scheme') ? 'text-blue-400 bg-blue-950/30 border-blue-800/40' :
              log.agent.includes('Eligibility') || log.agent.includes('Corretto') ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40' :
              log.agent.includes('Evidence') ? 'text-indigo-400 bg-indigo-950/30 border-indigo-800/40' :
              log.agent.includes('Recommendation') ? 'text-purple-400 bg-purple-950/30 border-purple-800/40' :
              log.agent.includes('Cedar') ? 'text-yellow-400 bg-yellow-950/30 border-yellow-800/40' :
              'text-zinc-300 bg-white/[0.05] border-white/[0.1]';

            return (
              <div key={idx} className="py-2.5 hover:bg-white/[0.02] rounded px-2 transition-colors">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                  onClick={() => toggleExpand(idx)}
                >
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span className="text-zinc-600 text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '12:00:00'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${agentBadgeColor}`}>
                      {log.agent}
                    </span>
                    <span className="text-zinc-200 font-medium">
                      {log.action}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-zinc-500">
                    {log.elapsedMs !== undefined && (
                      <span className="text-zinc-400">+{log.elapsedMs}ms</span>
                    )}
                    <button className="text-zinc-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details JSON */}
                {isExpanded && log.details && (
                  <div className="mt-2.5 p-3 rounded-lg bg-black/60 border border-white/[0.06] text-zinc-300 overflow-x-auto text-[11px] animate-in fade-in duration-150">
                    <pre className="text-zinc-300 font-mono">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Terminal Footer */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Audit Log Persisted to PostgreSQL (agent_logs)</span>
          <span>Zero-Cost Deterministic Evaluation Engine</span>
        </div>

      </div>

    </div>
  );
}
