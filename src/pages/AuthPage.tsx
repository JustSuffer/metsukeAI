import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden font-sans text-paper">
             {/* Background */}
             <div className="absolute inset-0 z-0">
                 <img src="/assets/bg-main.jpg" alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/80 to-bordo/20" />
            </div>

            {/* Back Button */}
            <motion.button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-gold/70 hover:text-gold transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                <ArrowLeft className="w-6 h-6" />
                <span>Return to Dojo</span>
            </motion.button>

            {/* Main Card - Paper Fold Animation */}
            <motion.div
                className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-md border border-gold/30 p-8 rounded-lg shadow-2xl"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="text-center mb-8">
                    <img src="/assets/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto rounded-full border border-gold/50 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    <h2 className="text-3xl font-bold text-gold tracking-wider">{isLogin ? 'WARRIOR LOGIN' : 'RECRUITMENT'}</h2>
                    <p className="text-sm text-gray-400 mt-2">Enter the realm of Metsuke</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.form
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gold/50 w-5 h-5 group-focus-within:text-gold transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Warrior Name" 
                                    className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-paper focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                />
                            </div>
                        )}
                        
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-gold/50 w-5 h-5 group-focus-within:text-gold transition-colors" />
                            <input 
                                type="email" 
                                placeholder="Email Scroll" 
                                className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-paper focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-gold/50 w-5 h-5 group-focus-within:text-gold transition-colors" />
                            <input 
                                type="password" 
                                placeholder="Secret Key" 
                                className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-paper focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            onClick={() => navigate('/chat')}
                            className="w-full bg-bordo hover:bg-red-900 text-gold font-bold py-3 rounded-md border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(110,0,12,0.6)] relative overflow-hidden group"
                        >
                            <span className="relative z-10 tracking-widest">{isLogin ? 'ENTER' : 'JOIN'}</span>
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-gold/10"></div>
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div className="mt-6 text-center">
                    <button 
                        onClick={toggleMode}
                        className="text-gray-400 text-sm hover:text-gold transition-colors underline decoration-gold/30 hover:decoration-gold"
                    >
                        {isLogin ? "No clan yet? Join us." : "Already oathsworn? Login."}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
