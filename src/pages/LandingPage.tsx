import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import bgLanding from "@/assets/bg-landing.jpeg";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const features = [
    {
      title: t('landing.features.chat.title'),
      subtitle: t('landing.features.chat.subtitle'),
      description: t('landing.features.chat.desc'),
    },
    {
      title: t('landing.features.community.title'),
      subtitle: t('landing.features.community.subtitle'),
      description: t('landing.features.community.desc'),
    },
    {
      title: t('landing.features.image.title'),
      subtitle: t('landing.features.image.subtitle'),
      description: t('landing.features.image.desc'),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.85]);

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={bgLanding}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Logo + Title — no pointer events on decorations */}
        <div className="relative z-20 flex flex-col items-center gap-6">
          <motion.img
            src={logo}
            alt="MetsukeAI Logo"
            className="w-32 h-32 md:w-44 md:h-44 drop-shadow-2xl"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold tracking-wider text-foreground"
            initial={{ opacity: 0, y: 30, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('landing.hero.title')}<span className="text-secondary">AI</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-md text-center font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.button
            onClick={() => navigate("/auth")}
            className="mt-8 px-10 py-4 bg-primary text-primary-foreground font-serif text-lg tracking-widest rounded-sm border-2 border-secondary/50 hover:border-secondary hover:bg-primary/90 transition-all duration-500 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">{t('landing.hero.cta')}</span>
            <div className="absolute inset-0 bg-secondary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase font-light">
            {t('landing.hero.scroll')}
          </span>
          <motion.div
            className="w-px h-8 bg-secondary/50"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.section>

      {/* Spacer for hero */}
      <div className="h-screen" />

      {/* ===== FEATURE SECTIONS ===== */}
      {features.map((feature, i) => (
        <section
          key={i}
          className="relative z-20 min-h-screen flex items-center justify-center px-6 bg-background"
        >
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="text-sm tracking-[0.4em] uppercase text-secondary font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {feature.subtitle}
            </motion.span>

            <motion.h2
              className="mt-4 text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {feature.title}
            </motion.h2>

            <div className="mx-auto mt-6 w-24 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />

            <motion.p
              className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {feature.description}
            </motion.p>
          </motion.div>
        </section>
      ))}

      {/* ===== FOOTER CTA ===== */}
      <section className="relative z-20 min-h-[60vh] flex items-center justify-center px-6 pb-20 bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            {t('landing.footer.ready')}
          </h2>
          <div className="mx-auto mt-4 w-16 h-px bg-secondary/60" />
          <p className="mt-6 text-muted-foreground text-lg font-light">
            {t('landing.footer.desc')}
          </p>
          <motion.button
            onClick={() => navigate("/auth")}
            className="mt-10 px-12 py-4 bg-primary text-primary-foreground font-serif text-lg tracking-widest rounded-sm border-2 border-secondary/50 hover:border-secondary transition-all duration-500"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('landing.footer.start')}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
