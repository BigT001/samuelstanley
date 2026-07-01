"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Starfield } from "../components/Starfield";
import {
  Monitor,
  Terminal,
  Settings,
  Users,
  RefreshCw,
  Plus,
  Trash2,
  LogOut,
  CheckCircle,
  Sparkles,
  Lock,
  Copy,
  Check,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Flame,
  Globe
} from "lucide-react";

type TabId = "overview" | "logs" | "clients" | "alerts" | "agent";

export default function OSPage() {
  const [secret, setSecret] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  
  // Shared state loaded from APIs
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [targetLogClientId, setTargetLogClientId] = useState<string>("");

  // Check auth session
  useEffect(() => {
    const saved = sessionStorage.getItem("agent_secret");
    if (saved) {
      setSecret(saved);
      setIsAuthorized(true);
    }
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " · " +
        d.toLocaleDateString([], { month: "short", day: "numeric" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch clients & global stats
  const fetchDashboardData = async () => {
    if (!secret) return;
    setLoading(true);
    try {
      // 1. Fetch clients status
      const res = await fetch("/api/monitor/status", {
        headers: { "Authorization": `Bearer ${secret}` }
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.sites);
        
        // 2. Fetch recent logs from first client if exists
        if (data.sites.length > 0) {
          const logsRes = await fetch(`/api/monitor/logs?clientId=${data.sites[0].id}&limit=5`, {
            headers: { "Authorization": `Bearer ${secret}` }
          });
          const logsData = await logsRes.json();
          if (logsData.success) {
            setRecentLogs(logsData.logs);
          }
        }
      }
    } catch (err) {
      console.error("Dashboard connection failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchDashboardData();
    }
  }, [isAuthorized]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;
    setVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/agent/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secret.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthorized(true);
        sessionStorage.setItem("agent_secret", secret.trim());
      } else {
        throw new Error(data.error || "Access Denied");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setVerifying(false);
    }
  };

  const terminateSession = () => {
    if (confirm("Shutdown workstation session?")) {
      setIsAuthorized(false);
      setSecret("");
      sessionStorage.removeItem("agent_secret");
    }
  };

  const triggerScan = async () => {
    setPinging(true);
    try {
      const res = await fetch("/api/monitor/status", {
        method: "POST",
        headers: { "Authorization": `Bearer ${secret}` }
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.results);
      }
    } catch (err) {
      alert("Scan timeout");
    } finally {
      setPinging(false);
    }
  };

  // Compute analytics from loaded clients list
  const totalNodes = clients.length;
  const activeNodes = clients.filter(c => c.active).length;
  const onlineNodes = clients.filter(c => c.status === "up" && c.active).length;
  const offlineNodes = clients.filter(c => c.status === "down" && c.active).length;
  
  const activeOnline = clients.filter(c => c.status === "up" && c.active && c.responseTime);
  const avgLatency = activeOnline.length > 0 
    ? Math.round(activeOnline.reduce((sum, c) => sum + (c.responseTime || 0), 0) / activeOnline.length) 
    : 0;

  const sslWarnings = clients.filter(c => {
    if (!c.sslExpiry) return false;
    const days = Math.round((new Date(c.sslExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days < 15;
  }).length;

  return (
    <div 
      className="relative min-h-screen text-[var(--text-primary)] flex flex-col font-sans select-none"
      style={{ background: "#03060f" }}
    >
      <Starfield />

      {!isAuthorized ? (
        /* PROmonitor OS LOCK SCREEN */
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border)] p-10 text-center shadow-2xl backdrop-blur-2xl bg-[rgba(5,8,16,0.7)]">
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl border border-red-500/10 bg-red-500/5 animate-pulse">
              <Lock className="w-8 h-8 text-[var(--coral)]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tighter mb-2">PROmonitor Workstation</h1>
            <p className="text-xs text-[var(--text-secondary)] mb-8 uppercase tracking-widest font-black">Admin Access Control</p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Administrative Key..."
                required
                disabled={verifying}
                autoFocus
                className="w-full border border-[var(--border)] rounded-2xl px-5 py-4 text-center text-sm focus:outline-none focus:border-[var(--coral)] bg-[var(--bg)] text-[var(--text-primary)]"
              />
              <button
                type="submit"
                disabled={verifying || !secret.trim()}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                style={{ background: "var(--coral)", boxShadow: "0 8px 32px rgba(255,77,77,0.3)" }}
              >
                {verifying ? "Decrypting Workstation..." : "Unlock Dashboard"}
              </button>
            </form>

            {error && <p className="mt-6 text-xs text-[var(--coral)] font-bold">✕ {error}</p>}
          </div>
        </div>
      ) : (
        /* DASHBOARD WORKSPACE */
        <div className="relative z-10 min-h-screen flex flex-col md:flex-row">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border)] backdrop-blur-xl bg-[rgba(10,15,26,0.8)] flex flex-col justify-between">
            <div>
              {/* Header Logo */}
              <div className="h-16 px-6 border-b border-[var(--border)] flex items-center gap-2.5 justify-between">
                <span className="font-extrabold text-sm tracking-widest text-[var(--coral)] flex items-center gap-2">
                  🛡️ PROmonitor <span className="text-[9px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/30 px-2 py-0.5 rounded-full font-mono font-black">OS</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 space-y-1">
                <SidebarButton icon={<Monitor className="w-4 h-4" />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                <SidebarButton icon={<Terminal className="w-4 h-4" />} label="Terminal Logs" active={activeTab === "logs"} onClick={() => {
                  setTargetLogClientId("");
                  setActiveTab("logs");
                }} />
                <SidebarButton icon={<Users className="w-4 h-4" />} label="Client Registry" active={activeTab === "clients"} onClick={() => setActiveTab("clients")} />
                <SidebarButton icon={<Settings className="w-4 h-4" />} label="Alert Webhooks" active={activeTab === "alerts"} onClick={() => setActiveTab("alerts")} />
                <div className="h-[1px] bg-[var(--border)] my-4 mx-2" />
                <SidebarButton icon={<Sparkles className="w-4 h-4 text-amber-400" />} label="AI Content Engine" active={activeTab === "agent"} onClick={() => setActiveTab("agent")} />
              </nav>
            </div>

            {/* Bottom Sidebar Panel */}
            <div className="p-4 border-t border-[var(--border)] space-y-3 bg-black/10">
              <div className="text-[10px] font-mono text-[var(--text-secondary)] px-2">
                <div>Time: {currentTime.split(" · ")[0]}</div>
                <div>Date: {currentTime.split(" · ")[1]}</div>
              </div>
              <button 
                onClick={terminateSession}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-xs font-bold text-red-400 bg-red-950/20 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                <LogOut className="w-4 h-4" /> Terminate Session
              </button>
            </div>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Top Workspace Header */}
            <header className="h-16 border-b border-[var(--border)] backdrop-blur-md bg-[rgba(10,15,26,0.5)] px-6 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)]">PROmonitor Workstation</h2>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400">
                  Secure Server Connected
                </span>
              </div>
            </header>

            {/* Main scrollable body */}
            <div className="flex-1 overflow-auto p-6 md:p-8 space-y-8 select-text">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Analytic Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Globe className="w-5 h-5 text-cyan-400" />} title="Registered Nodes" value={`${activeNodes} / ${totalNodes}`} desc="Active monitored websites" />
                    <StatCard icon={<ShieldCheck className="w-5 h-5 text-green-400" />} title="System Health" value={`${onlineNodes} / ${activeNodes}`} desc="Nodes currently online" />
                    <StatCard icon={<Activity className="w-5 h-5 text-purple-400" />} title="Average Latency" value={avgLatency ? `${avgLatency}ms` : "—"} desc="Global response latency" />
                    <StatCard icon={<Flame className="w-5 h-5 text-amber-500" />} title="SSL Warnings" value={`${sslWarnings}`} desc="Certs expiring within 15d" />
                  </div>

                  {/* Client Sites Health list */}
                  <div className="rounded-2xl border border-[var(--border)] p-6 backdrop-blur-md bg-[rgba(10,15,26,0.5)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                      <div>
                        <h3 className="text-lg font-bold">Monitored Web Nodes</h3>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Uptime pings execute automatically. Click Manual Scan to trigger immediate health sweeps.</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={fetchDashboardData} 
                          disabled={loading || pinging}
                          className="p-2 border border-[var(--border)] rounded-xl hover:bg-white/5 active:scale-95 transition-all text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loading && !pinging ? "animate-spin" : ""}`} /> Reload
                        </button>
                        <button 
                          onClick={triggerScan}
                          disabled={loading || pinging}
                          className="px-4 py-2.5 bg-[var(--coral)] hover:bg-[var(--coral-light)] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${pinging ? "animate-spin" : ""}`} />
                          {pinging ? "Pinging..." : "Manual scan"}
                        </button>
                      </div>
                    </div>

                    {loading && clients.length === 0 ? (
                      <div className="py-20 text-center animate-pulse text-[var(--text-secondary)] text-sm font-mono">Connecting to PROmonitor Database...</div>
                    ) : clients.length === 0 ? (
                      <div className="py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
                        No clients configured. Navigate to Client Registry to register websites.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[600px]">
                          <thead>
                            <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                              <th className="pb-3 pr-4">Node Name & URL</th>
                              <th className="pb-3 pr-4">Uptime Status</th>
                              <th className="pb-3 pr-4">Latency</th>
                              <th className="pb-3 pr-4">SSL Cert Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]/50">
                            {clients.map(site => {
                              const isUp = site.status === "up";
                              const ssl = getSSLStatus(site.sslExpiry);
                              return (
                                <tr key={site.id} className="group">
                                  <td className="py-4 pr-4">
                                    <div className="font-bold text-sm text-white">{site.name}</div>
                                    <a href={site.url} target="_blank" className="text-[11px] text-[var(--text-secondary)] hover:underline truncate max-w-xs block font-mono mt-0.5">
                                      {site.url}
                                    </a>
                                  </td>
                                  <td className="py-4 pr-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${isUp ? "text-green-400 border-green-500/20 bg-green-500/5" : "text-red-400 border-red-500/20 bg-red-500/5 animate-pulse"}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${isUp ? "bg-green-500" : "bg-red-500"}`} />
                                      {isUp ? "ONLINE" : "OFFLINE"}
                                    </span>
                                  </td>
                                  <td className="py-4 pr-4 font-mono font-bold text-sm">
                                    {isUp && site.responseTime ? `${site.responseTime} ms` : "—"}
                                  </td>
                                  <td className="py-4 pr-4 font-mono">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ssl.color}`}>
                                      {ssl.text}
                                    </span>
                                  </td>
                                  <td className="py-4 text-right">
                                    <button 
                                      onClick={() => {
                                        setTargetLogClientId(site.id);
                                        setActiveTab("logs");
                                      }}
                                      className="px-3 py-1.5 border border-[var(--border)] rounded-lg hover:border-[var(--text-secondary)] hover:text-white transition-colors"
                                    >
                                      View logs
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="rounded-2xl border border-[var(--border)] p-6 backdrop-blur-md bg-[rgba(10,15,26,0.5)] space-y-6 animate-in fade-in duration-300">
                  <LogTerminal secret={secret} clientsList={clients} initialClientId={targetLogClientId} />
                </div>
              )}

              {activeTab === "clients" && (
                <div className="rounded-2xl border border-[var(--border)] p-6 backdrop-blur-md bg-[rgba(10,15,26,0.5)] space-y-6 animate-in fade-in duration-300">
                  <ClientRegistry secret={secret} clientsList={clients} refreshList={fetchDashboardData} />
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="rounded-2xl border border-[var(--border)] p-6 backdrop-blur-md bg-[rgba(10,15,26,0.5)] space-y-6 animate-in fade-in duration-300">
                  <AlertHub secret={secret} clientsList={clients} refreshList={fetchDashboardData} />
                </div>
              )}

              {activeTab === "agent" && (
                <div className="rounded-2xl border border-[var(--border)] p-6 backdrop-blur-md bg-[rgba(10,15,26,0.5)] space-y-6 animate-in fade-in duration-300">
                  <AIBlogAgent secret={secret} />
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

// Sidebar Button Helper Component
function SidebarButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all"
      style={{
        background: active ? "rgba(255, 77, 77, 0.08)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        borderColor: active ? "rgba(255, 77, 77, 0.2)" : "transparent",
        borderWidth: "1px",
      }}
    >
      <span className={active ? "text-[var(--coral)]" : "text-[var(--text-secondary)]"}>{icon}</span>
      {label}
    </button>
  );
}

// Analytic Metric Card Helper Component
function StatCard({ icon, title, value, desc }: { icon: React.ReactNode; title: string; value: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5 backdrop-blur-md bg-[rgba(10,15,26,0.5)] flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center shadow-inner shrink-0">
        {icon}
      </div>
      <div className="space-y-1 min-w-0">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{title}</h4>
        <div className="text-xl font-extrabold text-white truncate">{value}</div>
        <p className="text-[10px] text-[var(--text-secondary)] truncate">{desc}</p>
      </div>
    </div>
  );
}

const getSSLStatus = (expiryStr?: string) => {
  if (!expiryStr) return { text: "None", color: "text-[var(--text-secondary)] border-[var(--border)]" };
  const daysLeft = Math.round((new Date(expiryStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) return { text: "Expired", color: "text-red-400 border-red-500/20 bg-red-950/20 animate-pulse font-bold" };
  if (daysLeft < 15) return { text: `${daysLeft}d left`, color: "text-amber-400 border-amber-500/20 bg-amber-950/20 font-bold" };
  return { text: `${daysLeft}d left`, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20 font-bold" };
};

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-APP 2: EVENT LOG TERMINAL
   ───────────────────────────────────────────────────────────────────────────── */
function LogTerminal({ secret, clientsList, initialClientId }: { secret: string; clientsList: any[]; initialClientId?: string }) {
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || "");
  const [logs, setLogs] = useState<any[]>([]);
  const [level, setLevel] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [expandedMetaId, setExpandedMetaId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // AI Diagnostics state
  const [diagnosingIds, setDiagnosingIds] = useState<Record<string, boolean>>({});
  const [diagnoses, setDiagnoses] = useState<Record<string, { summary: string; cause: string; fix: string }>>({});

  const triggerDiagnosis = async (logId: string) => {
    setDiagnosingIds(prev => ({ ...prev, [logId]: true }));
    try {
      const res = await fetch("/api/monitor/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`
        },
        body: JSON.stringify({ logId })
      });
      const data = await res.json();
      if (data.success) {
        setDiagnoses(prev => ({ ...prev, [logId]: data.diagnosis }));
      } else {
        alert(data.error || "AI Diagnosis request failed.");
      }
    } catch (err) {
      alert("AI connection timeout");
    } finally {
      setDiagnosingIds(prev => ({ ...prev, [logId]: false }));
    }
  };

  useEffect(() => {
    if (clientsList.length > 0 && !selectedClientId) {
      setSelectedClientId(clientsList[0].id);
    }
  }, [clientsList]);

  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  const loadLogs = async (showSpinner = true) => {
    if (!selectedClientId) return;
    if (showSpinner) setLoading(true);
    try {
      const url = new URL("/api/monitor/logs", window.location.origin);
      url.searchParams.append("clientId", selectedClientId);
      if (level !== "all") url.searchParams.append("level", level);
      if (searchQuery.trim()) url.searchParams.append("search", searchQuery.trim());
      url.searchParams.append("limit", "80");

      const res = await fetch(url.toString(), {
        headers: { "Authorization": `Bearer ${secret}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {}
    finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(true);
  }, [selectedClientId, level, searchQuery]);

  useEffect(() => {
    if (!isLive || !selectedClientId) return;

    const interval = setInterval(() => {
      loadLogs(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedClientId, level, searchQuery, isLive]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">System Log Terminal</h3>
        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Search or stream incoming warnings, debug details, and uncaught browser errors.</p>
      </div>

      {/* Control panel bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Client Target</label>
          <select 
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="border border-[var(--border)] bg-[rgba(5,8,16,0.6)] px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-[var(--coral)] text-white"
          >
            {clientsList.map(c => <option key={c.id} value={c.id} className="bg-[#050810]">{c.name}</option>)}
            {clientsList.length === 0 && <option value="">No clients registered</option>}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Log Severity</label>
          <select 
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-[var(--border)] bg-[rgba(5,8,16,0.6)] px-3 py-1.5 rounded-lg text-xs font-medium focus:outline-none focus:border-[var(--coral)] text-white font-sans"
          >
            <option value="all" className="bg-[#050810]">ALL LEVELS</option>
            <option value="info" className="bg-[#050810]">INFO</option>
            <option value="warn" className="bg-[#050810]">WARNING</option>
            <option value="error" className="bg-[#050810]">ERROR</option>
            <option value="fatal" className="bg-[#050810]">FATAL</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Real-time Stream</label>
          <button 
            type="button"
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${isLive ? "text-green-400 border-green-500/20 bg-green-500/5 hover:bg-green-500/10" : "text-gray-400 border-[var(--border)] bg-transparent hover:bg-white/5"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
            {isLive ? "STREAMING" : "PAUSED"}
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Query Message</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search keyword..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="border border-[var(--border)] bg-[rgba(5,8,16,0.6)] px-3 py-1.5 rounded-lg text-xs flex-1 focus:outline-none focus:border-[var(--coral)] text-white"
            />
            <button type="submit" className="px-4 py-1.5 bg-white/5 border border-[var(--border)] hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-all">
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Terminal log output screen */}
      <div 
        className="rounded-2xl border border-[var(--border)] p-4 font-mono text-xs overflow-y-auto space-y-2 select-text"
        style={{ background: "#020406", minHeight: "350px", maxHeight: "550px" }}
      >
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[var(--text-secondary)]">Retrieving log buffers from Supabase cluster...</div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-[var(--text-secondary)] italic">Buffer is empty. No logs recorded.</div>
        ) : (
          logs.map((log) => {
            const isErr = log.level === "error" || log.level === "fatal";
            const isWarn = log.level === "warn";
            const levelColor = isErr ? "text-red-400" : isWarn ? "text-amber-400" : "text-green-400";
            
            let parsedMeta: any = null;
            if (log.metadata) {
              try {
                parsedMeta = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata;
              } catch (e) {}
            }
            const hasMeta = parsedMeta && Object.keys(parsedMeta).length > 0;

            return (
              <div key={log.id} className="border-b border-white/2 pb-2">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="text-[10px] text-gray-500 font-mono">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={`text-[10px] font-bold ${levelColor} uppercase tracking-wider`}>
                    [{log.level}]
                  </span>
                  <span className="text-gray-300 break-all select-text flex-1">
                    {log.message}
                  </span>
                  {log.stack && (
                    <button 
                      onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                      className="px-2 py-0.5 border border-[var(--border)] rounded hover:bg-white/5 text-[9px] tracking-wider uppercase font-bold"
                    >
                      {expandedLogId === log.id ? "Hide Trace" : "Trace"}
                    </button>
                  )}
                  {hasMeta && (
                    <button 
                      onClick={() => setExpandedMetaId(expandedMetaId === log.id ? null : log.id)}
                      className="px-2 py-0.5 border border-[var(--border)] rounded hover:bg-white/5 text-[9px] tracking-wider uppercase font-bold text-cyan-400"
                    >
                      {expandedMetaId === log.id ? "Hide Details" : "Details"}
                    </button>
                  )}
                  {isErr && (
                    <button 
                      onClick={() => triggerDiagnosis(log.id)}
                      disabled={diagnosingIds[log.id]}
                      className="px-2 py-0.5 border border-cyan-500/30 hover:bg-cyan-500/10 rounded text-[9px] tracking-wider uppercase font-bold text-cyan-400 disabled:opacity-50 transition-all"
                    >
                      {diagnosingIds[log.id] ? "Analyzing..." : "🤖 PROmonitor AI"}
                    </button>
                  )}
                </div>

                {/* Expanded Stack trace details */}
                {expandedLogId === log.id && log.stack && (
                  <pre className="mt-2 p-3 bg-red-950/15 border border-red-500/10 rounded-lg text-[10px] text-red-300 overflow-x-auto whitespace-pre select-text font-mono">
                    {log.stack}
                  </pre>
                )}

                {/* Expanded metadata details */}
                {expandedMetaId === log.id && parsedMeta && (
                  <div className="mt-2 p-4 border border-[var(--border)] bg-black/45 rounded-xl space-y-3 text-xs leading-relaxed animate-in slide-in-from-top-1 duration-200 select-text">
                    <div className="text-[10px] uppercase font-black tracking-wider text-[var(--text-secondary)]">
                      📋 Telemetry Metadata Context
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Section 1: Session & Path */}
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Page Information</h4>
                        <div className="text-gray-300 font-mono text-[10px] space-y-0.5">
                          <div className="truncate"><span className="text-gray-500">URL:</span> <a href={parsedMeta.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-500">{parsedMeta.url || "Unknown"}</a></div>
                          <div><span className="text-gray-500">Path:</span> {parsedMeta.pathname || "Unknown"}</div>
                          <div className="truncate"><span className="text-gray-500">Referrer:</span> {parsedMeta.referrer || "Direct"}</div>
                        </div>
                      </div>

                      {/* Section 2: Browser & System */}
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Browser & OS</h4>
                        <div className="text-gray-300 font-mono text-[10px] space-y-0.5">
                          <div><span className="text-gray-500">System:</span> {parsedMeta.os || "Unknown"} ({parsedMeta.browser || "Unknown"})</div>
                          <div><span className="text-gray-500">Language:</span> {parsedMeta.language || "Unknown"}</div>
                          <div><span className="text-gray-500">Display:</span> {parsedMeta.screenSize || "Unknown"} ({parsedMeta.viewportSize || "Unknown"} viewport)</div>
                        </div>
                      </div>

                      {/* Section 3: Geolocation */}
                      {parsedMeta.location && (
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">User Location</h4>
                          <div className="text-gray-300 font-mono text-[10px] space-y-0.5">
                            <div><span className="text-gray-500">IP address:</span> {parsedMeta.location.ip || "Unknown"}</div>
                            <div><span className="text-gray-500">Geo Info:</span> {parsedMeta.location.city || "Unknown"}, {parsedMeta.location.region || "Unknown"}, {parsedMeta.location.country || "Unknown"}</div>
                            <div className="truncate"><span className="text-gray-500">ISP/ASN:</span> {parsedMeta.location.org || "Unknown"}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 4: Type-Specific Details */}
                    {parsedMeta.type === 'interaction' && (
                      <div className="border-t border-white/5 pt-2 mt-2">
                        <h4 className="text-[10px] font-bold uppercase text-amber-400 tracking-wider mb-1">Click Interaction telemetry</h4>
                        <div className="text-gray-300 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 gap-2 bg-white/5 p-2.5 rounded-lg">
                          <div><span className="text-gray-500">Element:</span> &lt;{parsedMeta.element}{parsedMeta.elementId ? ` id="${parsedMeta.elementId}"` : ''}{parsedMeta.elementName ? ` name="${parsedMeta.elementName}"` : ''}&gt;</div>
                          {parsedMeta.elementHref && <div className="truncate"><span className="text-gray-500">Href Url:</span> <span className="text-amber-500">{parsedMeta.elementHref}</span></div>}
                          <div className="col-span-1 md:col-span-2"><span className="text-gray-500">Text Content:</span> <span className="text-white font-sans">"{parsedMeta.textContent || ""}"</span></div>
                        </div>
                      </div>
                    )}

                    {parsedMeta.type === 'dwell_time' && (
                      <div className="border-t border-white/5 pt-2 mt-2">
                        <h4 className="text-[10px] font-bold uppercase text-green-400 tracking-wider mb-1">Dwell Time Tracking</h4>
                        <div className="text-gray-300 font-mono text-[10px] bg-white/5 p-2.5 rounded-lg">
                          User stayed on route <code className="text-green-300 font-bold">{parsedMeta.path}</code> for <strong className="text-white text-xs px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">{parsedMeta.durationSeconds} seconds</strong> before navigating or leaving.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Diagnostics details card */}
                {diagnoses[log.id] && (
                  <div className="mt-3 p-4 border border-cyan-500/20 bg-cyan-950/10 rounded-xl space-y-2 text-xs leading-relaxed animate-in slide-in-from-top-2 duration-200">
                    <div className="text-[10px] uppercase font-black tracking-wider text-cyan-400">
                      🤖 PROmonitor SRE AI Report
                    </div>
                    <div>
                      <strong className="text-cyan-300 font-bold block mb-0.5">Summary:</strong>
                      <span className="text-gray-300">{diagnoses[log.id].summary}</span>
                    </div>
                    <div>
                      <strong className="text-cyan-300 font-bold block mb-0.5">Root Cause:</strong>
                      <span className="text-gray-300">{diagnoses[log.id].cause}</span>
                    </div>
                    <div>
                      <strong className="text-cyan-300 font-bold block mb-1">Recommended Fix:</strong>
                      <pre className="p-3 bg-[#020406] border border-cyan-500/10 rounded-lg text-[10px] text-cyan-200 overflow-x-auto whitespace-pre font-mono leading-normal select-text">
                        {diagnoses[log.id].fix}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-APP 3: CLIENT REGISTRY
   ───────────────────────────────────────────────────────────────────────────── */
function ClientRegistry({ secret, clientsList, refreshList }: { secret: string; clientsList: any[]; refreshList: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createdClient, setCreatedClient] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    try {
      const res = await fetch("/api/monitor/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`
        },
        body: JSON.stringify({ name: name.trim(), url: url.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setCreatedClient(data.client);
        setName("");
        setUrl("");
        setIsAddModalOpen(false);
        refreshList();
      } else {
        alert(data.error || "Failed to add site.");
      }
    } catch (err) {
      alert("Submission error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website? This permanently deletes the client and all associated log records.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/monitor/clients", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        refreshList();
      }
    } catch (err) {}
    finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 select-text">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">Client Site Registry</h3>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Register client web applications, configure custom URLs, and obtain Javascript SDK tracking scripts.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[var(--coral)] hover:bg-[var(--coral-light)] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          + Add New Node
        </button>
      </div>

      {/* Details / Credentials Popup */}
      {createdClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 border border-cyan-500/20 bg-[#0a0f1a] rounded-2xl space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setCreatedClient(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white text-xs font-bold transition-colors">✕ Close</button>
            <div className="flex flex-col gap-1 pr-10">
              <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Settings className="w-5 h-5" /> SDK Configuration Details
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Copy the API key or embed script snippet below to configure error monitoring on this client website.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">API Key</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={createdClient.apiKey} className="font-mono text-[11px] border border-cyan-500/20 bg-[#020406] text-white px-3 py-2.5 rounded-xl flex-1 focus:outline-none selection:bg-cyan-500/30" />
                <button 
                  onClick={() => copyToClipboard(createdClient.apiKey)}
                  className="px-4 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Embedded SDK Tag</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`<script src="${window.location.origin}/monitor-sdk.js" data-key="${createdClient.apiKey}"></script>`} 
                  className="font-mono text-[10px] border border-cyan-500/20 bg-[#020406] text-white px-3 py-2.5 rounded-xl flex-1 focus:outline-none selection:bg-cyan-500/30" 
                />
                <button 
                  onClick={() => copyToClipboard(`<script src="${window.location.origin}/monitor-sdk.js" data-key="${createdClient.apiKey}"></script>`)}
                  className="px-4 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Node Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-7 border border-[var(--border)] bg-[rgba(10,15,26,0.95)] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white text-xs font-bold transition-colors">✕ Close</button>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <h4 className="text-base font-black tracking-tight text-white">Register Web Node</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Add a new client application to start tracking.</p>
              </div>
              <div className="space-y-4 flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g., NextGen Fashion..." 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    className="border border-[var(--border)] bg-[#050810] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[var(--coral)] text-white transition-colors" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Website URL</label>
                  <input 
                    type="url" 
                    placeholder="https://client-site.com" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    required
                    className="border border-[var(--border)] bg-[#050810] px-4 py-3.5 rounded-xl text-xs focus:outline-none focus:border-[var(--coral)] text-white transition-colors" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 mt-2 bg-[var(--coral)] hover:bg-[var(--coral-light)] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Add Client Node
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Nodes List */}
      <div>
        {clientsList.length === 0 ? (
          <div className="py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">No clients configured. Click Add New Node to begin.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {clientsList.map((client) => (
              <div key={client.id} className="flex flex-col p-6 border border-[var(--border)] rounded-3xl bg-white/5 hover:bg-white/10 transition-all group shadow-sm">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-white truncate pr-2">{client.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0 mt-0.5" />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-mono truncate">{client.url}</div>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <button 
                    onClick={() => setCreatedClient(client)}
                    className="flex-1 py-2.5 border border-cyan-500/30 bg-cyan-950/20 rounded-xl hover:bg-cyan-500/20 transition-all text-[10px] font-bold text-cyan-400 uppercase tracking-wider"
                  >
                    SDK Config
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)}
                    disabled={deletingId === client.id}
                    className="px-5 py-2.5 border border-red-500/20 bg-red-950/20 rounded-xl hover:bg-red-500/20 text-[10px] font-bold text-red-400 disabled:opacity-50 transition-all uppercase tracking-wider"
                  >
                    {deletingId === client.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-APP 4: WEBHOOK ALERTS
   ───────────────────────────────────────────────────────────────────────────── */
function AlertHub({ secret, clientsList, refreshList }: { secret: string; clientsList: any[]; refreshList: () => void }) {
  const [selectedId, setSelectedId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (clientsList.length > 0 && !selectedId) {
      setSelectedId(clientsList[0].id);
      setWebhookUrl(clientsList[0].webhookUrl || "");
    }
  }, [clientsList]);

  const handleClientChange = (id: string) => {
    setSelectedId(id);
    const client = clientsList.find(c => c.id === id);
    setWebhookUrl(client ? client.webhookUrl || "" : "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);

    try {
      const res = await fetch("/api/monitor/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`
        },
        body: JSON.stringify({ id: selectedId, webhookUrl: webhookUrl.trim() })
      });
      const data = await res.json();
      if (data.success) {
        alert("Webhook settings saved successfully.");
        refreshList();
      } else {
        alert(data.error || "Save failed.");
      }
    } catch (err) {
      alert("Submission error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 select-text text-xs">
      <div>
        <h3 className="text-lg font-bold">Webhook Channel Settings</h3>
        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Route critical client status changes and fatal exceptions directly to Discord or Slack.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-5 border border-[var(--border)] bg-white/2 rounded-2xl space-y-3 h-fit">
          <h4 className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Webhook Rules
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            - **Uptime Scanning:** Triggered when status flips from ONLINE to OFFLINE, or recovers.
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            - **Error Logging:** Real-time push triggers for all exceptions logged with severity **Error** or **Fatal** level.
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            - **Format detection:** Discord and Slack payload structures are automatically detected from the webhook URL.
          </p>
        </div>

        <div className="lg:col-span-2">
          {clientsList.length === 0 ? (
            <div className="py-10 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
              Register clients before configuring alerts.
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 border border-[var(--border)] p-5 rounded-2xl bg-white/2">
              <h4 className="font-bold uppercase tracking-wider">Configure Alerts</h4>
              
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Select Client Site</label>
                <select 
                  value={selectedId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[rgba(5,8,16,0.6)] px-3 py-2 rounded-xl focus:outline-none focus:border-[var(--coral)] text-white font-medium"
                >
                  {clientsList.map(c => <option key={c.id} value={c.id} className="bg-[#050810]">{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Discord or Slack Webhook URL</label>
                <input 
                  type="url"
                  placeholder="https://discord.com/api/webhooks/... or https://hooks.slack.com/services/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full border border-[var(--border)] bg-[rgba(5,8,16,0.6)] px-4 py-2.5 rounded-xl focus:outline-none focus:border-[var(--coral)] text-white font-mono"
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="px-4 py-2.5 bg-[var(--coral)] hover:bg-[var(--coral-light)] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                {saving ? "Saving settings..." : "Save Webhook settings"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-APP 5: AI CONTENT AGENT (INTEGRATED BLOG GENERATOR)
   ───────────────────────────────────────────────────────────────────────────── */
type AgentMode = "auto" | "url" | "youtube";

type RunResult = {
  slug?: string;
  title?: string;
  filePath?: string;
  message: string;
  status?: "dispatched";
};

function AIBlogAgent({ secret }: { secret: string }) {
  const [mode, setMode] = useState<AgentMode>("auto");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState("");

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`,
        },
        body: JSON.stringify({ url: mode !== "auto" ? url.trim() : undefined }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setResult(data.result as RunResult);
      setUrl("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const modes: { id: AgentMode; icon: string; label: string; description: string }[] = [
    { id: "auto",    icon: "🌐", label: "Auto Trend", description: "Picks a trending topic from news feeds" },
    { id: "url",     icon: "🔗", label: "Article URL",   description: "Turns article URL into a post" },
    { id: "youtube", icon: "▶️", label: "YouTube Link",  description: "Transcribes YouTube into post" },
  ];

  const urlPlaceholder =
    mode === "youtube"
      ? "https://youtube.com/watch?v=..."
      : "https://example.com/some-article";

  return (
    <div className="space-y-6 select-text text-xs">
      <div>
        <h3 className="text-lg font-bold">AI Content Agent</h3>
        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Strategic blog content generation engine utilizing Gemini LLMs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleRun} className="p-5 border border-[var(--border)] rounded-2xl bg-white/2 space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Execute Run</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-2">Intelligence Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setMode(m.id); setUrl(""); }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all text-[10px] font-bold"
                      style={
                        mode === m.id
                          ? { borderColor: "var(--coral)", background: "rgba(255,77,77,0.08)", color: "var(--text-primary)" }
                          : { borderColor: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", background: "transparent" }
                      }
                    >
                      <span className="text-xl">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode !== "auto" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-2">
                    Target {mode === "youtube" ? "YouTube" : "Article"} URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={urlPlaceholder}
                    required
                    className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 bg-[rgba(5,8,16,0.6)] text-white focus:outline-none focus:border-[var(--coral)] transition-all font-mono"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (mode !== "auto" && !url.trim())}
              className="w-full py-3 bg-[var(--coral)] hover:bg-[var(--coral-light)] disabled:opacity-50 disabled:bg-gray-800 text-white font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              {loading ? "Writing post..." : `Execute Agent Run`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold uppercase tracking-wider border-b border-[var(--border)] pb-2">Results Console</h4>
          
          {error && <div className="p-4 border border-red-500/20 bg-red-950/15 rounded-xl text-xs text-[var(--coral)] font-mono">✕ {error}</div>}

          {result ? (
            <div className="p-5 border border-green-500/20 bg-green-500/5 rounded-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-green-400 font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {result.status === "dispatched" ? "Workflow Dispatched" : "Content Created"}
              </div>
              <h4 className="font-bold text-sm mb-2">{result.title || "Processing..."}</h4>
              {result.slug && (
                <Link href={`/blog/${result.slug}`} target="_blank" className="text-xs font-bold text-[var(--coral)] hover:underline inline-flex items-center gap-1">
                  View Live Post →
                </Link>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
              No active agent runs executed. Submit a task using the run console.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
