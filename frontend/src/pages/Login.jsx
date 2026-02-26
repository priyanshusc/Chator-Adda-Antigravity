import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder login logic; will hook to backend later
        console.log('Login attempt:', formData);
        navigate('/menu');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-spicy/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-spicy-red/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-md p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-spicy-yellow via-spicy to-spicy-red" />

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to crave the spice 🔥</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-dark-bg/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-spicy-yellow focus:ring-1 focus:ring-spicy-yellow transition-colors"
                                placeholder="student@college.edu"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-dark-bg/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-spicy focus:ring-1 focus:ring-spicy transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-spicy to-spicy-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,92,0,0.3)] hover:shadow-[0_0_25px_rgba(255,92,0,0.5)] transition-shadow"
                    >
                        <LogIn size={20} />
                        <span>Sign In</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-spicy-yellow hover:text-spicy-light transition-colors font-semibold">
                        Register now
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
