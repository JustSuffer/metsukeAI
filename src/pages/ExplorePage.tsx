
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Code, Cpu, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const articles = [
    {
        id: 1,
        title: "The Way of the Neural Network",
        description: "Understanding the hidden layers of the digital mind through the lens of ancient strategy.",
        icon: <Cpu className="w-8 h-8 text-gold" />,
        category: "Technology"
    },
    {
        id: 2,
        title: "Defensive Coding Arts",
        description: "Protecting your digital dojo from unseen threats and vulnerabilities.",
        icon: <Shield className="w-8 h-8 text-bordo" />,
        category: "Security"
    },
    {
        id: 3,
        title: "Vision Algorithms",
        description: "How MetsukeAI sees the world: A deep dive into computer vision.",
        icon: <BookOpen className="w-8 h-8 text-gold" />,
        category: "Research"
    },
    {
        id: 4,
        title: "Mastering the API",
        description: "Integration techniques for the modern samurai developer.",
        icon: <Code className="w-8 h-8 text-bordo" />,
        category: "Development"
    }
];

const ExplorePage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-dark text-paper font-sans overflow-x-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                 <img src="/assets/bg-main.jpg" alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-dark/90" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gold/10">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate('/')} className="text-gold/70 hover:text-gold transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gold tracking-widest">SCROLLS OF WISDOM</h1>
                </div>
            </header>

            {/* Content Grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative bg-black/40 border border-white/5 rounded-xl p-8 overflow-hidden hover:border-gold/50 transition-colors duration-300"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                <div className="mb-6 p-4 bg-dark/50 rounded-lg inline-block border border-white/10 group-hover:border-gold/30 transition-colors">
                                    {article.icon}
                                </div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{article.category}</div>
                                <h3 className="text-2xl font-bold text-paper mb-3 group-hover:text-gold transition-colors">{article.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{article.description}</p>
                                
                                <div className="mt-6 flex items-center text-sm text-gold/70 group-hover:text-gold uppercase tracking-widest font-bold">
                                    <span>Read Scroll</span>
                                    <div className="w-8 h-[1px] bg-gold/50 ml-4 group-hover:w-16 transition-all duration-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
