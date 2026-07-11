"use client";

import { useEffect, useState } from "react";
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
  Home,
  Plus, 
  LogOut,
  MapPin,
  Menu,
  X,
  Terminal,
  Activity,
  HeartHandshake,
  DollarSign,
  ArrowLeft
} from "lucide-react";
import { projects, techStack, philosophies, testimonials } from "./components/data";
import { ProfilePhoto, ContactModal, CVModal } from "./components/ui";
import { ContactForm } from "./components/ContactSection";
import { ThemeToggle } from "./components/ThemeToggle";
import { Starfield } from "./components/Starfield";

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

type TabId = "home" | "projects" | "feeds" | "philosophy" | "connect" | "pricing" | "insight";

type Comment = {
  id: string;
  name: string;
  handle: string;
  text: string;
  timestamp: string;
};

// Convert a GithubProject DB record to the project card shape used by the UI
function githubToProject(g: any) {
  return {
    title: g.displayTitle || g.repoName.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    slug: g.repoName,
    tag: g.statusLabel ? `${g.statusLabel}` : (g.language || "GitHub Repo"),
    desc: g.displayDesc || `${g.fullName} — ${g.stars} ⭐ · ${g.forks} 🍴`,
    tech: g.displayTags?.length ? g.displayTags : (g.language ? [g.language] : []),
    color: "#6b8cff",
    link: g.homepage || g.repoUrl || "#",
    repo: g.repoUrl || "#",
    status: g.statusLabel || "Live",
    stars: g.stars,
    forks: g.forks,
    lastPushedAt: g.lastPushedAt,
    isGithub: true,
  };
}

