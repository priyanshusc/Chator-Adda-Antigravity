import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // The backend userController.js will default this user to 'student'
                body: JSON.stringify({ name, username, email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                // Automatically route to menu since all registered users are students
                navigate('/menu');
            } else {
                throw new Error(data.message || 'Account creation failed');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen pt-14 pb-10 px-4 flex justify-center items-center bg-dark-bg relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-spicy/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-spicy/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/-1/4 right-1/4 w-56 h-56 bg-spicy-yellow/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                // Reduced max-width from md to sm and padding from p-8 to p-6
                className="glass-card w-full max-w-md py-6 px-10 rounded-2xl border border-gray-800 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-5">
                    <h2 className="text-4xl font-bold font-display mb-1 text-gradient">Join Us</h2>
                    <p className="text-sm text-gray-400">Register to get started</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[12px] mb-4 text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            {/* Reduced py-4 to py-3 */}
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="Your Name" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="Your Username" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="email@example.com" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={18} />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="••••••••" />
                        </div>
                    </div>

                    {/* Reduced py-4 to py-3 */}
                    <button type="submit" className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r from-spicy to-spicy-red text-white text-sm mt-2">
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                {/* Reduced mt-10 to mt-6 */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Already registered?{' '}
                    <Link to="/login" className="text-spicy-yellow font-bold hover:text-spicy transition-colors">
                        Login here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;