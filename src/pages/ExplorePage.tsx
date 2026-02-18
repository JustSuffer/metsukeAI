import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Plus, FileText } from "lucide-react";
import logo from "@/assets/logo.png";
import bgExplore from "@/assets/bg-explore.jpeg";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  likes: number;
  comments: number;
  category: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Bushido: Savaşçının Yedi Erdemi",
    excerpt: "Samuray ahlak kurallarının modern yaşamdaki yansımaları ve uygulanabilirliği üzerine...",
    author: "Kenshi",
    likes: 24,
    comments: 5,
    category: "Felsefe",
  },
  {
    id: "2",
    title: "Zen ve Yapay Zekâ",
    excerpt: "Meditasyon pratikleri ile makine öğrenmesi arasındaki şaşırtıcı paralellikler...",
    author: "Ronin",
    likes: 18,
    comments: 3,
    category: "Teknoloji",
  },
  {
    id: "3",
    title: "Katana Yapımının Sanatı",
    excerpt: "Geleneksel Japon kılıç yapımının incelikleri ve ustanın sabır dersleri...",
    author: "Takeshi",
    likes: 31,
    comments: 8,
    category: "Sanat",
  },
];

const categories = ["Tümü", "Felsefe", "Teknoloji", "Sanat", "Tarih"];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const filtered =
    selectedCategory === "Tümü"
      ? mockArticles
      : mockArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={bgExplore} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <img src={logo} alt="" className="w-8 h-8" />
          <span className="font-serif font-semibold text-foreground">
            Metsuke<span className="text-secondary">AI</span>
          </span>
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Yazı Paylaş
        </motion.button>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Bilgelik Tomarları
          </h1>
          <p className="text-muted-foreground mb-8">
            Topluluktan bilgelik paylaşımları
          </p>

          {/* Categories */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 gold-glow cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{article.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {article.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {article.comments}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExplorePage;