export default function HomeClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [githubProjects, setGithubProjects] = useState<any[]>([]);
  
  // Database metrics states
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [shares, setShares] = useState<Record<string, number>>({});
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({});
  const [bookmarkedStates, setBookmarkedStates] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Global site metrics
  const [visitsCount, setVisitsCount] = useState(712);
  const [followersCount, setFollowersCount] = useState(80);
  const [hasFollowed, setHasFollowed] = useState(false);

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
  const [showCVModal, setShowCVModal] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize and load metrics from Database + local storage
  useEffect(() => {
    setMounted(true);
    
    // Check admin session
    const savedSecret = sessionStorage.getItem("agent_secret");
    if (savedSecret) {
      setIsAdmin(true);
    }

    // Fetch live GitHub projects from database
    fetch("/api/github/projects")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.projects?.length > 0) {
          setGithubProjects(data.projects.map(githubToProject));
        }
      })
      .catch(() => {}); // Silent fallback to static data.ts

    // Load persistent tab
    const savedTab = localStorage.getItem("homepage_active_tab") as TabId;
    if (savedTab && ["home", "projects", "feeds", "philosophy", "connect", "pricing", "insight"].includes(savedTab)) {
      setActiveTab(savedTab);
    } else {
      setActiveTab("home");
    }

    // Override if tab URL query parameter is provided
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab") as TabId;
      if (tabParam && ["home", "projects", "feeds", "philosophy", "connect", "pricing", "insight"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    // Load user for comments
    const savedUser = localStorage.getItem("comment_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load liked states from localStorage
    const savedLikedStates = localStorage.getItem("post_liked_states");
    if (savedLikedStates) {
      setLikedStates(JSON.parse(savedLikedStates));
    }

    // Load followed state
    const savedFollowed = localStorage.getItem("global_has_followed");
    if (savedFollowed === "true") {
      setHasFollowed(true);
    }

    // Log visit in database (session-based)
    const visitLogged = sessionStorage.getItem("global_visit_logged");
    if (!visitLogged) {
      fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "global", action: "visit" })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.visits === "number") {
          setVisitsCount(data.visits);
          sessionStorage.setItem("global_visit_logged", "true");
        }
      })
      .catch(() => {});
    }

    // Fetch live metrics from Database (with cache buster)
    fetch("/api/metrics?t=" + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (typeof data.globalVisits === "number") {
            setVisitsCount(data.globalVisits);
          }
          if (typeof data.globalFollowers === "number") {
            setFollowersCount(data.globalFollowers);
          }

          if (data.metrics) {
            const dbLikes: Record<string, number> = {};
            const dbShares: Record<string, number> = {};
            const dbComments: Record<string, Comment[]> = {};

            // Seed defaults
            projects.forEach((p) => {
              dbLikes[p.slug] = 0;
              dbShares[p.slug] = 0;
              dbComments[p.slug] = [];
            });
            initialBlogs.forEach((b) => {
              dbLikes[b.slug] = 0;
              dbShares[b.slug] = 0;
              dbComments[b.slug] = [];
            });

            // Override with values from DB
            Object.entries(data.metrics).forEach(([slug, val]: [string, any]) => {
              dbLikes[slug] = val.likes ?? 0;
              dbShares[slug] = val.shares ?? 0;
              dbComments[slug] = val.comments ?? [];
            });

            setLikes(dbLikes);
            setShares(dbShares);
            setCommentsMap(dbComments);
          }
        }
      })
      .catch((err) => console.error("Error loading metrics:", err));
  }, [initialBlogs]);

  const changeTab = (tab: TabId) => {
    setActiveTab(tab);
    localStorage.setItem("homepage_active_tab", tab);
  };

  const handleFollow = async () => {
    if (hasFollowed) return;
    setHasFollowed(true);
    localStorage.setItem("global_has_followed", "true");
    
    // Optimistic UI update
    setFollowersCount(prev => prev + 1);
    triggerConfetti();

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "global", action: "follow" }),
      });
      const data = await res.json();
      if (data.success && typeof data.followers === "number") {
        setFollowersCount(data.followers);
      }
    } catch (err) {
      console.error("Failed to sync follow metrics:", err);
    }
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
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStoryIdx]);

  // Sync Likes with DB
  const handleLike = async (slug: string) => {
    const isLiked = likedStates[slug];
    const change = isLiked ? -1 : 1;

    // Update locally first
    const updatedLikes = { ...likes, [slug]: Math.max(0, (likes[slug] || 0) + change) };
    const updatedLikedStates = { ...likedStates, [slug]: !isLiked };
    
    setLikes(updatedLikes);
    setLikedStates(updatedLikedStates);
    localStorage.setItem("post_liked_states", JSON.stringify(updatedLikedStates));

    if (!isLiked) {
      triggerConfetti();
    }

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "like", likeChange: change }),
      });
      const data = await res.json();
      if (data.success) {
        setLikes((prev) => ({ ...prev, [slug]: data.likes }));
      }
    } catch (err) {
      console.error("Failed to sync like count:", err);
    }
  };

  // Sync Shares with DB
  const handleShareTrack = async (slug: string) => {
    const updatedShares = { ...shares, [slug]: (shares[slug] || 0) + 1 };
    setShares(updatedShares);

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "share" }),
      });
      const data = await res.json();
      if (data.success) {
        setShares((prev) => ({ ...prev, [slug]: data.shares }));
      }
    } catch (err) {
      console.error("Failed to sync share metrics:", err);
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

  // Sync Comments with DB
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentsSlug || !currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: currentUser.name,
      handle: `@${currentUser.name.toLowerCase().replace(/\s+/g, "")}`,
      text: commentInput.trim(),
      timestamp: "Just now"
    };

    // Update locally first
    const localThread = [...(commentsMap[activeCommentsSlug] || []), newComment];
    setCommentsMap((prev) => ({ ...prev, [activeCommentsSlug]: localThread }));
    setCommentInput("");

    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: activeCommentsSlug, action: "comment", comment: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentsMap((prev) => ({ ...prev, [activeCommentsSlug]: data.comments }));
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // Use live GitHub projects if loaded, otherwise fall back to static data.ts
  const activeProjects = githubProjects.length > 0 ? githubProjects : projects;

  // Filter projects
  const filteredProjects = activeProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tech.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.tag.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = !selectedCategory || 
                            p.tech.some((t: string) => t.toLowerCase() === selectedCategory.toLowerCase()) ||
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

  if (activeTab === "pricing") {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col font-sans p-6 md:p-12 relative overflow-y-auto">
        <Starfield />
        
        {/* Back Button */}
        <div className="max-w-4xl mx-auto w-full mb-8 z-10 animate-in fade-in duration-200">
          <button
            onClick={() => changeTab("home")}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </button>
        </div>

        {/* ACTIVE PRICING PANEL */}
        <div className="max-w-4xl mx-auto px-5 w-full animate-in fade-in duration-200 space-y-8 flex-1 flex flex-col justify-center py-4 z-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">Developer Analytics Pricing</h3>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
              Simple, transparent plans for developers looking to integrate lightweight, privacy-focused tracking tools into their apps and websites.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Starter Plan */}
            <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[var(--coral)]/40 hover:shadow-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">Starter</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-[var(--text-primary)]">$28</span>
                    <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Perfect for hobby projects and individual developers needing basic tracking capabilities.
                </p>
                <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Up to 10k visits/mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>1 active domain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Core Web Vitals tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>24h data retention</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setShowHireModal(true)}
                className="w-full mt-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[var(--text-primary)]"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-[var(--coral)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden shadow-md transition-all hover:shadow-xl">
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-[var(--coral)] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Popular
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--coral)]">Pro</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-[var(--text-primary)]">$87</span>
                    <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Ideal for growing SaaS applications and professional developers who need deep analytics.
                </p>
                <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Up to 100k visits/mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>5 active domains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Custom event goals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>30-day data retention</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setShowHireModal(true)}
                className="w-full mt-6 py-2.5 rounded-xl bg-[var(--coral)] text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-[var(--coral)]/10 transition-all"
              >
                Go Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[var(--coral)]/40 hover:shadow-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">Enterprise</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-[var(--text-primary)]">$200</span>
                    <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  For heavy workloads, agencies, and teams requiring full data ownership and dedicated support.
                </p>
                <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Unlimited visits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>Unlimited domains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>White-labeled analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                    <span>1-year data retention</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setShowHireModal(true)}
                className="w-full mt-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[var(--text-primary)]"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>

        {/* Modal access */}
        <ContactModal isOpen={showHireModal} onClose={() => setShowHireModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE NAVBAR */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
        <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
          founder's dev
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle inline />
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-primary)] active:scale-95 transition-all"
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
                <div className="font-black text-xs" suppressHydrationWarning>{mounted ? visitsCount.toLocaleString() : "712"}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Visits</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <div className="flex-1">
                <div className="font-black text-xs" suppressHydrationWarning>{mounted ? totalLikes.toLocaleString() : "0"}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Likes</div>
              </div>
              <div className="border-r border-[var(--border)] my-1" />
              <button 
                onClick={handleFollow}
                disabled={hasFollowed}
                className={`flex-1 rounded-lg transition-all ${hasFollowed ? 'cursor-default' : 'hover:bg-white/5 active:scale-95 group'}`}
              >
                <div className="font-black text-xs group-hover:text-[var(--coral)] transition-colors" suppressHydrationWarning>{mounted ? followersCount.toLocaleString() : "80"}</div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold flex items-center justify-center gap-0.5">
                  <span>Followers</span>
                  {!hasFollowed && <span className="text-[7px] text-[var(--coral)] font-bold">+</span>}
                </div>
              </button>
            </div>

            {/* Bio Details */}
            <div className="text-[11px] leading-relaxed text-[var(--text-secondary)] font-medium">
              I build and launch high-performance <span className="font-black text-[var(--text-primary)]">websites, SaaS platforms, and custom digital products</span> in 14-30 days flat. Let's turn your vision into clean, production-ready code.
            </div>
          </div>

          {/* Sidebar Nav Actions */}
          <nav className="space-y-1">
            <button 
              onClick={() => { changeTab("home"); setSelectedCategory(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "home" && !selectedCategory ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

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
              onClick={() => { changeTab("insight"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "insight" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Founder's Insight</span>
            </button>
            <button 
              onClick={() => { changeTab("connect"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "connect" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              <span>Connect</span>
            </button>
            <button 
              onClick={() => { changeTab("pricing"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${(activeTab as string) === "pricing" ? "bg-[var(--coral)] text-white" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Pricing</span>
            </button>
            <button 
              onClick={() => { setShowHireModal(true); setSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all bg-white/5 border border-[var(--border)] text-[var(--text-primary)] hover:bg-white/10 hover:border-[var(--coral)]/40 active:scale-95 mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0 text-[var(--coral)]" />
              <span>Hire me</span>
            </button>
          </nav>
        </div>

        {/* Footer info & appearance status */}
        <div className="space-y-4 pt-4 border-t border-[var(--border)]">
          {/* Theme Toggle aligned to the bottom */}
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-bold px-1">
            <span>Appearance</span>
            <ThemeToggle inline />
          </div>
          
          <div className="text-[9px] text-[var(--text-secondary)] space-y-0.5 pt-3 border-t border-[var(--border)]/30">
            <div>© 2026 Samuel Stanley. All rights reserved.</div>
            <div>Built with Next.js, Antigravity, and AI.</div>
          </div>
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
        


        {/* FEED INNER SCROLL (FULL WIDTH) */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 w-full max-w-none">
          


          {/* ACTIVE HOME/ABOUT ME PANEL */}
          {activeTab === "home" && (
            <div className="max-w-3xl mx-auto px-5 md:px-8 w-full animate-in fade-in duration-300 space-y-10">
              
              {/* Profile Hero Layout (Shown on mobile, hidden on desktop since it's already in the sidebar) */}
              <div className="md:hidden flex flex-col items-center text-center space-y-6 py-4 relative w-full">

                {/* Profile Image with neon ring and active status dot */}
                <div className="w-[144px] h-[144px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 shadow-2xl relative transition-transform hover:scale-105 duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <ProfilePhoto />
                  </div>
                  {/* Glowing active dot */}
                  <span className="absolute bottom-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-green-500 border-2.5 border-[#050810] shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse" />
                </div>

                {/* Name & Handle */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tight">Samuel Stanley</h2>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--coral)] text-white text-[10px] font-black shadow-[0_2px_8px_rgba(255,77,77,0.3)]" title="Verified Professional">✓</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-mono tracking-wider">@foundersdev</p>
                </div>

                {/* Counter Badges (Matching first screenshot stats) */}
                <div className="w-full max-w-md flex justify-between items-center text-center py-3 border-y border-[var(--border)] font-sans">
                  <div className="flex-1 py-1">
                    <div className="font-black text-sm md:text-base text-[var(--text-primary)]" suppressHydrationWarning>
                      {mounted ? visitsCount.toLocaleString() : "712"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-0.5">
                      Visits
                    </div>
                  </div>
                  
                  <div className="border-l border-[var(--border)] h-8" />
                  
                  <div className="flex-1 py-1">
                    <div className="font-black text-sm md:text-base text-[var(--text-primary)]" suppressHydrationWarning>
                      {mounted ? totalLikes.toLocaleString() : "0"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-0.5">
                      Likes
                    </div>
                  </div>
                  
                  <div className="border-l border-[var(--border)] h-8" />
                  
                  <button 
                    onClick={handleFollow}
                    disabled={hasFollowed}
                    className={`flex-1 py-1 rounded-xl transition-all ${hasFollowed ? 'cursor-default' : 'hover:bg-white/5 active:scale-95 group'}`}
                  >
                    <div className="font-black text-sm md:text-base text-[var(--text-primary)] group-hover:text-[var(--coral)] transition-colors" suppressHydrationWarning>
                      {mounted ? followersCount.toLocaleString() : "80"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-0.5 flex items-center justify-center gap-1">
                      <span>Followers</span>
                      {!hasFollowed && (
                        <span className="text-[9px] font-black bg-[var(--coral)] text-white px-1 py-0.2 rounded shadow-[0_2px_6px_rgba(255,77,77,0.3)] animate-pulse shrink-0">
                          +
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Bio text */}
                <div className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)] font-medium max-w-xl">
                  I build and launch high-performance <span className="font-black text-[var(--text-primary)]">websites, SaaS platforms, and custom digital products</span> in 14-30 days flat. Let's turn your vision into clean, production-ready code.
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md animate-in fade-in duration-300">
                  <button 
                    onClick={() => setShowHireModal(true)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-[var(--coral)] text-white hover:brightness-110 active:scale-95 shadow-[0_4px_16px_rgba(255,77,77,0.2)] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Hire me</span>
                  </button>
                  <button 
                    onClick={handleFollow}
                    disabled={hasFollowed}
                    className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasFollowed 
                        ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                        : "bg-white/5 border border-[var(--border)] text-[var(--text-primary)] hover:bg-white/10 active:scale-95"
                    }`}
                  >
                    {hasFollowed ? (
                      <>
                        <Check className="w-4 h-4 shrink-0 text-green-400 animate-scale-up" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CLIENT REVIEWS / TESTIMONIALS STORIES (Embedded on Home Page below profile hero) */}
              <div className="space-y-2 w-full animate-in fade-in duration-300 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
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

              {/* Live Focus Status Bar */}
              <div className="border border-green-500/20 bg-green-500/5 rounded-2xl p-4 flex items-center gap-3.5 text-xs text-green-300 md:text-sm">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <div className="leading-relaxed">
                  <span className="font-bold text-white">Current Focus:</span> Designing high-performance SaaS templates & accepting custom MVP development contracts for Q3 2026.
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight border-b border-[var(--border)] pb-2 flex items-center gap-2 text-[var(--text-primary)]">
                  <Terminal className="w-4.5 h-4.5 text-[var(--coral)]" />
                  <span>Professional Summary</span>
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                  Results-driven Full Stack Engineer with expertise in building scalable, high-performance web applications and backend systems. Proven track record of end-to-end ownership, from UI/UX design to backend microservices, database architecture, and CI/CD pipelines. Passionate about writing clean, maintainable code and solving complex business problems through technology.
                </p>
              </div>

              {/* Core Competencies */}
              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight border-b border-[var(--border)] pb-2 flex items-center gap-2 text-[var(--text-primary)]">
                  <Activity className="w-4.5 h-4.5 text-[var(--cyan)]" />
                  <span>Core Competencies</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">Full Stack Architecture</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Designing resilient, scalable, and persistent architectures using Next.js, Node.js, and NestJS.</p>
                  </div>
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">API & Backend Engineering</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Designing REST & GraphQL APIs, authentication, webhooks, and asynchronous background queues.</p>
                  </div>
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">Database Management</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Modeling and optimizing PostgreSQL, MongoDB, Redis, Prisma, and serverless databases like Neon.</p>
                  </div>
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">UI/UX Excellence</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Building pixel-perfect, highly responsive interfaces with TailwindCSS and rich interaction animations.</p>
                  </div>
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">DevOps & CI/CD</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Setting up Docker containers, Vercel deployments, AWS architecture, and automated GitHub Actions pipelines.</p>
                  </div>
                  <div className="border border-[var(--border)] p-4 rounded-xl bg-black/5 dark:bg-white/2 space-y-1 hover:border-[var(--coral)]/40 transition-colors">
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">Custom Integrations</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">Integrating external APIs, automated notifications, Resend, and payment gateways like Paystack and Flutterwave.</p>
                  </div>
                </div>
              </div>

              {/* Quick Navigation to Projects */}
              <div className="border border-[var(--border)] p-6 rounded-2xl bg-black/5 dark:bg-white/2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-sm text-[var(--text-primary)]">Want to see my live projects?</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Explore interactive case studies, GitHub source links, and direct deployments.</p>
                </div>
                <button 
                  onClick={() => changeTab("projects")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--coral)] text-white hover:brightness-110 active:scale-95 transition-all self-start md:self-auto flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
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

              {/* Feed Post Grid — only render after mount to avoid SSR/client hydration mismatch on <Link> */}
              {!mounted ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 md:px-8 w-full">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] overflow-hidden animate-pulse">
                      <div className="h-[160px] bg-black/20" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-black/10 dark:bg-white/5 rounded w-3/4" />
                        <div className="h-3 bg-black/10 dark:bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
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
                          {/* Live Site Screenshot – clickable to case study */}
                          <Link href={`/project/${p.slug}`} className="block group cursor-pointer">
                            <div className="relative border-b border-[var(--border)] overflow-hidden bg-black/20" style={{ height: "160px" }}>
                              {p.link && p.link !== "#" ? (
                                <>
                                  <img
                                    src={`https://api.microlink.io/?url=${encodeURIComponent(p.link)}&screenshot=true&meta=false&embed=screenshot.url`}
                                    alt={`${p.title} preview`}
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                      const el = e.currentTarget;
                                      el.style.display = "none";
                                      const fb = el.nextElementSibling as HTMLElement;
                                      if (fb) fb.style.display = "flex";
                                    }}
                                  />
                                  <div
                                    className="absolute inset-0 hidden flex-col items-center justify-center"
                                    style={{ background: `radial-gradient(circle at 60% 30%, ${p.color || "var(--coral)"} 0%, #0a0f1a 70%)` }}
                                  >
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">{p.title}</span>
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center"
                                  style={{ background: `radial-gradient(circle at 60% 30%, ${p.color || "var(--coral)"} 0%, #0a0f1a 70%)` }}
                                >
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">{p.title}</span>
                                </div>
                              )}
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                                  View Case Study →
                                </span>
                              </div>
                              {/* Status badge */}
                              <span
                                className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white shadow-lg"
                                style={{ backgroundColor: p.color || "var(--coral)" }}
                              >
                                {p.status}
                              </span>
                              {/* Language badge */}
                              <span
                                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-[var(--text-secondary)] bg-black/60 backdrop-blur-sm border border-white/10 shadow-lg"
                              >
                                {p.tag}
                              </span>
                            </div>
                          </Link>

                          {/* Title + tech tags */}
                          <div className="px-4 pt-3 pb-3">
                            <Link href={`/project/${p.slug}`} className="group/title">
                              <h3 className="text-base font-black tracking-tight text-[var(--text-primary)] group-hover/title:text-[var(--coral)] transition-colors line-clamp-1">
                                {p.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {p.tech.map((t: string) => (
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
                                      handleShareTrack(p.slug);
                                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>💬 WhatsApp</span>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      handleShareTrack(p.slug);
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
                          <div className="px-4 py-2.5 text-[10px] bg-black/10 dark:bg-white/2 border-t border-[var(--border)]">
                            <div className="font-extrabold flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span>{likes[p.slug] || 0} Likes</span>
                                <span className="text-[var(--text-secondary)] font-normal">•</span>
                                <span>{shares[p.slug] || 0} Shares</span>
                              </div>
                              <div 
                                onClick={() => {
                                  setActiveCommentsSlug(p.slug);
                                  setActiveCommentsTitle(p.title);
                                }}
                                className="text-[9px] text-[var(--text-coral)] dark:text-[var(--text-secondary)] hover:text-[var(--coral)] font-bold cursor-pointer hover:underline"
                              >
                                View all {mounted ? (commentsMap[p.slug]?.length || 0) : 0} comments
                              </div>
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
                                      handleShareTrack(b.slug);
                                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                                      setActiveShareSlug(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold flex items-center gap-2"
                                  >
                                    <span>💬 WhatsApp</span>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      handleShareTrack(b.slug);
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
                              <span className="text-[var(--text-secondary)]">•</span>
                              <span>{shares[b.slug] || 0} Shares</span>
                            </div>
                            <div 
                              onClick={() => {
                                setActiveCommentsSlug(b.slug);
                                setActiveCommentsTitle(b.title);
                              }}
                              className="text-[9px] text-[var(--text-secondary)] font-bold cursor-pointer hover:underline"
                            >
                              View all {mounted ? (commentsMap[b.slug]?.length || 0) : 0} comments
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

          {/* ACTIVE FOUNDER'S INSIGHT PANEL */}
          {activeTab === "insight" && (
            <div className="max-w-xl mx-auto px-5 w-full animate-in fade-in duration-300 space-y-6 py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner relative animate-pulse">
                <Sparkles className="w-8 h-8 text-amber-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--coral)] animate-ping" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--coral)]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Founder's Insight</h3>
                <p className="text-xs uppercase tracking-widest text-[var(--coral)] font-bold font-mono">Coming Soon</p>
              </div>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                A dedicated space for developer insights, architectural breakdowns, and startup strategies. We are launching this very soon.
              </p>
              <button 
                onClick={() => changeTab("home")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-[var(--border)] text-[var(--text-primary)] hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
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

          {/* ACTIVE PRICING PANEL */}
          {(activeTab as string) === "pricing" && (
            <div className="max-w-4xl mx-auto px-5 w-full animate-in fade-in duration-200 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Developer Analytics Pricing</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
                  Simple, transparent plans for developers looking to integrate lightweight, privacy-focused tracking tools into their apps and websites.
                </p>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* Starter Plan */}
                <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[var(--coral)]/40 hover:shadow-lg">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">Starter</h4>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black text-[var(--text-primary)]">$28</span>
                        <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Perfect for hobby projects and individual developers needing basic tracking capabilities.
                    </p>
                    <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Up to 10k visits/mo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>1 active domain</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Core Web Vitals tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>24h data retention</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowHireModal(true)}
                    className="w-full mt-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[var(--text-primary)]"
                  >
                    Get Started
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-[var(--coral)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden shadow-md transition-all hover:shadow-xl">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 bg-[var(--coral)] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Popular
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--coral)]">Pro</h4>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black text-[var(--text-primary)]">$87</span>
                        <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Ideal for growing SaaS applications and professional developers who need deep analytics.
                    </p>
                    <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Up to 100k visits/mo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>5 active domains</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Custom event goals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>30-day data retention</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowHireModal(true)}
                    className="w-full mt-6 py-2.5 rounded-xl bg-[var(--coral)] text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-[var(--coral)]/10 transition-all"
                  >
                    Go Pro
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[var(--coral)]/40 hover:shadow-lg">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--text-secondary)]">Enterprise</h4>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black text-[var(--text-primary)]">$200</span>
                        <span className="text-xs text-[var(--text-secondary)]">/mo</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      For heavy workloads, agencies, and teams requiring full data ownership and dedicated support.
                    </p>
                    <ul className="text-xs space-y-2.5 text-[var(--text-primary)] font-medium pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Unlimited visits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>Unlimited domains</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>White-labeled analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--coral)]" />
                        <span>1-year data retention</span>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowHireModal(true)}
                    className="w-full mt-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-[var(--text-primary)]"
                  >
                    Contact Sales
                  </button>
                </div>

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
                  <X className="w-4.5 h-4.5" />
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

      {/* CV RESUME CONFIRMATION MODAL */}
      <CVModal isOpen={showCVModal} onClose={() => setShowCVModal(false)} />

    </div>
  );
}
