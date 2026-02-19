import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Plus, FileText, Globe, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";
import bgExplore from "@/assets/bg-explore.jpeg";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  likes: number;
  comments: number;
  category: string;
}

interface NewsItem {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

const ExplorePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"news" | "community">("news");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // GNews API Key from user
  const GNEWS_API_KEY = "6dfcaba24ec8d54cb23cd9f9f93977ae";

  // Fallback news in case API fails or limit is reached
  const mockNews: NewsItem[] = [
    {
      title: "İlginç detaylara sahip Infinix Note 60 Pro resmi olarak tanıtıldı",
      description: "İlginç detaylara sahip akıllı telefon modeli Infinix Note 60 Pro, bugün resmi olarak tanıtıldı. Cihaz Türkiye'de de satılabilir.",
      content: "...",
      url: "https://www.log.com.tr/ilginc-detaylara-sahip-infinix-note-60-pro-resmi-olarak-tanitildi/",
      image: "https://www.log.com.tr/wp-content/uploads/2026/02/2026-02-18_15-34-48_aK97v.jpg",
      publishedAt: "2026-02-18T22:31:10Z",
      source: { name: "Teknoloji haberleri - LOG", url: "https://www.log.com.tr" }
    },
    {
      title: "Baltık'ta Bayraktar TB3 şov! Ayakta alkışladı: NATO komutanı olarak minnettarım",
      description: "NATO'nun Almanya'nın kuzeyindeki Baltık Denizi'nde düzenlediği Steadfast Dart 2026 tatbikatında görev alan Bayraktar TB3...",
      content: "...",
      url: "https://www.milliyet.com.tr/gundem/baltikta-bayraktar-tb3-sov-ayakta-alkisladi-nato-komutani-olarak-minnettarim-7540769",
      image: "https://image.milimaj.com/i/milliyet/75/0x0/699626ed0d5f87cad270a60c.jpg",
      publishedAt: "2026-02-18T20:54:00Z",
      source: { name: "Milliyet", url: "https://www.milliyet.com.tr" }
    },
    {
      title: "Google, iPhone tanıtımından önce Pixel 10a'yı piyasaya sürdü",
      description: "Google, Pixel 10a'yı sınırlı donanım yenilikleri ve yapay zeka odaklı yazılım özellikleriyle, Apple'ın iPhone 17e tanıtımı öncesinde...",
      content: "...",
      url: "https://www.bloomberght.com/google-iphone-tanitimindan-once-pixel-10a-yi-piyasaya-surdu-3769511",
      image: "https://geoim.bloomberght.com/l/2026/02/18/ver1771434248/3769511/jpg/960x540",
      publishedAt: "2026-02-18T17:05:14Z",
      source: { name: "Bloomberght", url: "https://www.bloomberght.com" }
    }
  ];

  useEffect(() => {
    if (activeTab === "news") {
      checkAndFetchNews();
    }
  }, [activeTab]);

  const checkAndFetchNews = async () => {
    const cachedDate = localStorage.getItem("metsuke_news_date");
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if we have valid cache for TODAY
    if (cachedDate === today) {
        const cachedNews = localStorage.getItem("metsuke_news_cache");
        if (cachedNews) {
            try {
                const parsed = JSON.parse(cachedNews);
                if (parsed.length > 0) {
                    setNews(parsed);
                    return; // Use cache, don't fetch
                }
            } catch (e) {
                console.error("Cache parse error", e);
                localStorage.removeItem("metsuke_news_cache");
            }
        }
    }

    // If no cache or date changed, fetch new
    fetchNews(today);
  };

