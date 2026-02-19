import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown } from "lucide-react";
import logo from "@/assets/logo.png";
import bgSettings from "@/assets/bg-settings.jpeg"; // Reuse settings background

const plans = [
    {
        name: "Starter",
        price: "Ücretsiz",
        features: ["Temel yapay zeka sohbeti", "Günlük 20 haber erişimi", "Topluluk makalelerini okuma"],
        color: "border-gray-600",
        buttonColor: "bg-gray-700 hover:bg-gray-600",
        recommended: false
    },
    {
        name: "Pro",
        price: "₺199/ay",
        features: ["Sınırsız sohbet", "Reklamsız deneyim", "Özel profil rozeti", "Erken erişim özellikleri", "Gelişmiş makale araçları"],
        color: "border-primary",
        buttonColor: "bg-primary hover:bg-primary/90",
        recommended: true
    },
    {
        name: "Enterprise",
        price: "₺999/ay",
        features: ["Özel API erişimi", "Öncelikli destek", "Kurumsal panel", "Ekip yönetimi", "Özel eğitim modelleri"],
        color: "border-amber-600",
        buttonColor: "bg-amber-700 hover:bg-amber-600", // Goldish/Amber for enterprise
        recommended: false
    }
];

const PlanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={bgSettings} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
             <button
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <img src={logo} alt="" className="w-10 h-10" />
            <span className="font-serif font-bold text-xl text-foreground">
            Metsuke<span className="text-secondary">AI</span>
            </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Potansiyelini <span className="text-primary">Yükselt</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
                Yapay zeka deneyiminizi bir üst seviyeye taşıyın. İhtiyacınıza en uygun planı seçin ve hemen başlayın.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`relative bg-[#120505] backdrop-blur-md border-2 ${plan.color} rounded-2xl p-8 flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all transform hover:-translate-y-1`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <Crown className="w-3 h-3" /> ÖNERİLEN
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-200 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">{plan.price}</span>
                                {plan.price !== "Ücretsiz" && <span className="text-sm text-gray-500"></span>}
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-secondary" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => alert("Ödeme sistemi yakında aktif olacak!")}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${plan.buttonColor}`}
                        >
                            {plan.name === "Starter" ? "Mevcut Plan" : "Satın Al"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PlanPage;
