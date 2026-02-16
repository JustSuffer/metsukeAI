import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Image as ImageIcon, Bot, User as UserIcon, Plus, MessageSquare, Settings, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
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
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAnalyzing]);

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
        <div className="flex h-screen bg-dark text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex-shrink-0 bg-black/40 border-r border-white/5 flex flex-col"
                    >
                        <div className="p-4">
                            <button 
                                onClick={() => { setMessages([]); setInputValue(""); }}
                                className="flex items-center space-x-2 w-full px-4 py-3 rounded-md border border-white/10 hover:bg-white/5 transition-colors text-sm text-white"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Chat</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 space-y-2">
                            <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</div>
                            {/* Mock History Items */}
                            <button className="flex items-center space-x-2 w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md text-left truncate">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <span className="truncate">Samurai Code Analysis</span>
                            </button>
                            <button className="flex items-center space-x-2 w-full px-2 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md text-left truncate">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <span className="truncate">Visual Strategy</span>
                            </button>
                        </div>

                        <div className="p-2 border-t border-white/5 space-y-1">
                            <button onClick={() => navigate('/explore')} className="flex items-center space-x-2 w-full px-3 py-3 text-sm text-gray-300 hover:bg-white/5 rounded-md">
                                <Settings className="w-4 h-4" />
                                <span>Explore Scrolls</span>
                            </button>
                             <button onClick={() => navigate('/')} className="flex items-center space-x-2 w-full px-3 py-3 text-sm text-gray-300 hover:bg-white/5 rounded-md">
                                <LogOut className="w-4 h-4" />
                                <span>Return to Gate</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main 
                className="flex-1 flex flex-col relative"
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
                            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center border-4 border-dashed border-white/20 m-4 rounded-xl"
                        >
                            <div className="text-center">
                                <ImageIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold">Drop image to analyze</h3>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header / Sidebar Toggle */}
                <div className="flex items-center p-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeft className="w-6 h-6" />}
                    </button>
                    <span className="ml-4 font-semibold text-gray-200">Metsuke 5.2 Pro</span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold">Hey Warrior. Ready to dive in?</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-6 p-4 md:p-8 max-w-3xl mx-auto w-full">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start max-w-2xl space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center ${msg.sender === 'bot' ? 'bg-teal-600' : 'bg-gray-600'}`}>
                                            {msg.sender === 'bot' ? <Bot className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-white" />}
                                        </div>
                                        <div className={`text-sm md:text-base leading-relaxed p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white/10' : ''}`}>
                                            {msg.type === 'image' && msg.fileUrl && (
                                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                                                    <img src={msg.fileUrl} alt="Upload" className="max-w-md max-h-80 object-cover" />
                                                </div>
                                            )}
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                             {isAnalyzing && (
                                <div className="flex items-start max-w-2xl space-x-3">
                                    <div className="w-8 h-8 rounded-sm bg-teal-600 flex items-center justify-center">
                                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 pb-6">
                    <div className="max-w-3xl mx-auto relative">
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-end p-3 shadow-lg focus-within:border-white/20 transition-colors">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                            >
                                <Paperclip className="w-5 h-5" />
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </button>
                            <textarea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Ask anything to MetsukeAI..."
                                className="w-full bg-transparent border-none text-white focus:ring-0 resize-none max-h-40 py-2 px-3 placeholder:text-gray-500 scrollbar-hide"
                                rows={1}
                                style={{ minHeight: '44px' }}
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className={`p-2 rounded-lg transition-colors ${inputValue.trim() ? 'bg-white text-dark' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                             <p className="text-xs text-gray-500">MetsukeAI can make mistakes. Consider checking ancient scrolls.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
