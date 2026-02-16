import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const toggleMode = () => setIsLogin(!isLogin);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden font-sans text-white">
             {/* Background */}
             <div className="absolute inset-0 z-0">
                 <img src="/assets/bg-main.jpg" alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/80 to-bordo/20" />
            </div>

            {/* Back Button */}
            <motion.button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
            >
                <ArrowLeft className="w-6 h-6" />
                <span>Return</span>
            </motion.button>

            {/* Main Card - Paper Fold Animation */}
            <motion.div
                className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl"
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="text-center mb-8">
                    <img src="/assets/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto rounded-full border border-white/20 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                    <h2 className="text-3xl font-bold text-white tracking-wider">{isLogin ? 'METSUKE LOGIN' : 'JOIN METSUKE'}</h2>
                    <p className="text-sm text-gray-400 mt-2">Access the intelligence</p>
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
                                <User className="absolute left-3 top-3 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all"
                                />
                            </div>
                        )}
                        
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-white/50 w-5 h-5 group-focus-within:text-white transition-colors" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full bg-dark/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            onClick={() => navigate('/chat')}
                            className="w-full bg-white text-dark font-bold py-3 rounded-md border border-white/50 transition-all duration-300 hover:bg-gray-200 shadow-lg relative overflow-hidden group"
                        >
                            <span className="relative z-10 tracking-widest">{isLogin ? 'ENTER' : 'CREATE ACCOUNT'}</span>
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div className="mt-6 text-center">
                    <button 
                        onClick={toggleMode}
                        className="text-gray-400 text-sm hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
                    >
                        {isLogin ? "No account? Sign up." : "Already have an account? Login."}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
