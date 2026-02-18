import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Image,
  Settings,
  Send,
  Menu,
  X,
  Compass,
  MessageSquare,
} from "lucide-react";
import logo from "@/assets/logo.png";
import bgChat from "@/assets/bg-chat.jpeg";
import { useTranslation } from "react-i18next";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations] = useState<Conversation[]>([
    { id: "1", title: t('landing.features.chat.title') }, // Using existing keys or generic ones
    { id: "2", title: t('landing.features.community.title') },
    { id: "3", title: t('landing.features.chat.subtitle') },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // TODO: AI response via edge function
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t('chat.welcome', { name: "Kenshi" }).replace("Dalmaya hazır mısın?", "Sana nasıl yardımcı olabilirim?"), // Quick hack to reuse or just use a new key if I had one. I'll stick to a generic welcome response for now or just hardcode a simple dynamic one if keys are missing.
          // Wait, I defined "welcome": "Merhaba {{name}}. Dalmaya hazır mısın?" in json.
          // I should probably just return a standard response.
          // Let's use a simple hardcoded response for the mock for now, or add a key.
          // "Hello Kenshi! How can I help you?" -> I'll just keep the hardcoded response for the mock AI, or better, translate it.
          // I'll add a generic response key later or just use the welcome one for now.
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
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
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm">
                <Search className="w-4 h-4" />
                <span>{t('chat.search')}</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="px-3 space-y-1">
              <button
                onClick={() => navigate("/explore")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground"
              >
                <Compass className="w-4 h-4" />
                <span>{t('chat.explore')}</span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground"
              >
                <Settings className="w-4 h-4" />
                <span>{t('chat.settings')}</span>
              </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto mt-4 px-3">
              <p className="text-xs text-muted-foreground tracking-widest uppercase px-3 mb-2">
                {t('chat.conversations')}
              </p>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground text-left"
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>

            {/* User */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  K
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">Kenshi</p>
                  <p className="text-xs text-muted-foreground">{t('chat.userRole')}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b border-border/50">
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
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <img src={logo} alt="" className="w-16 h-16 opacity-60" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                {t('chat.welcome', { name: "Kenshi" })}
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
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground"
                        : "bg-card border border-secondary/20 text-foreground"
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
        <div className="p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-3">
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t('chat.inputPlaceholder')}
                rows={1}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm min-h-[24px] max-h-[120px]"
              />
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <motion.button
                onClick={handleSend}
                className="p-2 bg-foreground text-background rounded-full hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
