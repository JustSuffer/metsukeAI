import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto px-6 py-24"
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <div className="bg-dark text-white min-h-screen font-sans selection:bg-bordo selection:text-white">
            {/* Hero Section */}
            <section ref={targetRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/assets/bg-chat.jpg" alt="Background" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-dark" />
                </div>

                <motion.div 
                    style={{ opacity, scale, y }}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <motion.div
                        className="relative mb-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                         <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
                         <img 
                            src="/assets/logo.png" 
                            alt="MetsukeAI Logo" 
                            className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] relative z-10"
                        />
                    </motion.div>

                    <motion.h1 
                        className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-6"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                    >
                        METSUKE AI
                    </motion.h1>

                    <motion.p 
                        className="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase max-w-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                    >
                        The Eye of Intelligence
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="absolute bottom-10 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
                </motion.div>
            </section>

            {/* Content Sections */}
            <section className="relative z-10 bg-dark">
                <FadeInSection>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Precision & <span className="text-bordo">Power</span>.</h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Provide unwavering attention to detail with our AI-powered vision. 
                                MetsukeAI combines ancient wisdom with cutting-edge technology to analyze, interpret, and assist specifically for your needs.
                            </p>
                        </div>
                        <div className="flex-1 h-64 md:h-96 bg-gray-900 rounded-2xl overflow-hidden border border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-bordo/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                             {/* Placeholder for feature image */}
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif text-9xl">侍</div>
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Seamless <span className="text-gold">Structure</span>.</h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Experience a flow state like no other. Our interface is designed to disappear, leaving only you and your objective. 
                                Minimalist, efficient, and aesthetically superior.
                            </p>
                        </div>
                        <div className="flex-1 h-64 md:h-96 bg-gray-900 rounded-2xl overflow-hidden border border-white/5 relative group">
                             <div className="absolute inset-0 bg-gradient-to-bl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Placeholder for feature image */}
                            <div className="absolute inset-0 flex items-center justify-center text-bordo/20 font-serif text-9xl">禅</div>
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                     <div className="text-center py-20">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">Ready to Ascend?</h2>
                        <button
                            onClick={() => navigate('/auth')}
                            className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white/10 focus:outline-none"
                        >
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                            <span className="relative text-xl tracking-widest uppercase">Begin Journey</span>
                        </button>
                     </div>
                </FadeInSection>
            </section>
        </div>
    );
};

export default LandingPage;
