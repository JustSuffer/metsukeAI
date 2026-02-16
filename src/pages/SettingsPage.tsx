import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('metsuke_auth');
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-dark text-white font-sans relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                 <img src="/assets/bg-settings-final.jpg" alt="Settings Background" className="w-full h-full object-cover opacity-30" />
                 <div className="absolute inset-0 bg-dark/80 mix-blend-multiply" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <button onClick={() => navigate('/chat')} className="text-gray-400 hover:text-white transition-colors mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white tracking-wide">Settings</h1>
            </header>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                    
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-bordo/20 rounded-full flex items-center justify-center border border-white/10">
                                <User className="w-8 h-8 text-white/80" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Warrior Profile</h3>
                                <p className="text-sm text-gray-400">Managing the digital dojo.</p>
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-white">
                                <Bell className="w-5 h-5" />
                                <span>Notifications</span>
                            </div>
                            <span className="text-xs text-gray-500">On</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-white">
                                <Shield className="w-5 h-5" />
                                <span>Privacy & Security</span>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-white">
                                <HelpCircle className="w-5 h-5" />
                                <span>Help & Support</span>
                            </div>
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-900/20 transition-colors group"
                        >
                            <div className="flex items-center space-x-3 text-red-400 group-hover:text-red-300">
                                <LogOut className="w-5 h-5" />
                                <span>Log Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
