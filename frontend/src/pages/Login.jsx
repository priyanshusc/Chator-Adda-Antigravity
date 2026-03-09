import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Login = () => {
    const [loginType, setLoginType] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setCartItems } = useCart();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                // Use the 'role' field from your User.js schema
                if (loginType === 'admin' && data.role !== 'admin') {
                    throw new Error("Access Denied: This account does not have Admin privileges.");
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));

                if (data.cart) {
                    setCartItems(data.cart);
                } else {
                    setCartItems([]); // Failsafe: empty cart if they have none
                }

                navigate(data.role === 'admin' && loginType === 'admin' ? '/admin' : '/menu');
            } else {
                throw new Error(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 flex justify-center items-center bg-dark-bg relative overflow-hidden">
            {/* Ambient Background Glows - Slightly smaller */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-spicy/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-spicy-yellow/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // Changed max-w-md to max-w-sm and p-8 to p-6
                className="glass-card w-full max-w-md py-8 px-10 rounded-2xl border border-gray-800 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-5">
                    <h2 className="text-4xl font-bold font-display mb-1 text-gradient">Welcome Back</h2>
                    <p className="text-sm text-gray-400">Login to your {loginType} portal</p>
                </div>

                {/* Role Toggle Tabs - Reduced margin and icon size */}
                <div className="flex gap-2 p-1 bg-dark-surface rounded-xl mb-5 border border-gray-800 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setLoginType('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${loginType === 'student' ? 'bg-spicy text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <User size={16} /> Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType('admin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${loginType === 'admin' ? 'bg-dark-bg text-spicy-yellow border border-gray-700 shadow-lg' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <ShieldCheck size={16} /> Admin
                    </button>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs mb-4 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                // Reduced py-4 to py-3 and text size to text-sm
                                className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy focus:ring-1 focus:ring-spicy/30 transition-all outline-none"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy focus:ring-1 focus:ring-spicy/30 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${loginType === 'student'
                            ? 'bg-gradient-to-r from-spicy to-spicy-red text-white hover:shadow-[0_0_20px_rgba(255,92,0,0.3)]'
                            : 'bg-dark-surface border border-spicy-yellow text-spicy-yellow hover:bg-gray-800'
                            }`}
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                {/* Reduced mt-10 to mt-6 */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    New to Chator Adda?{' '}
                    <Link to="/register" className="text-spicy-yellow font-bold hover:text-spicy transition-colors">
                        Create account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;