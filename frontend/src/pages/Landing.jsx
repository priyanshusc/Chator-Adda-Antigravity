import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-8">
            {/* Background ambient glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spicy/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spicy-red/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl w-full text-center z-10 space-y-8"
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-spicy-yellow text-sm font-medium mb-4 shadow-[0_0_15px_rgba(250,204,21,0.2)] border-spicy-yellow/20"
                >
                    <Flame size={18} className="animate-pulse text-spicy" />
                    <span>The College's Hottest Spot</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                    Welcome to <br />
                    <span className="text-gradient">Hehe</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Skip the line. Order the spiciest bites on campus directly from your seat. Live tracking, instant updates, and pure flavor.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link to="/menu">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-spicy to-spicy-red text-white font-bold rounded-xl flex items-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all"
                        >
                            <UtensilsCrossed size={20} />
                            <span>Explore Menu</span>
                            <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </motion.button>
                    </Link>

                    <Link to="/login">
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(31, 41, 55, 1)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 glass-card text-white font-semibold rounded-xl flex items-center gap-2 hover:border-spicy/50 transition-colors"
                        >
                            <span>Login Profile</span>
                            <ArrowRight size={20} className="text-gray-400 group-hover:text-spicy-yellow transition-colors" />
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Decorative Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 md:right-32 text-6xl opacity-20 filter blur-sm pointer-events-none"
            >
                🌶️
            </motion.div>
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 left-10 md:left-24 text-7xl opacity-20 filter blur-sm pointer-events-none"
            >
                🍕
            </motion.div>
        </div>
    );
};

export default Landing;
