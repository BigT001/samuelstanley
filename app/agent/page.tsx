"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Starfield } from "../components/Starfield";

type AgentMode = "auto" | "url" | "youtube";

type RunResult = {
  slug: string;
  title: string;
  filePath: string;
  message: string;
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
          /* Lock Screen UI */
          <div className="rounded-3xl border border-[var(--border)] p-8 text-center" style={{ background: "var(--surface)", backdropFilter: "blur(20px)" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl" style={{ background: "rgba(255,100,100,0.1)" }}>
              🔒
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Access Restricted</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8">Enter the Agent Secret to manage your content.</p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Agent Secret Key..."
                required
                disabled={verifying}
                autoFocus
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3.5 text-center text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--coral)] transition-colors disabled:opacity-50"
                style={{ background: "var(--bg)" }}
              />
              <button
                type="submit"
                disabled={verifying || !secret.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(255,77,77,0.3)" }}
              >
                {verifying ? "Verifying..." : "Unlock Access"}
              </button>
            </form>

            {error && <p className="mt-4 text-xs text-red-400 font-medium">❌ {error}</p>}
          </div>
        ) : (
          /* Main Agent UI */
          <div className="rounded-3xl border border-[var(--border)] p-8" style={{ background: "var(--surface)", backdropFilter: "blur(20px)" }}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,77,77,0.12)" }}>
                  🤖
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">AI Content Agent</h1>
                  <p className="text-sm text-[var(--text-secondary)]">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAuthorized(false); sessionStorage.removeItem('agent_secret'); }}
                className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400/30 transition-all"
                title="Lock Session"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </button>
            </div>

            <form onSubmit={handleRun} className="space-y-6">

              {/* Mode selector */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Content Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setMode(m.id); setUrl(""); }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 text-xs font-medium"
                      style={
                        mode === m.id
                          ? { borderColor: "var(--coral)", background: "rgba(255,77,77,0.08)", color: "var(--text-primary)" }
                          : { borderColor: "var(--border)", color: "var(--text-secondary)", background: "transparent" }
                      }
                    >
                      <span className="text-xl">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {modes.find((m) => m.id === mode)?.description}
                </p>
              </div>

              {/* URL input (hidden for auto mode) */}
              {mode !== "auto" && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    {mode === "youtube" ? "YouTube URL" : "Article URL"}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={urlPlaceholder}
                    required
                    disabled={loading}
                    className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--coral)] transition-colors disabled:opacity-50"
                    style={{ background: "var(--bg)" }}
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (mode !== "auto" && !url.trim())}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(255,77,77,0.3)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                    Thinking &amp; Writing…
                  </span>
                ) : (
                  `Run Agent — ${modes.find((m) => m.id === mode)?.label}`
                )}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-5 p-4 rounded-xl border border-red-500/20 text-sm text-red-100 bg-red-900/20">
                ❌ {error}
              </div>
            )}

            {/* Success */}
            {result && (
              <div className="mt-5 p-5 rounded-xl border border-green-500/20 bg-green-500/8">
                <div className="flex items-center gap-2 font-semibold text-green-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Post Published!
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">{result.title}</p>
                <Link
                  href={`/blog/${result.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--coral)] hover:text-[var(--coral-light)] transition-colors"
                >
                  View article →
                </Link>
              </div>
            )}
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
