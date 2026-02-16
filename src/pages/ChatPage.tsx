import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Image as ImageIcon, FileText, ArrowLeft, Bot, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    type: 'text' | 'image';
    fileUrl?: string;
}

const ChatPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Greetings, Kenshi. I am Metsuke, the Eye. Show me what you seek to understand.", sender: 'bot', type: 'text' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userText = inputValue;
        const newMessage: Message = {
            id: Date.now(),
            text: userText,
            sender: 'user',
            type: 'text'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        
        // Image Generation Command check
        if (userText.toLowerCase().startsWith('!çiz') || userText.toLowerCase().startsWith('!draw')) {
            const prompt = userText.substring(5).trim();
            if (!prompt) {
                 setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "Please provide a description for the vision. Usage: !çiz <description>",
                        sender: 'bot',
                        type: 'text'
                    }]);
                }, 500);
                return;
            }

            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
            
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: `Manifesting vision: "${prompt}"`,
                    sender: 'bot',
                    type: 'image',
                    fileUrl: imageUrl
                }]);
            }, 1000);
            return;
        }

        // Simulate Bot Response for normal text
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: "I perceive your query. The winds whisper of a deeper truth hidden within.",
                sender: 'bot',
                type: 'text'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1500);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            const newMessage: Message = {
                id: Date.now(),
                text: `Analysis complete for ${file.name}`,
                sender: 'user',
                type: 'image',
                fileUrl: URL.createObjectURL(file)
            };
            setMessages(prev => [...prev, newMessage]);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "The visual data suggests a strong correlation with the ancient scrolls. Proceed with caution.",
                    sender: 'bot',
                    type: 'text'
                }]);
            }, 1000);
        }, 2000);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="relative min-h-screen bg-dark text-paper font-sans flex flex-col overflow-hidden">
             {/* Background */}
             <div className="absolute inset-0 z-0">
                 <img src="/assets/bg-chat.jpg" alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-dark/80" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gold/20 bg-dark/50 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate('/')} className="text-gold/70 hover:text-gold transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gold tracking-widest">METSUKE DOJO</h1>
                </div>
                <div className="flex items-center space-x-4">
                     {/* Tools like PDF export can go here */}
                     <button className="text-gray-400 hover:text-bordo transition-colors">
                        <FileText className="w-5 h-5" />
                     </button>
                </div>
            </header>

            {/* Chat Area */}
            <div 
                className="flex-1 relative z-10 overflow-y-auto p-6 space-y-6"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {/* Drag Overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center border-4 border-dashed border-bordo m-4 rounded-xl"
                        >
                            <div className="text-center">
                                <ImageIcon className="w-16 h-16 text-bordo mx-auto mb-4" />
                                <h3 className="text-2xl text-gold font-bold">Offer your visual evidence</h3>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                 {/* Analyzing Overlay */}
                 <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-x-0 top-0 z-40 bg-gold/10 p-2 text-center border-b border-gold"
                        >
                            <div className="flex items-center justify-center space-x-2 text-gold">
                                <div className="w-2 h-2 bg-gold rounded-full animate-ping" />
                                <span className="tracking-widest text-sm font-bold uppercase">Analyzing Visual Data...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {messages.map((msg) => (
                    <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                         <div className={`flex items-end max-w-xl space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${msg.sender === 'bot' ? 'border-gold bg-dark' : 'border-bordo bg-dark'}`}>
                                {msg.sender === 'bot' ? <Bot className="w-5 h-5 text-gold" /> : <UserIcon className="w-5 h-5 text-bordo" />}
                            </div>

                            {/* Bubble */}
                            <div className={`
                                p-4 rounded-2xl relative
                                ${msg.sender === 'bot' 
                                    ? 'bg-dark/80 border-l-2 border-gold text-paper rounded-bl-none shadow-[0_4px_20px_-5px_rgba(212,175,55,0.2)]' 
                                    : 'bg-bordo/20 border-r-2 border-bordo text-white rounded-br-none shadow-[0_4px_20px_-5px_rgba(110,0,12,0.3)]'
                                }
                            `}>
                                {msg.type === 'image' && msg.fileUrl && (
                                    <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                                        <img src={msg.fileUrl} alt="Upload" className="max-w-xs max-h-60 object-cover" />
                                    </div>
                                )}
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                         </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-4 bg-dark/80 border-t border-gold/10 backdrop-blur-lg">
                <div className="max-w-4xl mx-auto flex items-center space-x-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gold/50 hover:text-gold hover:bg-gold/10 rounded-full transition-colors"
                    >
                        <Paperclip className="w-6 h-6" />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Consult the oracle..."
                            className="w-full bg-black/40 border border-gold/20 rounded-full py-3 pl-6 pr-12 text-paper focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-gray-600"
                        />
                        <button 
                            onClick={handleSendMessage}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${inputValue.trim() ? 'bg-gold text-dark hover:bg-yellow-600' : 'bg-transparent text-gray-600 cursor-not-allowed'}`}
                            disabled={!inputValue.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
