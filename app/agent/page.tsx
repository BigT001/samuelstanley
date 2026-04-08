"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Starfield } from "../components/Starfield";

type AgentMode = "auto" | "url" | "youtube";

type RunResult = {
  slug?: string;
  title?: string;
  filePath?: string;
  message: string;
  status?: 'dispatched';
};

export default function AgentPage() {
  const [mode, setMode]             = useState<AgentMode>("auto");
  const [url, setUrl]               = useState("");
  const [secret, setSecret]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [verifying, setVerifying]   = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [result, setResult]         = useState<RunResult | null>(null);
  const [error, setError]           = useState("");

  // Check session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('agent_secret');
    if (saved) {
      setSecret(saved);
      setIsAuthorized(true);
    }
  }, []);

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
        sessionStorage.setItem('agent_secret', secret.trim());
      } else {
        throw new Error(data.error || "Invalid Secret");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setVerifying(false);
    }
  };

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
          "Authorization": `Bearer ${secret.trim()}`,
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
    { id: "auto",    icon: "🌐", label: "Auto Trending", description: "Picks a trending topic from global & Nigerian news feeds" },
    { id: "url",     icon: "🔗", label: "Article URL",   description: "Turns any article or blog post URL into a post" },
    { id: "youtube", icon: "▶️", label: "YouTube Link",  description: "Transcribes a YouTube video and writes a blog post" },
  ];

  const urlPlaceholder =
    mode === "youtube"
      ? "https://youtube.com/watch?v=..."
      : "https://example.com/some-article";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <Starfield />

      <div className="relative z-10 w-full max-w-xl">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--coral)] transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Portfolio
        </Link>

        {!isAuthorized ? (
          /* UNIFIED CITADEL LOCK SCREEN */
          <div className="rounded-3xl border border-[var(--border)] p-10 text-center shadow-2xl" style={{ background: "var(--surface)", backdropFilter: "blur(40px)" }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl shadow-inner" style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
              🔒
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tighter">Stanley’s Citadel</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-10 max-w-xs mx-auto leading-relaxed">System is encrypted. Provide the administrative secret to initialize the dashboard.</p>

            <form onSubmit={handleVerify} className="space-y-4 max-w-sm mx-auto">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Administrative Secret Key..."
                required
                disabled={verifying}
                autoFocus
                className="w-full border border-[var(--border)] rounded-2xl px-5 py-4 text-center text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--coral)] transition-all disabled:opacity-50 shadow-inner"
                style={{ background: "var(--bg)" }}
              />
              <button
                type="submit"
                disabled={verifying || !secret.trim()}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-95"
                style={{ background: "var(--coral)", boxShadow: "0 8px 32px rgba(255,77,77,0.4)" }}
              >
                {verifying ? "Initializing..." : "Unlock Dashboard"}
              </button>
            </form>

            {error && <p className="mt-6 text-xs text-[var(--coral)] font-bold animate-pulse">✕ {error}</p>}
          </div>
        ) : (
          /* UNIFIED MISSION CONTROL */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            
            {/* GLOBAL TOOLBAR */}
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--text-secondary)]">Secure Session Active</span>
               </div>
               <button 
                  onClick={() => {
                    if (confirm("Terminate administrative session?")) {
                      setIsAuthorized(false); 
                      setSecret("");
                      sessionStorage.removeItem('agent_secret');
                      window.location.reload(); 
                    }
                  }}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--coral)] hover:border-[var(--coral)] transition-all bg-[var(--surface)]"
                >
                  Terminate Session <span className="text-sm">🔓</span>
                </button>
            </div>

            {/* AI AGENT CARD */}
            <div className="rounded-3xl border border-[var(--border)] p-8 shadow-xl" style={{ background: "var(--surface)", backdropFilter: "blur(20px)" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,77,77,0.12)" }}>
                  🤖
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">AI Content Agent</h1>
                  <p className="text-sm text-[var(--text-secondary)]">Strategic Content Generation Engine</p>
                </div>
              </div>

              <form onSubmit={handleRun} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 opacity-80">Intelligence Source</label>
                  <div className="grid grid-cols-3 gap-3">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setMode(m.id); setUrl(""); }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-300 text-xs font-bold"
                        style={
                          mode === m.id
                            ? { borderColor: "var(--coral)", background: "rgba(255,77,77,0.1)", color: "var(--text-primary)", boxShadow: "0 0 15px rgba(255,77,77,0.1)" }
                            : { borderColor: "var(--border)", color: "var(--text-secondary)", background: "transparent" }
                        }
                      >
                        <span className="text-2xl">{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {mode !== "auto" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 opacity-80">
                      Target {mode === "youtube" ? "YouTube" : "Article"} URL
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={urlPlaceholder}
                      required
                      className="w-full border border-[var(--border)] rounded-2xl px-5 py-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--coral)] transition-all shadow-inner"
                      style={{ background: "var(--bg)" }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode !== "auto" && !url.trim())}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all duration-300 disabled:opacity-50 hover:-translate-y-1"
                  style={{ background: "var(--coral)", boxShadow: "0 10px 40px rgba(255,77,77,0.3)" }}
                >
                  {loading ? "System Writing..." : `Execute Agent Run`}
                </button>
              </form>

              {error && <div className="mt-6 p-4 rounded-2xl border border-red-500/20 text-xs font-bold text-[var(--coral)] bg-red-900/10">✕ {error}</div>}

              {result && (
                <div className="mt-6 p-6 rounded-2xl border border-green-500/20 bg-green-500/5 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-green-400 mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {result.status === 'dispatched' ? 'Engine Dispatched' : 'Content Secured'}
                  </div>
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)] mb-2">{result.title || "Processing..."}</h3>
                  {result.slug && (
                    <Link href={`/blog/${result.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-[var(--coral)] hover:underline">
                      View Live Post →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* CONTENT MANAGER CARD */}
            <ContentManager secret={secret} key={result?.slug} />

          </div>
        )}

        {/* Footer info */}
        <p className="text-center text-[10px] text-[var(--text-secondary)] mt-8 opacity-40">
          Manual mode requires AGENT_SECRET. Automatic runs occur 4× daily.
        </p>
      </div>
    </div>
  );
}

function ContentManager({ secret }: { secret: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/agent/list`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.error || "Failed to load archive");
      }
    } catch (err) {
      setError("Network error: Could not connect to list API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;
    setDeleting(slug);
    try {
      const res = await fetch('/api/agent/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter(p => p.slug !== slug));
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-[var(--border)] p-8 overflow-hidden" style={{ background: "var(--surface)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-lg">🗂️</span> Manage Content
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full ${posts.length > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">
                {loading ? 'Analyzing...' : `Status: Live — ${posts.length} Posts`}
              </span>
          </div>
        </div>
        <button onClick={fetchPosts} className="text-xs px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all">
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center animate-pulse text-[var(--text-secondary)]">Loading archive...</div>
      ) : posts.length === 0 ? (
        <div className="py-10 text-center text-sm text-[var(--text-secondary)] italic">Your archive is empty.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] font-medium">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.slug} className="group">
                  <td className="py-4 pr-4">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="font-medium text-[var(--text-primary)] hover:text-[var(--coral)] transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                      {new Date(post.date).toLocaleDateString()} · {post.slug}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--border)]">{post.category}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(post.slug)}
                      disabled={deleting === post.slug}
                      className="text-xs text-red-400 hover:text-red-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      {deleting === post.slug ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
