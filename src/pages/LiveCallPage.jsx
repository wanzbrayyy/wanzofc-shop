import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const LiveCallPage = () => {
    const navigate = useNavigate();

    const handleFeatureClick = (feature) => {
        toast({
            title: `🚧 Fitur ${feature}`,
            description: "Fitur ini masih dalam tahap pengembangan dan belum berfungsi sepenuhnya. Anda dapat meminta implementasi penuh pada prompt berikutnya! 🚀",
        });
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <Helmet>
                <title>Live Call - Admin Panel</title>
            </Helmet>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl glass-effect p-8 rounded-2xl"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold orbitron gradient-text">Pusat Panggilan Langsung</h1>
                        <p className="text-gray-400">Terima panggilan suara dan video dari pelanggan.</p>
                    </div>
                    <button onClick={() => navigate('/admin')} className="btn-secondary px-4 py-2 rounded-lg">
                        <i className="fas fa-times mr-2"></i>
                        Tutup
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Video Display */}
                    <div className="bg-black rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-600">
                        <div className="text-center text-gray-500">
                            <i className="fas fa-video-slash text-5xl mb-4"></i>
                            <p>Menunggu Panggilan Masuk...</p>
                        </div>
                    </div>

                    {/* Controls & Status */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold orbitron neon-text mb-4">Status & Kontrol</h2>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-400"><i className="fas fa-circle"></i></span>
                                    <span>Status: <span className="font-bold">Online - Menunggu</span></span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-blue-400"><i className="fas fa-clock"></i></span>
                                    <span>Durasi Panggilan: <span className="font-bold">00:00</span></span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-purple-400"><i className="fas fa-user"></i></span>
                                    <span>ID Pemanggil: <span className="font-bold">N/A</span></span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4 mt-8">
                            <button onClick={() => handleFeatureClick('Jawab Panggilan')} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl hover:bg-green-600 transition-colors">
                                <i className="fas fa-phone"></i>
                            </button>
                            <button onClick={() => handleFeatureClick('Tolak Panggilan')} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-colors">
                                <i className="fas fa-phone-slash"></i>
                            </button>
                            <button onClick={() => handleFeatureClick('Bisukan Mikrofon')} className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl hover:bg-gray-700 transition-colors">
                                <i className="fas fa-microphone-slash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-xl font-bold orbitron mb-4">Log Panggilan</h3>
                    <div className="text-center text-gray-500 py-8">
                        <i className="fas fa-history text-3xl mb-3"></i>
                        <p>Belum ada riwayat panggilan.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LiveCallPage;