  const fetchNews = async (dateKey: string) => {
    if (isLoadingNews) return;
    
    setIsLoadingNews(true);
    try {
      // Requests 20 articles
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=technology&lang=tr&country=tr&max=20&apikey=${GNEWS_API_KEY}`
      );
      
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles);
        // Save to cache
        localStorage.setItem("metsuke_news_cache", JSON.stringify(data.articles));
        localStorage.setItem("metsuke_news_date", dateKey);
      } else {
        console.warn("GNews API returned no articles, using fallback.");
        setNews(mockNews);
        toast.error("Haberler API'den çekilemedi, önbellekteki haberler gösteriliyor.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setNews(mockNews);
      toast.error("Haberler yüklenemedi, kayıtlı haberler gösteriliyor.");
    } finally {
      setIsLoadingNews(false);
    }
  };

  const categories = [
    { id: "all", label: t('explore.categories.all') },
    { id: "philosophy", label: t('explore.categories.philosophy') },
    { id: "technology", label: t('explore.categories.technology') },
    { id: "art", label: t('explore.categories.art') },
    { id: "history", label: t('explore.categories.history') },
  ];

  const mockArticles: Article[] = [
    {
      id: "1",
      title: "Bushido: Savaşçının Yedi Erdemi",
      excerpt: "Samuray ahlak kurallarının modern yaşamdaki yansımaları ve uygulanabilirliği üzerine...",
      author: "Kenshi",
      likes: 24,
      comments: 5,
      category: "philosophy",
    },
    {
      id: "2",
      title: "Zen ve Yapay Zekâ",
      excerpt: "Meditasyon pratikleri ile makine öğrenmesi arasındaki şaşırtıcı paralellikler...",
      author: "Ronin",
      likes: 18,
      comments: 3,
      category: "technology",
    },
    {
      id: "3",
      title: "Katana Yapımının Sanatı",
      excerpt: "Geleneksel Japon kılıç yapımının incelikleri ve ustanın sabır dersleri...",
      author: "Takeshi",
      likes: 31,
      comments: 8,
      category: "art",
    },
  ];

  const filteredCommunity =
    selectedCategory === "all"
      ? mockArticles
      : mockArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      {/* Background - Dark Burgundy/Black Theme */}
      <div className="fixed inset-0 z-0 bg-[#1a0505]">
        <img src={bgExplore} alt="" className="h-full w-full object-cover opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 border-b border-border/20 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-white" />
          </button>
          <img src={logo} alt="" className="w-8 h-8" />
          <span className="font-serif font-semibold text-xl tracking-wide">
            Metsuke<span className="text-secondary">AI</span>
          </span>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-border/20">
            <button 
                onClick={() => setActiveTab("news")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "news" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "text-muted-foreground hover:text-white"}`}
            >
                <Globe className="w-3 h-3 inline-block mr-2" />
                Global Haberler
            </button>
            <button 
                onClick={() => setActiveTab("community")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "community" ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "text-muted-foreground hover:text-white"}`}
            >
                <FileText className="w-3 h-3 inline-block mr-2" />
                Topluluk
            </button>
        </div>

        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-secondary/90 hover:bg-secondary text-white rounded-lg text-sm font-medium border border-secondary/50 shadow-lg shadow-secondary/10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t('explore.share')}</span>
        </motion.button>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        
        {/* Content Section */}
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[60vh]"
        >
            {activeTab === "news" ? (
                // --- NEWS SECTION ---
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Global Teknoloji Bülteni
                        </h2>
                        <p className="text-muted-foreground mt-2">Dünyadan en güncel teknoloji ve yapay zeka haberleri</p>
                    </div>

                    {isLoadingNews ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/5 flex flex-col h-full"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={item.image || bgExplore} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = bgExplore;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <span className="text-xs font-semibold text-secondary bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-secondary/30">
                                                {item.source.name}
                                            </span>
                                            <span className="text-xs text-gray-300 font-mono">
                                                {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-3 font-light flex-grow">
                                            {item.description}
                                        </p>
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="mt-auto flex items-center gap-2 text-sm text-secondary font-medium hover:text-secondary/80 transition-colors group/link"
                                        >
                                            Haberi Oku <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // --- COMMUNITY SECTION ---
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                         <div>
                            <h2 className="text-2xl font-serif font-bold text-white">Topluluk Makaleleri</h2>
                            <p className="text-muted-foreground text-sm">Diğer kullanıcıların deneyimleri ve paylaşımları</p>
                         </div>

                        {/* Categories */}
                        <div className="flex gap-2 bg-black/20 p-1 rounded-lg overflow-x-auto max-w-full">
                            {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                                selectedCategory === cat.id
                                    ? "bg-white/10 text-white border border-white/20 shadow-sm"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {cat.label}
                            </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCommunity.map((article, i) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="bg-card/30 backdrop-blur-md border border-white/5 rounded-xl p-5 hover:bg-card/50 transition-all cursor-pointer group border-l-2 border-l-transparent hover:border-l-secondary"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-full bg-secondary/10">
                                    <FileText className="w-3 h-3 text-secondary" />
                                </div>
                                <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                                    {t(`explore.categories.${article.category}`) || article.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-light">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-3">
                            <span className="text-white/60">@{article.author}</span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
                                <Heart className="w-3 h-3" />
                                {article.likes}
                                </span>
                                <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                <MessageCircle className="w-3 h-3" />
                                {article.comments}
                                </span>
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
      </main>
    </div>
  );
};
export default ExplorePage;
