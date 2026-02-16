import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, X } from 'lucide-react';

const AuthPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleLogin = (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        localStorage.setItem('metsuke_auth', 'true');
        navigate('/chat');
    };

    const SocialButton = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick?: React.MouseEventHandler }) => (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-start px-4 py-3 mb-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-white font-medium relative group"
        >
            <span className="absolute left-4">{icon}</span>
            <span className="w-full text-center">{text}</span>
        </button>
    );

    // Custom Icons for Brands
    const GoogleIcon = () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.87-2.6 3.3-4.5 6.16-4.5z" fill="#EA4335"/>
        </svg>
    );

    const AppleIcon = () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
           <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 4.31-.74c.74.03 2.92.29 4.33 2.4-3.69 1.83-3.07 7.25.92 8.92-.66 1.77-1.6 3.5-2.64 4.65zm-4.32-15.5c-.32-1.74 1.43-3.15 2.99-3.32.37 2.05-1.87 3.63-2.99 3.32z"/>
        </svg>
    );

    const MicrosoftIcon = () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 1h-10C.675 1 0 1.675 0 2.5v9c0 .825.675 1.5 1.5 1.5h10c.825 0 1.5-.675 1.5-1.5v-9C13 1.675 12.325 1 11.5 1z" fill="#F25022"/>
            <path d="M22.5 1h-10c-.825 0-1.5.675-1.5 1.5v9c0 .825.675 1.5 1.5 1.5h10c.825 0 1.5-.675 1.5-1.5v-9C24 1.675 23.325 1 22.5 1z" fill="#7FBA00"/>
            <path d="M11.5 14h-10c-.825 0-1.5.675-1.5 1.5v9c0 .825.675 1.5 1.5 1.5h10c.825 0 1.5-.675 1.5-1.5v-9C13 14.675 12.325 14 11.5 14z" fill="#00A4EF"/>
            <path d="M22.5 14h-10c-.825 0-1.5.675-1.5 1.5v9c0 .825.675 1.5 1.5 1.5h10c.825 0 1.5-.675 1.5-1.5v-9C24 14.675 23.325 14 22.5 14z" fill="#FFB900"/>
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/95 text-white p-4 font-sans">
            {/* Close Button Positioned at top right of the page similar to the screenshot's 'modal' feel, 
                or we can put it inside the card. Reference shows it on the modal content. */}
            
            <motion.div 
                className="w-full max-w-[400px] flex flex-col items-center relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Close Button */}
                <button 
                    onClick={() => navigate('/')}
                    className="absolute -top-12 right-0 md:-right-12 p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">Oturum aç veya kaydol</h1>
                <p className="text-center text-white/80 mb-8 max-w-sm leading-relaxed">
                    Daha zeki yanıtlar alabilir, dosya ve görsel yükleyebilir ve çok daha fazlasını yapabilirsin.
                </p>

                <div className="w-full space-y-3">
                    <SocialButton icon={<GoogleIcon />} text="Google ile devam et" onClick={handleLogin} />
                    <SocialButton icon={<AppleIcon />} text="Apple ile devam et" onClick={handleLogin} />
                    <SocialButton icon={<MicrosoftIcon />} text="Microsoft ile devam et" onClick={handleLogin} />
                    <SocialButton icon={<Phone className="w-5 h-5 opacity-90" />} text="Telefonla devam et" onClick={handleLogin} />
                </div>

                <div className="w-full flex items-center gap-3 my-6">
                    <div className="h-px bg-white/20 flex-1" />
                    <span className="text-xs text-white/50 font-medium tracking-wider">YA DA</span>
                    <div className="h-px bg-white/20 flex-1" />
                </div>

                <form className="w-full space-y-4" onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-posta adresi" 
                        required
                        className="w-full bg-transparent border border-white/20 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-base"
                    />
                    
                    <button 
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors text-lg"
                    >
                        Devam
                    </button>
                </form>

            </motion.div>
        </div>
    );
};

export default AuthPage;
