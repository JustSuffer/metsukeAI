import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Crown, Shield, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import bgSettings from "@/assets/bg-settings.jpeg";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={bgSettings} alt="" className="h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 p-4 border-b border-border/50">
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
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Ayarlar
          </h1>

          {/* Profile Section */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <User className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">Profil</h2>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold font-serif">
                K
              </div>
              <div>
                <p className="text-foreground font-semibold">Kenshi</p>
                <p className="text-sm text-muted-foreground">kenshi@metsuke.ai</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  defaultValue="Kenshi"
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Biyografi
                </label>
                <textarea
                  defaultValue="Dijital dojo'nun savaşçısı"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </section>

          {/* Membership */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Crown className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">Üyelik</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-foreground font-semibold">Ücretsiz Plan</p>
                <p className="text-sm text-muted-foreground">
                  Temel özellikler
                </p>
              </div>
              <motion.button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Yükselt
              </motion.button>
            </div>
          </section>

          {/* Security */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Shield className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">
                Hesap
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                Şifre Değiştir
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm text-destructive flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
