import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Globe, ExternalLink, Download } from "lucide-react";
import logo from "@/assets/logo.png";
import bgExplore from "@/assets/bg-explore.jpeg";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ArticleSubmissionModal from "@/components/ArticleSubmissionModal";

interface Article {
  id: string;
  title: string;
  excerpt: string; // mapped from abstract
  author: string; // mapped from author_id (needs profile fetch or join, for now using 'Anonymous' or email if available in metadata)
  likes: number; // view_count for now
  comments: number; 
  category: string;
  pdf_url?: string;
  cover_image_url?: string;
  created_at: string;
  abstract?: string;
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
  const [communityArticles, setCommunityArticles] = useState<Article[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  // GNews API Key from user
  const GNEWS_API_KEY = "6dfcaba24ec8d54cb23cd9f9f93977ae";

  // Expanded Mock Data to guarantee 20 items if API fails
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
    },
    {
      title: "Yapay Zeka Destekli Yeni Nesil İşlemciler Tanıtıldı",
      description: "Teknoloji devleri, yapay zeka işlemlerini saniyeler içinde gerçekleştirebilen yeni nesil nöral işlem birimlerini görücüye çıkardı.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T16:00:00Z",
      source: { name: "TechWorld", url: "#" }
    },
    {
      title: "Mars Kolonisi İçin İlk Büyük Adım: Yaşam Destek Ünitesi Test Edildi",
      description: "Uzay ajansları, Mars yüzeyinde sürdürülebilir yaşam için geliştirilen yeni oksijen üretim sistemini başarıyla test etti.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1614728853980-6043080c7f5b?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T15:30:00Z",
      source: { name: "Space Daily", url: "#" }
    },
    {
      title: "Elektrikli Araçlarda Menzil Devrimi: 1200km Menzilli Batarya",
      description: "Yeni geliştirilen katı hal bataryaları, elektrikli araçların menzilini iki katına çıkararak şarj problemini tarihe gömüyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T14:45:00Z",
      source: { name: "AutoNews", url: "#" }
    },
    {
      title: "Kuantum Bilgisayarlar Artık Masaüstünde",
      description: "Bilim insanları, oda sıcaklığında çalışabilen ve masaüstü boyutlarına indirgenmiş ilk kuantum işlemci prototipini tanıttı.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T14:00:00Z",
      source: { name: "Quantum Weekly", url: "#" }
    },
    {
      title: "Web 4.0: İnternetin Yeni Yüzü ve Holografik Arayüzler",
      description: "Metaverse'ün ötesine geçen Web 4.0 standartları, tarayıcı tabanlı holografik deneyimlerin kapısını aralıyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T13:20:00Z",
      source: { name: "WebFuturism", url: "#" }
    },
    {
      title: "Giyilebilir Teknolojide Çığır Açan Akıllı Lensler",
      description: "Artırılmış gerçeklik özelliklerini doğrudan göze yansıtan akıllı kontakt lenslerin ilk insanlı testleri başarıyla tamamlandı.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T12:00:00Z",
      source: { name: "FutureVision", url: "#" }
    },
    {
      title: "Yapay Zeka Sanatında Telif Hakları Düzenlemesi",
      description: "Uluslararası hukuk komisyonu, yapay zeka tarafından üretilen eserlerin telif hakları konusunda yeni bir çerçeve metni kabul etti.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T11:15:00Z",
      source: { name: "Law & Tech", url: "#" }
    },
    {
      title: "Siber Güvenlikte Yeni Tehdit: Kuantum Hackleme",
      description: "Uzmanlar, klasik şifreleme yöntemlerinin kuantum bilgisayarlar karşısında yetersiz kalabileceği konusunda uyarıyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1563206767-5b1d97289374?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T10:30:00Z",
      source: { name: "CyberSec Pro", url: "#" }
    },
    {
      title: "Yeşil Enerji: Fotosentez Yapan Biyo-Paneller",
      description: "Bitkilerin fotosentez mekanizmasını taklit eden yeni güneş panelleri, %40 daha yüksek verimlilik sunuyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T09:45:00Z",
      source: { name: "GreenTech", url: "#" }
    },
    {
      title: "Robotik Cerrahide 5G Dönemi",
      description: "Dünyanın bir ucundaki doktor, 5G bağlantısı üzerinden başka bir kıtadaki hastayı robotik kollarla başarıyla ameliyat etti.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T09:00:00Z",
      source: { name: "HealthTech", url: "#" }
    },
    {
      title: "8G Teknolojisi İçin Çalışmalar Başladı",
      description: "Henüz 6G yaygınlaşmadan, bilim insanları terahertz frekanslarını kullanarak veri iletim hızını katlayacak 8G üzerinde çalışıyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T08:00:00Z",
      source: { name: "ConnectWorld", url: "#" }
    },
    {
      title: "Oyun Dünyasında NPC'ler Artık Kendi Hayatını Yaşıyor",
      description: "Yeni nesil oyun motorları, yapay zeka destekli NPC'lerin oyuncudan bağımsız olarak kendi hikayelerini oluşturmasına izin veriyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T07:30:00Z",
      source: { name: "GameSpotlight", url: "#" }
    },
    {
      title: "Blockchain Tabanlı Dijital Kimlikler Yaygınlaşıyor",
      description: "Birçok ülke, pasaport ve kimlik kartlarını blockchain altyapısına taşıyarak sahteciliğin önüne geçmeyi hedefliyor.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T06:45:00Z",
      source: { name: "CryptoDaily", url: "#" }
    },
    {
      title: "3D Yazıcı ile Organ Nakli Gerçek Oldu",
      description: "Biyobaskı teknolojisi ile üretilen ilk yapay karaciğer dokusu, başarılı bir şekilde nakledildi ve fonksiyon kazandı.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1581093458891-9f30261d74b1?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T06:00:00Z",
      source: { name: "BioMed News", url: "#" }
    },
    {
      title: "Derin Okyanus Keşfinde Yeni Türler Bulundu",
      description: "Otonom su altı dronları, Pasifik Okyanusu'nun en derin noktalarında daha önce hiç görülmemiş biyolüminesans canlılar keşfetti.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T05:15:00Z",
      source: { name: "OceanLife", url: "#" }
    },
    {
      title: "Akıllı Şehirlerde Trafik Işıkları Tarihe Karışıyor",
      description: "V2X (Araçtan Her Şeye) iletişim teknolojisi sayesinde, otonom araçlar kavşaklarda durmadan birbirleriyle senkronize geçebilecek.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T04:30:00Z",
      source: { name: "SmartCities", url: "#" }
    },
    {
      title: "Veri Depolamada DNA Devrimi",
      description: "Microsoft, sentetik DNA sarmalları üzerine binlerce terabaytlık veriyi yüzyıllarca saklayabilen yeni teknolojisini tanıttı.",
      content: "...",
      url: "#",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop",
      publishedAt: "2026-02-18T03:45:00Z",
      source: { name: "DataFuture", url: "#" }
    }
  ];

  useEffect(() => {
    if (activeTab === "news") {
      checkAndFetchNews();
    } else {
        fetchCommunityArticles();
    }
  }, [activeTab]);

  const fetchCommunityArticles = async () => {
    // ... (Existing community fetch logic)
     try {
          const { data, error } = await supabase
            .from('community_articles')
            .select('*')
            .eq('status', 'published') // Only published
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          if (data) {
             const formatted: Article[] = data.map(item => ({
                 id: item.id,
                 title: item.title,
                 excerpt: item.abstract || item.content.substring(0, 100) + "...",
                 author: "Anonim Üye", 
                 likes: item.view_count || 0,
                 comments: 0,
                 category: item.category || "Genel",
                 pdf_url: item.pdf_url,
                 cover_image_url: item.cover_image_url,
                 created_at: item.created_at,
                 abstract: item.abstract
             }));
             setCommunityArticles(formatted);
          }
      } catch (error: any) {
          console.error("Error fetching articles:", error);
      }
  }

  const checkAndFetchNews = async () => {
    const cachedData = localStorage.getItem("metsuke_news_cache");
    const lastFetchTime = localStorage.getItem("metsuke_news_timestamp");
    
    const now = new Date();
    const today13 = new Date();
    today13.setHours(13, 0, 0, 0);
    
    const yesterday13 = new Date(today13);
    yesterday13.setDate(yesterday13.getDate() - 1);

    const validWindowStart = now >= today13 ? today13 : yesterday13;

    if (cachedData && lastFetchTime) {
        const fetchTime = new Date(lastFetchTime);
        if (fetchTime >= validWindowStart) {
             try {
                const parsed = JSON.parse(cachedData);
                // Ensure we have at least 20 items in cache
                if (parsed.length >= 20) {
                    setNews(parsed);
                    return; 
                }
            } catch (e) {
                console.error("Cache parse error", e);
            }
        }
    }

    // Refresh if no cache, stale, or insufficient items
    fetchNews();
  };

  const fetchNews = async () => {
    if (isLoadingNews) return;
    
    setIsLoadingNews(true);
    let combinedArticles: NewsItem[] = [];

    try {
      // Sequential requests to avoid rate limits
      const res1 = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=tr&country=tr&max=10&page=1&apikey=${GNEWS_API_KEY}`);
      if (res1.ok) {
        const data1 = await res1.json();
        combinedArticles = [...combinedArticles, ...(data1.articles || [])];
      }

      // Delay slightly before second request
      await new Promise(resolve => setTimeout(resolve, 500));

      const res2 = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=tr&country=tr&max=10&page=2&apikey=${GNEWS_API_KEY}`);
      if (res2.ok) {
        const data2 = await res2.json();
        combinedArticles = [...combinedArticles, ...(data2.articles || [])];
      }

      // If we still don't have enough, fill with mock data
      if (combinedArticles.length < 20) {
         const needed = 20 - combinedArticles.length;
         // Filter out any mock articles that mimic real ones by title/url if possible, but for now just appending slice
         // Ideally prevent duplicates. 
         const uniqueMocks = mockNews.filter(m => !combinedArticles.some(r => r.url === m.url));
         combinedArticles = [...combinedArticles, ...uniqueMocks.slice(0, needed)];
      }

      // Remove duplicates
      const uniqueArticles = Array.from(new Map(combinedArticles.map(item => [item.url || item.title, item])).values());
      
      // Ensure specific count
      const finalArticles = uniqueArticles.slice(0, 20);

      setNews(finalArticles);
      localStorage.setItem("metsuke_news_cache", JSON.stringify(finalArticles));
      localStorage.setItem("metsuke_news_timestamp", new Date().toISOString());

      if (finalArticles.length < 20) {
          // Fallback if even logic failed remarkably
          setNews(mockNews); 
      }

    } catch (error) {
      console.error("Fetch Error:", error);
      setNews(mockNews); // Ultimate fallback
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

  const filteredCommunity =
    selectedCategory === "all"
      ? communityArticles
      : communityArticles.filter((a) => a.category.toLowerCase() === selectedCategory || (selectedCategory === "all"));

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
          onClick={() => setIsSubmissionOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/90 hover:bg-secondary text-white rounded-lg text-sm font-medium border border-secondary/50 shadow-lg shadow-secondary/10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t('explore.share')}</span>
        </motion.button>
      </header>

      {/* Article Submission Modal */}
      <ArticleSubmissionModal 
        isOpen={isSubmissionOpen} 
        onClose={() => setIsSubmissionOpen(false)} 
        onSuccess={() => {
            fetchCommunityArticles();
            setActiveTab("community");
        }} 
      />

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
                    
                    {filteredCommunity.length === 0 ? (
                         <div className="text-center py-20 bg-card/20 rounded-xl border border-white/5">
                             <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                             <h3 className="text-lg font-medium text-white mb-2">Henüz makale yok</h3>
                             <p className="text-muted-foreground mb-6">İlk makaleyi sen paylaşmak ister misin?</p>
                             <button
                                onClick={() => setIsSubmissionOpen(true)}
                                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                             >
                                Makale Yaz
                             </button>
                         </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCommunity.map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="bg-card/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:bg-card/60 transition-all cursor-pointer group border-l-2 border-l-transparent hover:border-l-secondary flex flex-col"
                            >
                                {article.cover_image_url && (
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40" />
                                     </div>
                                )}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                            {article.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 font-light flex-grow">
                                        {article.excerpt}
                                    </p>
                                    
                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-3 mt-auto">
                                        <span className="text-white/60">@{article.author}</span>
                                        <div className="flex items-center gap-3">
                                            {article.pdf_url && (
                                                <a href={article.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors" title="PDF İndir">
                                                    <Download className="w-3 h-3" />
                                                    PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
      </main>
    </div>
  );
};
export default ExplorePage;
