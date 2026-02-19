import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Crown, Shield, LogOut, Globe } from "lucide-react";
import logo from "@/assets/logo.png";
import bgSettings from "@/assets/bg-settings.jpeg";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    bio: "",
    avatar_url: null,
    subscription_tier: "free"
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
            full_name: data.full_name || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url,
            subscription_tier: data.subscription_tier || "free"
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      // toast.error("Profil bilgileri yüklenemedi."); // Toast removed as per prefs, or re-add if needed? User asked to remove *news* toasts. I'll keep generic errors minimal or log them.
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        full_name: profile.full_name,
        bio: profile.bio,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      // toast.success("Profil güncellendi!"); 
      alert("Profil başarıyla güncellendi!"); // Simple feedback
    } catch (error: any) {
        console.error("Error updating profile:", error);
        alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile((prev: any) => ({ ...prev, avatar_url: data.publicUrl }));
      
      // Auto save after upload
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
          await supabase.from('profiles').upsert({
              id: user.id,
              avatar_url: data.publicUrl
          });
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
      await supabase.auth.signOut();
      navigate("/");
  };

  const handlePasswordReset = async () => {
      if (!user?.email) return;
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
          redirectTo: window.location.origin + '/settings',
      });
      if (error) alert("Hata: " + error.message);
      else alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (loading && !profile.full_name) {
      return <div className="min-h-screen flex items-center justify-center bg-background text-white">Yükleniyor...</div>;
  }

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
            {t('settings.title')}
          </h1>

          {/* Language Selection */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Globe className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">{t('settings.language')}</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
               <button onClick={() => changeLanguage('tr')} className={`px-4 py-2 rounded-lg text-sm border ${i18n.language === 'tr' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-secondary'}`}>Türkçe</button>
               <button onClick={() => changeLanguage('en')} className={`px-4 py-2 rounded-lg text-sm border ${i18n.language === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-secondary'}`}>English</button>
               <button onClick={() => changeLanguage('de')} className={`px-4 py-2 rounded-lg text-sm border ${i18n.language === 'de' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-secondary'}`}>Deutsch</button>
               <button onClick={() => changeLanguage('es')} className={`px-4 py-2 rounded-lg text-sm border ${i18n.language === 'es' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-secondary'}`}>Español</button>
               <button onClick={() => changeLanguage('ja')} className={`px-4 py-2 rounded-lg text-sm border ${i18n.language === 'ja' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-secondary'}`}>日本語</button>
            </div>
          </section>

          {/* Profile Section */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <User className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">{t('settings.profile')}</h2>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold font-serif overflow-hidden">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        profile.full_name ? profile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase())
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-secondary text-black rounded-full p-1 cursor-pointer hover:bg-white transition-colors">
                      <User className="w-3 h-3" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                  />
              </div>
              
              <div>
                <p className="text-foreground font-semibold">{profile.full_name || "İsimsiz Kullanıcı"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {t('settings.name')}
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {t('settings.bio')}
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Kendinizden bahsedin..."
                />
              </div>
              <div className="flex justify-end">
                  <button 
                    onClick={updateProfile}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                      Kaydet
                  </button>
              </div>
            </div>
          </section>

          {/* Membership */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Crown className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">{t('settings.membership')}</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-foreground font-semibold capitalize">{profile.subscription_tier} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {t('settings.basicFeatures')}
                </p>
              </div>
              <motion.button
                onClick={() => navigate('/plan')}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('settings.upgrade')}
              </motion.button>
            </div>
          </section>

          {/* Security */}
          <section className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Shield className="w-5 h-5" />
              <h2 className="font-serif font-semibold text-foreground">
                {t('settings.account')}
              </h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handlePasswordReset}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm text-foreground"
              >
                {t('settings.changePassword')}
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm text-destructive flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('settings.logout')}
              </button>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
