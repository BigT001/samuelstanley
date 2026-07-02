"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Search, 
  Bell, 
  MessageSquare,
  Sparkles, 
  Globe, 
  ExternalLink,
  Check, 
  Copy, 
  Grid, 
  BookOpen, 
  User, 
  Plus, 
  LogOut,
  MapPin,
  Menu,
  X,
  Terminal,
  Activity,
  HeartHandshake
} from "lucide-react";
import { projects, techStack, philosophies, testimonials } from "./components/data";
import { ProfilePhoto, ContactModal } from "./components/ui";

// Confetti helper
const triggerConfetti = () => {
  if (typeof window !== "undefined") {
    import("canvas-confetti").then((module) => {
      const confettiFn = module.default || module;
      confettiFn({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#ff4d4d", "#00e5cc", "#ffbc2e", "#0070f3"]
      });
    });
  }
};

type TabId = "feed" | "explore" | "philosophy";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Likes and bookmarks states
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const [bookmarkedStates, setBookmarkedStates] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Modals state
  const [showHireModal, setShowHireModal] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize randomized likes counts
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    projects.forEach(p => {
      initialLikes[p.slug] = Math.floor(Math.random() * 280) + 140;
    });
    setLikes(initialLikes);
  }, []);

  // Story slideshow timer
  useEffect(() => {
    if (activeStoryIdx === null) return;
    setStoryProgress(0);

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close
          if (activeStoryIdx < testimonials.length - 1) {
            setActiveStoryIdx(activeStoryIdx + 1);
            return 0;
          } else {
            setActiveStoryIdx(null);
            return 0;
          }
        }
        return prev + 2; // Increments to 100 in ~2.5s
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStoryIdx]);

  const handleLike = (slug: string) => {
    if (likedStates[slug]) {
      setLikes(prev => ({ ...prev, [slug]: prev[slug] - 1 }));
      setLikedStates(prev => ({ ...prev, [slug]: false }));
    } else {
      setLikes(prev => ({ ...prev, [slug]: prev[slug] + 1 }));
      setLikedStates(prev => ({ ...prev, [slug]: true }));
      triggerConfetti();
    }
  };

  const handleBookmark = (slug: string, url: string) => {
    if (bookmarkedStates[slug]) {
      setBookmarkedStates(prev => ({ ...prev, [slug]: false }));
    } else {
      setBookmarkedStates(prev => ({ ...prev, [slug]: true }));
      navigator.clipboard.writeText(url).then(() => {
        setCopiedStates(prev => ({ ...prev, [slug]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [slug]: false }));
        }, 1500);
      });
    }
  };

  // Filter posts/projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.tag.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = !selectedCategory || 
                            p.tech.some(t => t.toLowerCase() === selectedCategory.toLowerCase()) ||
                            p.tag.toLowerCase().includes(selectedCategory.toLowerCase());
                            
    return matchesSearch && matchesCategory;
  });

  const categories = ["Next.js", "Gemini AI", "Node.js", "React", "PostgreSQL", "TailwindCSS"];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE NAVBAR */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
        <span className="text-xl font-bold font-mono tracking-tight bg-gradient-to-r from-[var(--coral)] to-cyan-400 bg-clip-text text-transparent">
          Stanleygram
        </span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHireModal(true)}
            className="p-1.5 rounded-full bg-[var(--coral)] text-white hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-primary)]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* LEFT SIDEBAR PANEL */}
      <aside className={`fixed md:sticky top-0 left-0 h-full w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] backdrop-blur-md p-6 z-[60] flex flex-col justify-between overflow-y-auto transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black font-mono tracking-tight bg-gradient-to-r from-[var(--coral)] to-cyan-400 bg-clip-text text-transparent">
              Stanleygram
            </span>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card Summary */}
          <div className="space-y-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-4">
              <div className="w-[64px] h-[64px] rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 shadow-lg relative">
                <div className="w-full h-full rounded-full border-2 border-[var(--bg)] overflow-hidden">
                  <ProfilePhoto />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--bg)] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Samuel Stanley</h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono">@samuelstanley</p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="flex justify-between text-center py-2 bg-black/5 dark:bg-white/2 rounded-xl">
              <div>
                <div className="font-black text-xs">8</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Projects</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <div>
                <div className="font-black text-xs">350+</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Commits</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <div>
                <div className="font-black text-xs">14d</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">MVP Delivery</div>
              </div>
            </div>

            {/* Bio Details */}
            <div className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--text-primary)]">Founder's Dev</span>. Full-Stack Engineer specializing in Next.js, Node.js, and autonomous AI agents. I build MVPs fast.
            </div>
          </div>

          {/* Sidebar Nav Actions */}
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab("feed"); setSelectedCategory(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "feed" && !selectedCategory ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <Grid className="w-4 h-4" />
              <span>Explore Feed</span>
            </button>
            <button 
              onClick={() => { setActiveTab("explore"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "explore" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <Activity className="w-4 h-4" />
              <span>Tech Stack</span>
            </button>
            <button 
              onClick={() => { setActiveTab("philosophy"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "philosophy" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Philosophy</span>
            </button>
            <Link 
              href="/os"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>OS Workstation</span>
            </Link>
          </nav>

          {/* Story Highlights categories filters */}
          <div>
            <h4 className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mb-3 px-3">Story Highlights</h4>
            <div className="space-y-1.5">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(isSelected ? null : cat); setActiveTab("feed"); setSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium transition-all border ${isSelected ? "border-[var(--coral)] bg-[var(--coral)]/5 text-[var(--coral)]" : "border-transparent text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"}`}
                  >
                    <span>#{cat.toLowerCase()}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[var(--border)] text-[9px] text-[var(--text-secondary)] space-y-1">
          <div>© 2026 Samuel Stanley. All rights reserved.</div>
          <div>Built with Next.js, Antigravity, and AI.</div>
        </div>
      </aside>

      {/* MOBILE MENU BACKDROP */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT FEED WINDOW */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="sticky top-0 z-40 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] px-6 py-4 flex items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search projects, stack, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/2 border border-[var(--border)] pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:border-[var(--coral)] text-[var(--text-primary)] transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all active:scale-95 group">
              <Bell className="w-4.5 h-4.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--coral)] animate-pulse" />
            </button>

            {/* Direct message icon */}
            <button 
              onClick={() => setShowHireModal(true)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all active:scale-95 group"
            >
              <MessageSquare className="w-4.5 h-4.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
            </button>

            {/* Plus / Create Post CTA */}
            <button 
              onClick={() => setShowHireModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white rounded-full text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Hire Samuel</span>
            </button>
          </div>
        </div>

        {/* FEED INNER SCROLL */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">
          
          {/* CLIENT REVIEWS / TESTIMONIALS STORIES (Instagram-style Stories) */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-extrabold mb-1">Stories / Client Testimonials</h4>
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
              {testimonials.map((t, idx) => (
                <div 
                  key={t.handle}
                  onClick={() => setActiveStoryIdx(idx)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer snap-start"
                >
                  <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 transition-all hover:scale-105 active:scale-95">
                    <div className="w-full h-full rounded-full border-2 border-[var(--bg)] bg-black/10 dark:bg-white/10 flex items-center justify-center font-black text-sm text-[var(--text-primary)]">
                      {t.avatar}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">{t.handle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE FEED RENDER BLOCK */}
          {activeTab === "feed" && (
            <div className="space-y-6">
              
              {/* Category tag status card */}
              {(selectedCategory || searchQuery) && (
                <div className="p-4 border border-[var(--border)] bg-black/5 dark:bg-white/2 rounded-2xl flex items-center justify-between text-xs">
                  <span>
                    Showing {filteredProjects.length} posts matching 
                    {selectedCategory && <span className="font-bold text-[var(--coral)]"> #{selectedCategory.toLowerCase()}</span>}
                    {searchQuery && <span className="italic font-bold"> "{searchQuery}"</span>}
                  </span>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                    className="text-[10px] font-bold text-[var(--coral)] hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Feed Post List */}
              {filteredProjects.length === 0 ? (
                <div className="py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
                  No projects or posts match your query. Try searching for other technologies like #nextjs, #prisma.
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isLiked = likedStates[p.slug];
                  const isBookmarked = bookmarkedStates[p.slug];
                  const isCopied = copiedStates[p.slug];

                  return (
                    <article 
                      key={p.slug}
                      className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-sm animate-in fade-in duration-200"
                    >
                      {/* Post Header */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          <div className="w-[32px] h-[32px] rounded-full border border-[var(--border)] overflow-hidden">
                            <ProfilePhoto />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs flex items-center gap-1.5">
                              <span>Samuel Stanley</span>
                              <span className="text-[10px] text-green-500 font-bold bg-green-950/20 border border-green-500/20 px-1.5 py-0.5 rounded-full font-mono">Live</span>
                            </div>
                            <div className="text-[9px] text-[var(--text-secondary)] flex items-center gap-1 font-mono">
                              <MapPin className="w-2.5 h-2.5 text-[var(--coral)]" />
                              <span>{p.link !== "#" ? p.link.replace("https://", "").replace("/", "") : "Remote"}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] font-bold">{p.tag}</span>
                      </div>

                      {/* Post Image / Media Content */}
                      <div className="border-b border-[var(--border)] bg-black/10 dark:bg-white/2 p-6 md:p-8 flex flex-col justify-between min-h-[220px] relative select-none">
                        {/* Elegant overlay gradient block */}
                        <div 
                          className="absolute inset-0 z-0 opacity-10" 
                          style={{ background: `radial-gradient(circle at 70% 30%, ${p.color || "var(--coral)"} 0%, transparent 70%)` }}
                        />
                        
                        <div className="relative z-10 space-y-4">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: p.color || "var(--coral)" }}>
                            {p.status}
                          </span>
                          <h3 className="text-xl md:text-2xl font-black tracking-tight mt-1 text-[var(--text-primary)]">
                            {p.title}
                          </h3>
                          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                            {p.desc}
                          </p>
                        </div>

                        <div className="relative z-10 pt-4 flex flex-wrap gap-1.5">
                          {p.tech.map(t => (
                            <span 
                              key={t}
                              onClick={() => setSelectedCategory(t)}
                              className="text-[9px] font-mono font-bold bg-black/10 dark:bg-white/5 border border-[var(--border)] px-2 py-1 rounded-md text-[var(--text-secondary)] hover:border-[var(--coral)] hover:text-[var(--coral)] transition-colors cursor-pointer"
                            >
                              #{t.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Engagement Actions Bar */}
                      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Heart/Like Button */}
                          <button 
                            onClick={() => handleLike(p.slug)}
                            className={`p-1 hover:scale-110 active:scale-90 transition-all ${isLiked ? "text-red-500 fill-red-500 animate-pulse" : "text-[var(--text-primary)]"}`}
                          >
                            <Heart className="w-5 h-5" />
                          </button>

                          {/* Comment/Hire Button */}
                          <button 
                            onClick={() => setShowHireModal(true)}
                            className="p-1 hover:scale-110 active:scale-90 transition-all text-[var(--text-primary)]"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>

                          {/* Direct Link Button */}
                          {p.link !== "#" && (
                            <a 
                              href={p.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-1 hover:scale-110 active:scale-90 transition-all text-[var(--text-primary)]"
                            >
                              <Send className="w-5 h-5" />
                            </a>
                          )}
                        </div>

                        {/* Bookmark Button */}
                        <button 
                          onClick={() => handleBookmark(p.slug, p.link !== "#" ? p.link : "https://samuelstanley.com")}
                          className={`p-1 hover:scale-110 active:scale-90 transition-all relative ${isBookmarked ? "text-cyan-400 fill-cyan-400" : "text-[var(--text-primary)]"}`}
                        >
                          <Bookmark className="w-5 h-5" />
                          {isCopied && (
                            <span className="absolute -top-8 right-0 bg-cyan-900 border border-cyan-700/50 text-cyan-200 text-[8px] font-bold px-2 py-0.5 rounded shadow-lg animate-fade-in whitespace-nowrap">
                              Copied Link!
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Post engagement text info */}
                      <div className="px-4 py-3 text-xs space-y-1.5 bg-black/5 dark:bg-white/1">
                        <div className="font-extrabold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>{likes[p.slug] || 0} Likes</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          <span className="font-bold text-[var(--text-primary)]">samuelstanley</span> {p.desc.substring(0, 80)}...
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {/* ACTIVE EXPLORE TECH STACK PANEL */}
          {activeTab === "explore" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--surface)] space-y-4">
                <h3 className="font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span>Interactive Tech Stack</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  I specialize in full-stack web architectures, API ecosystems, and database designs. These are my go-to technologies. Click a technology to filter matching projects.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {techStack.map(ts => (
                    <div 
                      key={ts.name}
                      onClick={() => { setSelectedCategory(ts.name); setActiveTab("feed"); }}
                      className="border border-[var(--border)] p-3 rounded-xl bg-black/10 dark:bg-white/2 hover:border-[var(--coral)] cursor-pointer select-none transition-all flex items-center gap-2.5 active:scale-95"
                    >
                      <span className="text-lg">{ts.emoji}</span>
                      <span className="font-bold text-xs">{ts.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE PHILOSOPHY RENDER PANEL */}
          {activeTab === "philosophy" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {philosophies.map(p => (
                  <div 
                    key={p.title} 
                    className="border border-[var(--border)] p-5 rounded-2xl bg-[var(--surface)] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    <h4 className="font-black text-sm text-[var(--text-primary)]">{p.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* INSTAGRAM-STYLE STORIES SLIDESHOW MODAL */}
      {activeStoryIdx !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg h-full max-h-[85vh] p-4 flex flex-col justify-between">
            
            {/* Header: Testimonial details & Progress Bar */}
            <div className="space-y-4">
              
              {/* Slideshow Progress indicator */}
              <div className="flex gap-1.5">
                {testimonials.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-75"
                      style={{ 
                        width: idx === activeStoryIdx 
                          ? `${storyProgress}%` 
                          : idx < activeStoryIdx 
                            ? "100%" 
                            : "0%" 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Author info */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-sm">
                    {testimonials[activeStoryIdx].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Samuel Stanley (Client Review)</h4>
                    <p className="text-[10px] text-white/60 font-mono">{testimonials[activeStoryIdx].handle}</p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveStoryIdx(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Testimonial Quote display */}
            <div className="text-center px-6">
              <span className="text-3xl text-[var(--coral)] font-mono">“</span>
              <p className="text-white text-lg md:text-xl font-bold leading-relaxed italic">
                {testimonials[activeStoryIdx].text.replace(/"/g, "")}
              </p>
              <span className="text-3xl text-[var(--coral)] font-mono">”</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center text-white px-2">
              <button 
                disabled={activeStoryIdx === 0}
                onClick={() => setActiveStoryIdx(activeStoryIdx - 1)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all disabled:opacity-30"
              >
                ◀ Previous
              </button>
              <span className="text-[10px] text-white/50">{activeStoryIdx + 1} / {testimonials.length}</span>
              <button 
                onClick={() => {
                  if (activeStoryIdx < testimonials.length - 1) {
                    setActiveStoryIdx(activeStoryIdx + 1);
                  } else {
                    setActiveStoryIdx(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
              >
                {activeStoryIdx === testimonials.length - 1 ? "Close ✕" : "Next ▶"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONTACT/BOOKING SCHEDULER MODAL */}
      <ContactModal isOpen={showHireModal} onClose={() => setShowHireModal(false)} />

    </div>
  );
}
