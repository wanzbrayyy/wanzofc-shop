import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import io from 'socket.io-client';

// NOTE: The socket server URL should point to your backend.
// This is a placeholder and will not work without a running server.
const SOCKET_URL = 'http://localhost:3001'; 

const ChatAdminPage = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // This effect will only run once.
        toast({
            title: "🔌 Menghubungkan ke Chat Server...",
            description: "Fitur ini memerlukan backend server untuk berfungsi. Ini adalah UI demo.",
        });

        // Simulating a connection and receiving a welcome message
        const timer = setTimeout(() => {
            setIsConnected(true);
            setMessages([{ text: "Halo! Ada yang bisa kami bantu?", sender: 'admin' }]);
            toast({
              title: "✅ Terhubung!",
              description: "Anda sekarang dapat mengirim pesan ke admin.",
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, []);


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const newMessage = { text: inputMessage, sender: 'user' };
            setMessages(prev => [...prev, newMessage]);
            setInputMessage('');
            
            // Simulate admin response
            setTimeout(() => {
                const adminResponse = { text: "Terima kasih atas pesan Anda. Admin akan segera merespons.", sender: 'admin' };
                setMessages(prev => [...prev, adminResponse]);
            }, 1500);
        }
    };
    
    return (
        <div className="min-h-screen p-4 flex flex-col">
            <Helmet>
                <title>Live Chat - WanzoFC Shop</title>
                <meta name="description" content="Chat langsung dengan admin WanzoFC Shop untuk mendapatkan bantuan secara real-time." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
            >
                <h1 className="text-4xl font-bold orbitron gradient-text">
                    <i className="fas fa-comments mr-3"></i>Live Chat
                </h1>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow flex flex-col w-full max-w-4xl mx-auto glass-effect rounded-2xl overflow-hidden"
            >
                <header className="p-4 bg-gray-800/50 border-b border-blue-500/20 flex items-center space-x-4">
                    <div className="relative">
                        <img  class="w-12 h-12 rounded-full" alt="Admin Avatar" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-white">Admin WanzoFC</h2>
                        <p className="text-sm text-green-400">{isConnected ? 'Online' : 'Offline'}</p>
                    </div>
                </header>

                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'admin' ? 'bg-gray-700 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 bg-gray-800/50 border-t border-blue-500/20 flex items-center space-x-4">
                    <input 
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ketik pesan Anda..."
                        className="form-input flex-1 px-4 py-3 rounded-full focus:outline-none"
                        disabled={!isConnected}
                    />
                    <button type="submit" className="btn-primary w-12 h-12 rounded-full flex items-center justify-center text-xl" disabled={!isConnected}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChatAdminPage;