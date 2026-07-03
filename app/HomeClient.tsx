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
import { ContactForm } from "./components/ContactSection";
import { ThemeToggle } from "./components/ThemeToggle";

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

type TabId = "projects" | "feeds" | "philosophy" | "connect";

type Comment = {
  id: string;
  name: string;
  handle: string;
  text: string;
  timestamp: string;
};

export default function HomeClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Likes and bookmarks states
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const [bookmarkedStates, setBookmarkedStates] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Share popover state
  const [activeShareSlug, setActiveShareSlug] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  // Comments state
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [activeCommentsSlug, setActiveCommentsSlug] = useState<string | null>(null);
  const [activeCommentsTitle, setActiveCommentsTitle] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Signup fields inside comments thread
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  // Modals state
  const [showHireModal, setShowHireModal] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize and load persistent data
  useEffect(() => {
    setMounted(true);
    
    // Check admin session
    const savedSecret = sessionStorage.getItem("agent_secret");
    if (savedSecret) {
      setIsAdmin(true);
    }

    // Load persistent tab
    const savedTab = localStorage.getItem("homepage_active_tab") as TabId;
    if (savedTab && ["projects", "feeds", "philosophy", "connect"].includes(savedTab)) {
      setActiveTab(savedTab);
    }

    // Load user for comments
    const savedUser = localStorage.getItem("comment_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load comments map
    const savedComments = localStorage.getItem("post_comments");
    if (savedComments) {
      setCommentsMap(JSON.parse(savedComments));
    } else {
      const seed: Record<string, Comment[]> = {};
      const mockNames = ["Adekunle Kolawole", "Mark Jaquith", "Dan Peguine", "Tobi Olawale"];
      const mockHandles = ["@adekunle_k", "@markjaquith", "@danpeguine", "@tobi_olawale"];
      const mockTexts = [
        "This is an absolute masterpiece! Clean architecture.",
        "Spot on indexing advice, helped optimize our queries.",
        "The design speed of this portfolio is next level.",
        "Super clean MVP turnaround. Highly recommended developer!"
      ];
      
      projects.forEach(p => {
        seed[p.slug] = [
          {
            id: "1",
            name: mockNames[0],
            handle: mockHandles[0],
            text: mockTexts[0],
            timestamp: "2 hours ago"
          },
          {
            id: "2",
            name: mockNames[1],
            handle: mockHandles[1],
            text: mockTexts[1],
            timestamp: "30 mins ago"
          }
        ];
      });

      initialBlogs.forEach(b => {
        seed[b.slug] = [
          {
            id: "1",
            name: mockNames[2],
            handle: mockHandles[2],
            text: mockTexts[2],
            timestamp: "1 hour ago"
          },
          {
            id: "2",
            name: mockNames[3],
            handle: mockHandles[3],
            text: mockTexts[3],
            timestamp: "10 mins ago"
          }
        ];
      });

      setCommentsMap(seed);
      localStorage.setItem("post_comments", JSON.stringify(seed));
    }

    // Initialize randomized likes counts
    const initialLikes: Record<string, number> = {};
    projects.forEach(p => {
      initialLikes[p.slug] = Math.floor(Math.random() * 280) + 140;
    });
    initialBlogs.forEach(b => {
      initialLikes[b.slug] = Math.floor(Math.random() * 150) + 50;
    });
    setLikes(initialLikes);
  }, [initialBlogs]);

  const changeTab = (tab: TabId) => {
    setActiveTab(tab);
    localStorage.setItem("homepage_active_tab", tab);
  };

  // Story slideshow timer
  useEffect(() => {
    if (activeStoryIdx === null) return;
    setStoryProgress(0);

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;
    const user = {
      name: signupName.trim(),
      email: signupEmail.trim()
    };
    setCurrentUser(user);
    localStorage.setItem("comment_user", JSON.stringify(user));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentsSlug || !currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: currentUser.name,
      handle: `@${currentUser.name.toLowerCase().replace(/\s+/g, "")}`,
      text: commentInput.trim(),
      timestamp: "Just now"
    };

    const updatedComments = {
      ...commentsMap,
      [activeCommentsSlug]: [...(commentsMap[activeCommentsSlug] || []), newComment]
    };

    setCommentsMap(updatedComments);
    localStorage.setItem("post_comments", JSON.stringify(updatedComments));
    setCommentInput("");
  };

  // Filter projects
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

  // Filter blogs (Feeds)
  const filteredBlogs = initialBlogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = !selectedCategory || 
                            b.tags.some((t: string) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
                            b.category.toLowerCase() === selectedCategory.toLowerCase();
                            
    return matchesSearch && matchesCategory;
  });

  // Compute category counts dynamically
  const categoryCounts = initialBlogs.reduce((acc: Record<string, number>, curr) => {
    const cat = curr.category || "Tech";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Extract all unique categories dynamically from the actual blog posts
  const blogCategories = Array.from(
    new Set(initialBlogs.map(b => b.category || "Tech"))
  ).sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));

  const categories = ["Next.js", "Gemini AI", "Node.js", "React", "PostgreSQL", "TailwindCSS"];
  const totalLikes = Object.values(likes).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE NAVBAR */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
        <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
          Samuel Stanley
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
          <div className="flex justify-end md:hidden">
            <button className="p-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card Summary */}
          <div className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-[var(--border)]">
            <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 shadow-lg relative">
              <div className="w-full h-full rounded-full border-2 border-[var(--bg)] overflow-hidden">
                <ProfilePhoto />
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--bg)] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
            
            <div className="space-y-0.5">
              <h3 className="font-black text-base text-[var(--text-primary)]">Samuel Stanley</h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">@foundersdev</p>
            </div>

            {/* Performance Stats */}
            <div className="w-full flex justify-between text-center py-2 bg-black/5 dark:bg-white/2 rounded-xl">
              <div className="flex-1">
                <div className="font-black text-xs">14.2K</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Visits</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <div className="flex-1">
                <div className="font-black text-xs">{mounted ? totalLikes.toLocaleString() : "0"}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Likes</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <div className="flex-1">
                <div className="font-black text-xs">1.2K</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Followers</div>
              </div>
            </div>

            {/* Bio Details */}
            <div className="text-[11px] leading-relaxed text-[var(--text-secondary)] font-medium">
              I build and launch high-performance <span className="font-black text-[var(--text-primary)]">websites, SaaS platforms, and custom digital products</span> in 14-30 days flat. Let's turn your vision into clean, production-ready code.
            </div>
          </div>

          {/* Sidebar Nav Actions */}
          <nav className="space-y-1">
            <button 
              onClick={() => { changeTab("projects"); setSelectedCategory(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "projects" && !selectedCategory ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <Grid className="w-4 h-4" />
              <span>Projects</span>
            </button>
            
            <button 
              onClick={() => { changeTab("feeds"); setSelectedCategory(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "feeds" && !selectedCategory ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feeds</span>
            </button>

            <button 
              onClick={() => { changeTab("philosophy"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "philosophy" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Philosophy</span>
            </button>
            <button 
              onClick={() => { changeTab("connect"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "connect" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              <span>Connect</span>
            </button>
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
                    onClick={() => { 
                      setSelectedCategory(isSelected ? null : cat); 
                      if (activeTab !== "projects" && activeTab !== "feeds") {
                        changeTab("projects");
                      }
                      setSidebarOpen(false); 
                    }}
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

      {/* MAIN CONTENT FEED WINDOW (FULL WIDTH & NO SIDE PADDING) */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="sticky top-0 z-40 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] px-5 py-4 flex items-center justify-between gap-4">
          
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
            
            {/* Inline Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle inline />
            </div>

            {/* Notification Bell (Only visible to authenticated owner) */}
            {isAdmin && (
              <button className="relative p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all active:scale-95 group">
                <Bell className="w-4.5 h-4.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--coral)] animate-pulse" />
              </button>
            )}

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

        {/* FEED INNER SCROLL (FULL WIDTH) */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 w-full max-w-none">
          
          {/* CLIENT REVIEWS / TESTIMONIALS STORIES (Hidden on Feeds Page) */}
          {activeTab !== "feeds" && (
            <div className="space-y-2 px-5 md:px-8">
              <h4 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-extrabold mb-1">Stories / Client Testimonials</h4>
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
                {testimonials.map((t, idx) => (
                  <div 
                    key={t.handle}
                    onClick={() => setActiveStoryIdx(idx)}
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer snap-start"
                  >
                    <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 transition-all hover:scale-105 active:scale-95">
                      {/* Centered avatar with solid white background inside gradient border */}
                      <div className="w-full h-full rounded-full border-2 border-[var(--bg)] bg-white text-gray-900 flex items-center justify-center font-black text-sm">
                        {t.avatar}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{t.handle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE PROJECTS RENDER BLOCK (GRID LAYOUT) */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              
              {/* Category tag status card */}
              {(selectedCategory || searchQuery) && (
                <div className="mx-5 md:mx-8 p-4 border border-[var(--border)] bg-black/5 dark:bg-white/2 rounded-2xl flex items-center justify-between text-xs">
                  <span>
                    Showing {filteredProjects.length} projects matching 
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

              {/* Feed Post Grid */}
              {filteredProjects.length === 0 ? (
                <div className="mx-5 md:mx-8 py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
                  No projects match your query. Try searching for other technologies like #nextjs, #prisma.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 md:px-8 w-full">
                  {filteredProjects.map((p) => {
                    const isLiked = likedStates[p.slug];
                    const isBookmarked = bookmarkedStates[p.slug];
                    const isCopied = copiedStates[p.slug];
                    const pUrl = p.link !== "#" ? p.link : "https://samuelstanley.com";

                    return (
                      <article 
                        key={p.slug}
                        className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-sm animate-in fade-in duration-200 flex flex-col justify-between relative"
                      >
                        <div>
                          {/* Post Header */}
                          <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-[28px] h-[28px] rounded-full border border-[var(--border)] overflow-hidden">
                                <ProfilePhoto />
                              </div>
                              <div>
                                <div className="font-extrabold text-[11px] flex items-center gap-1">
                                  <span>Samuel</span>
                                  <span className="text-[8px] text-green-500 font-bold bg-green-950/20 border border-green-500/20 px-1 py-0.2 rounded-full font-mono">Live</span>
                                </div>
                                <div className="text-[8px] text-[var(--text-secondary)] flex items-center gap-0.5 font-mono truncate max-w-[120px]">
                                  <span>{p.link !== "#" ? p.link.replace("https://", "").replace("/", "") : "Remote"}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-[var(--text-secondary)] font-bold">{p.tag}</span>
                          </div>

                          {/* Post Image / Media Content */}
                          <div className="border-b border-[var(--border)] bg-black/10 dark:bg-white/2 p-5 flex flex-col justify-between min-h-[170px] relative select-none">
                            <div 
                              className="absolute inset-0 z-0 opacity-10" 
                              style={{ background: `radial-gradient(circle at 75% 25%, ${p.color || "var(--coral)"} 0%, transparent 70%)` }}
                            />
                            
                            <div className="relative z-10 space-y-2">
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: p.color || "var(--coral)" }}>
                                {p.status}
                              </span>
                              <h3 className="text-base font-black tracking-tight text-[var(--text-primary)]">
                                {p.title}
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {p.desc}
                              </p>
                            </div>

                            <div className="relative z-10 pt-3 flex flex-wrap gap-1">
                              {p.tech.map(t => (
                                <span 
                                  key={t}
                                  onClick={() => setSelectedCategory(t)}
                                  className="text-[8px] font-mono font-bold bg-black/10 dark:bg-white/5 border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] hover:border-[var(--coral)] hover:text-[var(--coral)] transition-colors cursor-pointer"
                                >
                                  #{t.toLowerCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          {/* Engagement Actions Bar */}
                          <div className="px-4 py-2 border-b border-[var(--border)] flex items-center justify-between bg-black/5 dark:bg-white/1 relative">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleLike(p.slug)}
                                className={`p-0.5 hover:scale-115 transition-all ${isLiked ? "text-red-500 fill-red-500" : "text-[var(--text-primary)]"}`}
                              >
                                <Heart className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveCommentsSlug(p.slug);
                                  setActiveCommentsTitle(p.title);
                                }}
                                className="p-0.5 hover:scale-115 transition-all text-[var(--text-primary)]"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              {/* Share Airplane Button */}
                              <button 
                                onClick={() => setActiveShareSlug(activeShareSlug === p.slug ? null : p.slug)}
                                className="p-0.5 hover:scale-115 transition-all text-[var(--text-primary)] relative"
                              >
                                <Send className="w-4 h-4" />
                              </button>

                              {/* Share Popover */}
                              {activeShareSlug === p.slug && (
                                <div className="absolute bottom-10 left-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-2 z-[100] space-y-1 min-w-[150px] animate-in fade-in slide-in-from-bottom-2 duration-150 text-left">
                                  <button 
                                    onClick={() => {
                                      const text = `Check out ${p.title}: ${pUrl}`;
                                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>💬 WhatsApp</span>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(pUrl).then(() => {
                                        setShowShareToast(true);
                                        setTimeout(() => setShowShareToast(false), 2000);
                                      });
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>📋 Copy Link</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => handleBookmark(p.slug, pUrl)}
                              className={`p-0.5 hover:scale-115 transition-all relative ${isBookmarked ? "text-cyan-400 fill-cyan-400" : "text-[var(--text-primary)]"}`}
                            >
                              <Bookmark className="w-4 h-4" />
                              {isCopied && (
                                <span className="absolute -top-7 right-0 bg-cyan-950 border border-cyan-700/50 text-cyan-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-30 animate-fade-in">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Post engagement text info */}
                          <div className="px-4 py-2 text-[10px] space-y-1 bg-black/10 dark:bg-white/2">
                            <div className="font-extrabold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span>{likes[p.slug] || 0} Likes</span>
                            </div>
                            <div 
                              onClick={() => {
                                setActiveCommentsSlug(p.slug);
                                setActiveCommentsTitle(p.title);
                              }}
                              className="text-[9px] text-[var(--text-secondary)] font-bold cursor-pointer hover:underline"
                            >
                              View all {commentsMap[p.slug]?.length || 0} comments
                            </div>
                            <div className="text-[10px] text-[var(--text-secondary)] truncate">
                              <span className="font-bold text-[var(--text-primary)]">samuelstanley</span> {p.desc}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE FEEDS (REAL MARKDOWN BLOG POSTS & SCREENSHOT STYLING) RENDER BLOCK */}
          {activeTab === "feeds" && (
            <div className="space-y-6 px-5 md:px-8 w-full animate-in fade-in duration-300">
              
              {/* Blog Header (Stanley's Log - matching screenshot exactly) */}
              <div className="pt-2 pb-6 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--coral)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] animate-pulse" />
                    <span>Personal Blog</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-[var(--text-primary)]">
                    Stanley's <span className="text-[var(--coral)]">Log</span>
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
                    My honest take on tech, business, and what's actually happening in the Nigerian ecosystem — from a developer's perspective.
                  </p>
                </div>
                
                {/* Stats block from screenshot */}
                <div className="flex gap-6 pt-2 bg-black/5 dark:bg-white/2 px-5 py-3 rounded-2xl border border-[var(--border)] self-stretch md:self-auto justify-around">
                  <div className="text-center">
                    <div className="font-extrabold text-lg text-[var(--text-primary)]">{initialBlogs.length}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Articles</div>
                  </div>
                  <div className="border-r border-[var(--border)] my-1" />
                  <div className="text-center">
                    <div className="font-extrabold text-lg text-[var(--text-primary)]">{Object.keys(categoryCounts).length}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Topics</div>
                  </div>
                </div>
              </div>

              {/* Category Pill Toggles Bar (matching screenshot exactly) */}
              <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x border-b border-[var(--border)]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all snap-start flex items-center gap-1.5 shrink-0 border ${selectedCategory === null ? "bg-[var(--coral)] text-white border-[var(--coral)]" : "bg-black/5 dark:bg-white/2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--coral)] hover:text-[var(--coral)]"}`}
                >
                  <span>All</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${selectedCategory === null ? "bg-white/20 text-white" : "bg-black/10 dark:bg-white/10 text-[var(--text-secondary)]"}`}>
                    {initialBlogs.length}
                  </span>
                </button>
                {blogCategories.map(cat => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(isSelected ? null : cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all snap-start flex items-center gap-1.5 shrink-0 border ${isSelected ? "bg-[var(--coral)] text-white border-[var(--coral)]" : "bg-black/5 dark:bg-white/2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--coral)] hover:text-[var(--coral)]"}`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-black/10 dark:bg-white/10 text-[var(--text-secondary)]"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Blogs Feed Post Grid */}
              {filteredBlogs.length === 0 ? (
                <div className="py-20 text-center text-xs text-[var(--text-secondary)] italic border border-dashed border-[var(--border)] rounded-2xl">
                  No articles found in this category. Try selecting another topic.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {filteredBlogs.map((b) => {
                    const isLiked = likedStates[b.slug];
                    const isBookmarked = bookmarkedStates[b.slug];
                    const isCopied = copiedStates[b.slug];
                    const blogUrl = `https://samuelstanley.com/blog/${b.slug}`;

                    return (
                      <article 
                        key={b.slug}
                        className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden shadow-sm animate-in fade-in duration-200 flex flex-col justify-between relative"
                      >
                        <div>
                          {/* Post Header */}
                          <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-[28px] h-[28px] rounded-full border border-[var(--border)] overflow-hidden">
                                <ProfilePhoto />
                              </div>
                              <div>
                                <div className="font-extrabold text-[11px] flex items-center gap-1">
                                  <span>Samuel</span>
                                  <span className="text-[8px] text-[var(--coral)] font-bold bg-rose-950/20 border border-rose-500/20 px-1 py-0.2 rounded-full font-mono">Blog</span>
                                </div>
                                <div className="text-[8px] text-[var(--text-secondary)] flex items-center gap-0.5 font-mono truncate max-w-[120px]">
                                  <span>{b.category}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-[var(--text-secondary)] font-mono">{b.readTime}</span>
                          </div>

                          {/* Cover Image */}
                          {b.coverImage && (
                            <div className="w-full h-40 overflow-hidden bg-black/10 relative">
                              <img 
                                src={b.coverImage} 
                                alt={b.title} 
                                className="w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          {/* Post Text / Media Content */}
                          <div className="border-b border-[var(--border)] bg-black/5 dark:bg-white/2 p-5 space-y-3">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                                {new Date(b.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                              <h3 className="text-base font-black tracking-tight text-[var(--text-primary)] hover:text-[var(--coral)] transition-colors">
                                <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                                {b.excerpt}
                              </p>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-1">
                              {b.tags.map((t: string) => (
                                <span 
                                  key={t}
                                  onClick={() => setSelectedCategory(t)}
                                  className="text-[8px] font-mono font-bold bg-black/10 dark:bg-white/5 border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] hover:border-[var(--coral)] hover:text-[var(--coral)] transition-colors cursor-pointer"
                                >
                                  #{t.toLowerCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          {/* Engagement Actions Bar */}
                          <div className="px-4 py-2 border-b border-[var(--border)] flex items-center justify-between bg-black/5 dark:bg-white/1 relative">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleLike(b.slug)}
                                className={`p-0.5 hover:scale-115 transition-all ${isLiked ? "text-red-500 fill-red-500" : "text-[var(--text-primary)]"}`}
                              >
                                <Heart className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => {
                                  setActiveCommentsSlug(b.slug);
                                  setActiveCommentsTitle(b.title);
                                }}
                                className="p-0.5 hover:scale-115 transition-all text-[var(--text-primary)]"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              {/* Share Airplane Button */}
                              <button 
                                onClick={() => setActiveShareSlug(activeShareSlug === b.slug ? null : b.slug)}
                                className="p-0.5 hover:scale-115 transition-all text-[var(--text-primary)] relative"
                              >
                                <Send className="w-4 h-4" />
                              </button>

                              {/* Share Popover */}
                              {activeShareSlug === b.slug && (
                                <div className="absolute bottom-10 left-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-2 z-[100] space-y-1 min-w-[150px] animate-in fade-in slide-in-from-bottom-2 duration-150 text-left">
                                  <button 
                                    onClick={() => {
                                      const text = `Check out "${b.title}": ${blogUrl}`;
                                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>💬 WhatsApp</span>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(blogUrl).then(() => {
                                        setShowShareToast(true);
                                        setTimeout(() => setShowShareToast(false), 2000);
                                      });
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>📋 Copy Link</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => handleBookmark(b.slug, blogUrl)}
                              className={`p-0.5 hover:scale-115 transition-all relative ${isBookmarked ? "text-cyan-400 fill-cyan-400" : "text-[var(--text-primary)]"}`}
                            >
                              <Bookmark className="w-4 h-4" />
                              {isCopied && (
                                <span className="absolute -top-7 right-0 bg-cyan-950 border border-cyan-700/50 text-cyan-200 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-30 animate-fade-in">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Post engagement text info */}
                          <div className="px-4 py-2 text-[10px] space-y-1 bg-black/10 dark:bg-white/2">
                            <div className="font-extrabold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span>{likes[b.slug] || 0} Likes</span>
                            </div>
                            <div 
                              onClick={() => {
                                setActiveCommentsSlug(b.slug);
                                setActiveCommentsTitle(b.title);
                              }}
                              className="text-[9px] text-[var(--text-secondary)] font-bold cursor-pointer hover:underline"
                            >
                              View all {commentsMap[b.slug]?.length || 0} comments
                            </div>
                            <div className="text-[10px] text-[var(--text-secondary)] truncate">
                              <span className="font-bold text-[var(--text-primary)]">samuelstanley</span> {b.excerpt}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE PHILOSOPHY PANEL */}
          {activeTab === "philosophy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 md:px-8 w-full animate-in fade-in duration-200">
              {philosophies.map(p => (
                <div 
                  key={p.title} 
                  className="border border-[var(--border)] p-5 rounded-2xl bg-[var(--surface)] space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    </div>
                    <h4 className="font-black text-sm text-[var(--text-primary)]">{p.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACTIVE CONNECT PANEL (FULL WIDTH INTERACTIVE FORM) */}
          {activeTab === "connect" && (
            <div className="max-w-xl mx-auto px-5 w-full animate-in fade-in duration-200 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Let's build something epic</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                  Fill out the secure workstation dispatch form below to initiate an MVP project scheduling sweep.
                </p>
              </div>
              <div className="border border-[var(--border)] p-6 md:p-8 rounded-3xl bg-[var(--surface)] shadow-md">
                <ContactForm />
              </div>
            </div>
          )}

        </div>
      </main>

      {/* COMMENTS THREAD SLIDING DRAWER MODAL */}
      {activeCommentsSlug !== null && (
        <div className="fixed inset-0 z-[20000] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setActiveCommentsSlug(null)} />
          
          {/* Comments Panel */}
          <div className="relative w-full max-w-md h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-black/5 dark:bg-white/2">
              <div>
                <h4 className="font-black text-sm text-[var(--text-primary)]">Comments Thread</h4>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium truncate max-w-[280px]">
                  {activeCommentsTitle}
                </p>
              </div>
              <button 
                onClick={() => setActiveCommentsSlug(null)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Comments List area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {commentsMap[activeCommentsSlug]?.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--text-secondary)] italic">
                  No comments yet. Be the first to start the thread!
                </div>
              ) : (
                <div className="space-y-4 border-l-2 border-[var(--border)] pl-4 ml-2">
                  {commentsMap[activeCommentsSlug]?.map((comm) => (
                    <div key={comm.id} className="space-y-1 relative">
                      {/* Thread Node Dot */}
                      <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--coral)] border border-[var(--surface)]" />
                      
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[11px] text-[var(--text-primary)]">
                          {comm.name} <span className="font-mono text-[9px] text-[var(--text-secondary)] font-normal ml-1">{comm.handle}</span>
                        </span>
                        <span className="text-[8px] text-[var(--text-secondary)] font-mono">{comm.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed bg-black/5 dark:bg-white/2 p-2.5 rounded-xl">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input area / Email Sign-up box */}
            <div className="p-5 border-t border-[var(--border)] bg-black/5 dark:bg-white/2 space-y-3">
              {!currentUser ? (
                /* Dynamic Signup to Join Discussion */
                <form onSubmit={handleSignup} className="space-y-3 p-4 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
                  <div className="text-center space-y-1">
                    <h5 className="font-black text-[11px] text-[var(--text-primary)]">Sign up to join discussion</h5>
                    <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed">
                      Enter your details to register your developer name and drop a comment on the thread.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Your Name (e.g. John Doe)..."
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[var(--coral)] bg-[var(--bg)] text-[var(--text-primary)]"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address..."
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[var(--coral)] bg-[var(--bg)] text-[var(--text-primary)]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2 bg-[var(--coral)] hover:bg-[var(--coral)]/90 text-white rounded-xl text-xs font-bold shadow transition-all"
                  >
                    Join Discussion
                  </button>
                </form>
              ) : (
                /* Post Comment form */
                <form onSubmit={handlePostComment} className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      placeholder={`Comment as @${currentUser.name.toLowerCase().replace(/\s+/g, "")}...`}
                      required
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full border border-[var(--border)] rounded-full pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-[var(--coral)] bg-[var(--surface)] text-[var(--text-primary)] font-medium"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2.5 bg-[var(--coral)] text-white rounded-full text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE ACTION HUD TOAST CONFIRMATION */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-[30000] bg-cyan-900 border border-cyan-700/50 text-cyan-200 text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl animate-bounce">
          ✓ Link copied to clipboard!
        </div>
      )}

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
