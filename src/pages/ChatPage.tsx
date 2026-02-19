import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Settings,
  Send,
  Menu,
  X,
  MessageSquare,
  LogOut,
  User,
  FileUp,
  Globe,
  ShoppingBag,
  BookOpen,
  Search as SearchIcon
} from "lucide-react";
import logo from "@/assets/logo.png";
import bgChat from "@/assets/bg-chat.jpeg";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInputMenu, setShowInputMenu] = useState(false);
  const inputMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUser();
    fetchChats();
    
    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
        if (inputMenuRef.current && !inputMenuRef.current.contains(event.target as Node)) {
            setShowInputMenu(false);
        }
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setShowProfileMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
        setFilteredChats(chats);
    } else {
        const lowerQ = searchQuery.toLowerCase();
        setFilteredChats(chats.filter(c => c.title.toLowerCase().includes(lowerQ)));
    }
  }, [searchQuery, chats]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
    }
  };

  const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (data) {
          setChats(data);
          setFilteredChats(data);
      }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sana nasıl yardımcı olabilirim?", 
        },
      ]);
      // Ideally here we would also save the chat to DB if it's new, or update existing
    }, 1000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-screen flex overflow-hidden relative font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={bgChat} alt="" className="h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[280px] flex-shrink-0 bg-sidebar-background/95 backdrop-blur-md border-r border-border flex flex-col h-full"
          >
            {/* Sidebar Header */}
            <div className="p-3 flex items-center justify-between">
               <div className="flex items-center gap-2 px-2">
                 {/* Optional small logo or just space */}
               </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 mb-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder={t('chat.search') || "Sohbetleri ara..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            {/* Bilgelik Tomarları (Explore Our Journey) */}
            <div className="px-3 py-2">
                <button
                    onClick={() => navigate("/explore")}
                    className="w-full relative overflow-hidden group rounded-lg border border-red-900/30"
                >
                    <div className="absolute inset-0 bg-[#2a0a0a] transition-colors group-hover:bg-[#3d0f0f]" />
                    {/* Texture overlay effect */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay" />
                    
                    <div className="relative z-10 flex items-center gap-3 px-3 py-3">
                         <div className="w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center text-red-200 shadow-inner border border-red-800/50">
                             <Globe className="w-3 h-3" />
                         </div>
                         <span className="text-sm font-serif font-semibold text-red-100/90 tracking-wide group-hover:text-white transition-colors">
                            Explore Our Journey
                         </span>
                    </div>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
              <p className="text-xs text-muted-foreground tracking-widest uppercase px-3 mb-2 mt-2 font-medium">
                SOHBETLER
              </p>
              <div className="space-y-1">
                {filteredChats.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center italic opacity-70">
                        {searchQuery ? "Sonuç bulunamadı." : "Henüz sohbet yok."}
                    </div>
                ) : (
                    filteredChats.map((c) => (
                        <button
                        key={c.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground text-left group"
                        >
                        <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="truncate opacity-90 group-hover:opacity-100">{c.title || "Yeni Sohbet"}</span>
                        </button>
                    ))
                )}
              </div>
            </div>

            {/* Bottom Section: Settings & Profile */}
            <div className="p-3 mt-auto space-y-1 bg-black/20 backdrop-blur-sm border-t border-white/5">
                {/* Settings Link */}
                <button
                    onClick={() => navigate("/settings")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                    <Settings className="w-4 h-4" />
                    <span>{t('chat.settings')}</span>
                </button>

                {/* Profile User */}
                <div className="relative" ref={profileMenuRef}>
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/20 transition-all overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "K"
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "Kenshi"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </button>

                    {/* Profile Popover */}
                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute bottom-full left-0 w-full mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                            >
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Çıkış Yap</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b border-border/50 bg-background/50 backdrop-blur-sm">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <img src={logo} alt="MetsukeAI" className="w-8 h-8" />
          <span className="text-sm font-serif font-semibold text-foreground">
            Metsuke<span className="text-secondary">AI</span>
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                 <img src={logo} alt="" className="w-20 h-20 opacity-90 relative z-10 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground text-center">
                Merhaba {profile?.full_name?.split(' ')[0] || "Kenshi"}. <br/>
                <span className="text-muted-foreground text-lg md:text-xl font-normal mt-2 block">Dalmaya hazır mısın?</span>
              </h2>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground rounded-tr-none"
                        : "bg-card/80 border border-white/10 text-foreground rounded-tl-none backdrop-blur-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pb-6">
          <div className="max-w-3xl mx-auto relative group">
            <div className="flex items-end gap-2 bg-[#0a0a0a] border border-white/10 rounded-2xl px-2 py-2 shadow-xl ring-1 ring-white/5 focus-within:ring-primary/30 transition-all">
              
              {/* Plus Menu Button */}
              <div className="relative" ref={inputMenuRef}>
                  <button 
                    onClick={() => setShowInputMenu(!showInputMenu)}
                    className={`p-2 rounded-xl transition-all ${showInputMenu ? 'bg-primary text-white rotate-45' : 'text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showInputMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full left-0 mb-3 w-64 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 z-50 flex flex-col gap-1"
                        >
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left group">
                                <FileUp className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                Fotoğraf ve dosya ekle
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left group">
                                <SearchIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                Derin araştırma
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left group">
                                <ShoppingBag className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                                Alışveriş araştırması
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left group">
                                <Globe className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                Web'de arama
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors text-left group">
                                <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                Çalış ve öğren
                            </button>
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Herhangi bir şey sor"
                rows={1}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none text-sm min-h-[44px] max-h-[120px] py-3 px-2"
              />
              
              <motion.button
                onClick={handleSend}
                className={`p-2.5 rounded-xl transition-all duration-300 ${input.trim() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="absolute right-0 -bottom-5 text-[10px] text-gray-600 font-medium">
                 MetsukeAI v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
