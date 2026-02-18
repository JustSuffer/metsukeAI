import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { lovable } from "../integrations/lovable";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import bgAuth from "@/assets/bg-auth.jpeg";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Google giriş hatası: " + error.message);
  };

  const handleAppleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Apple giriş hatası: " + error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/chat");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Doğrulama e-postası gönderildi. Lütfen e-postanızı kontrol edin.");
      }
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgAuth} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Auth Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Close */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground transition-colors text-2xl"
        >
          ✕
        </button>

        {/* Logo */}
        <motion.img
          src={logo}
          alt="MetsukeAI"
          className="w-20 h-20 mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          {isLogin ? "Oturum aç veya kaydol" : "Hesap oluştur"}
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8 max-w-xs">
          Daha zeki yanıtlar alabilir, dosya ve görsel yükleyebilir ve çok daha
          fazlasını yapabilirsin.
        </p>

        {/* Social Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button onClick={handleGoogleSignIn} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium">Google ile devam et</span>
          </button>

          <button onClick={handleAppleSignIn} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-foreground">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-sm font-medium">Apple ile devam et</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Ya da
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="E-posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? "Yükleniyor..." : isLogin ? "Giriş Yap" : "Kaydol"}
          </motion.button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-xs text-muted-foreground hover:text-secondary transition-colors"
        >
          {isLogin
            ? "Hesabın yok mu? Kaydol"
            : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </motion.div>
    </div>
  );
};

export default AuthPage;
