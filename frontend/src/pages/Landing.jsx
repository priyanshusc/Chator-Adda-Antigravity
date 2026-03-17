import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, UtensilsCrossed, Clock, MapPin, Star, Zap, ChefHat, Instagram, Facebook, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    // Animation variants for smooth scrolling appearances
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="bg-dark-bg min-h-screen text-white overflow-hidden selection:bg-spicy/30">

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-16">
                {/* Background ambient glow */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-spicy/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-spicy-yellow/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="max-w-4xl w-full text-center z-10 space-y-8"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-spicy-yellow text-sm font-medium mb-2 shadow-[0_0_15px_rgba(250,204,21,0.15)] border border-spicy-yellow/20"
                    >
                        <Flame size={18} className="animate-pulse text-spicy" />
                        <span>The Campus Favorite Spot</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
                        Welcome to <br />
                        <span className="text-gradient drop-shadow-sm">LiveBite</span>
                    </h1>

                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Skip the line. Order the spiciest bites on campus directly from your phone. Live tracking, instant updates, and pure flavor.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center justify-center gap-4 pt-6">

                        <Link to="/menu">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative 
                 px-6 py-3 text-sm 
                 md:px-8 md:py-4 md:text-base
                 bg-gradient-to-r from-spicy to-spicy-red 
                 text-white font-bold rounded-xl 
                 flex items-center gap-2 sm:gap-3 
                 overflow-hidden shadow-[0_0_20px_rgba(255,92,0,0.3)] 
                 transition-all w-full md:w-auto justify-center"
                            >
                                <UtensilsCrossed size={18} className="sm:w-5 sm:h-5" />
                                <span>Explore Menu</span>
                                <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </motion.button>
                        </Link>

                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(31, 41, 55, 1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 text-sm
                 md:px-8 md:py-4 md:text-base
                 glass-card text-white font-semibold 
                 rounded-xl flex items-center gap-2 
                 hover:border-spicy/30 transition-colors 
                 w-full md:w-auto justify-center"
                            >
                                <span>Login Profile</span>
                                <ArrowRight size={18} className="text-gray-400 transition-colors" />
                            </motion.button>
                        </Link>

                    </div>
                </motion.div>

                {/* Decorative Floating Elements */}
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-32 right-10 md:right-32 text-6xl opacity-20 filter blur-[2px] pointer-events-none">🌶️</motion.div>
                <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-40 left-10 md:left-24 text-7xl opacity-20 filter blur-[2px] pointer-events-none">🍕</motion.div>
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-1/2 right-1/4 text-5xl opacity-10 filter blur-[1px] pointer-events-none">🍟</motion.div>
            </section>

            {/* ================= HOW IT WORKS SECTION ================= */}
            <section className="py-24 px-4 md:px-8 relative bg-dark-surface/30 border-y border-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It <span className="text-spicy-yellow">Works</span></h2>
                        <p className="text-gray-400">Your favorite food, zero waiting time.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap size={32} />, title: "1. Quick Order", desc: "Browse our digital menu and place your order instantly." },
                            { icon: <Clock size={32} />, title: "2. Live Tracking", desc: "Watch your order status change from Preparing to Ready in real-time." },
                            { icon: <MapPin size={32} />, title: "3. Easy Pickup", desc: "Walk to the counter only when your food is hot and ready." }
                        ].map((step, index) => (
                            <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: index * 0.2 }} className="glass-card p-8 rounded-2xl text-center hover:border-spicy/30 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-spicy/10 text-spicy rounded-full flex items-center justify-center mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CAFE OWNER STORY SECTION ================= */}
            <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2">
                    <div className="aspect-square rounded-3xl overflow-hidden glass-card border-gray-800 relative group">
                        {/* Placeholder for Cafe Image */}
                        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-gray-500">
                            <ChefHat size={64} className="mb-4 opacity-50" />
                            <p className="font-medium">[Cafe Owner Image / Shop Photo]</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        Serving the Campus <br /> Since <span className="text-spicy drop-shadow-md">2025</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        "[Cafe Owner's Quote: We started LiveBite with a simple mission—to give students the best quality snacks without burning a hole in their pockets. Everything is made fresh, every single day.]"
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[
                                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
                                "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
                                "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
                                "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
                            ].map((src, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-dark-bg overflow-hidden 
                 hover:scale-110 transition-transform duration-300"
                                >
                                    <img
                                        src={src}
                                        alt="Indian Student"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex text-spicy-yellow"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                            <span className="text-gray-400 font-medium">Loved by 1000+ students</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ================= FOOTER / CONTACT SECTION ================= */}
            <footer className="border-t border-gray-800/80 bg-dark-surface/50 pt-16 pb-8 px-4 md:px-8 mt-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Brand Col */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-display font-bold text-gradient flex items-center gap-2">
                            <span className="text-2xl">🌶️</span> Chator Adda
                        </h3>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Your daily dose of spices, snacks, and good times.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link to="/menu" className="hover:text-spicy-yellow transition-colors">Digital Menu</Link></li>
                            <li><Link to="/login" className="hover:text-spicy-yellow transition-colors">Student Login</Link></li>
                            <li><a href="#" className="hover:text-spicy-yellow transition-colors">Report an Issue</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Visit Us</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-spicy shrink-0 mt-0.5" />
                                <span>[College Name, Specific Block/Location details here]</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock size={18} className="text-spicy shrink-0" />
                                <span>Mon-Sat: [9:00 AM - 6:00 PM]</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-spicy shrink-0" />
                                <span>[+91 98765 43210]</span>
                            </li>
                        </ul>
                        <div className="pt-4 flex gap-4">
                            <a href="https://www.instagram.com/chatoradda/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-spicy hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.facebook.com/people/Chator-Adda/100089693115736/#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-spicy hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Chator Adda. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Developed with ❤️ by <span className="font-medium text-gray-400">Priyanshu</span>
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Landing;