import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
    const [loginType, setLoginType] = useState('student'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                // Use the 'role' field from your User.js schema
                if (loginType === 'admin' && data.role !== 'admin') {
                    throw new Error("Access Denied: This account does not have Admin privileges.");
                }
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                
                navigate(data.role === 'admin' && loginType === 'admin' ? '/admin' : '/menu');
            } else {
                throw new Error(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center bg-dark-bg relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spicy/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-spicy-yellow/5 rounded-full blur-[100px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 rounded-3xl border border-gray-800 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold font-display mb-2 text-gradient">Welcome Back</h2>
                    <p className="text-gray-400">Login to your {loginType} portal</p>
                </div>

                {/* Role Toggle Tabs */}
                <div className="flex p-1.5 bg-dark-surface rounded-2xl mb-8 border border-gray-800 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setLoginType('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                            loginType === 'student' ? 'bg-spicy text-white shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <User size={20} /> Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType('admin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                            loginType === 'admin' ? 'bg-dark-bg text-spicy-yellow border border-gray-700 shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <ShieldCheck size={20} /> Admin
                    </button>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark-surface/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-spicy focus:ring-1 focus:ring-spicy/30 transition-all outline-none"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-surface/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-spicy focus:ring-1 focus:ring-spicy/30 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                            loginType === 'student' 
                            ? 'bg-gradient-to-r from-spicy to-spicy-red text-white hover:shadow-[0_0_25px_rgba(255,92,0,0.4)]' 
                            : 'bg-dark-surface border border-spicy-yellow text-spicy-yellow hover:bg-gray-800'
                        }`}
                    >
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-10 text-center text-gray-400">
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