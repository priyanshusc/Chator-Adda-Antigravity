import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
    const [registerType, setRegisterType] = useState('student'); 
    const [name, setName] = useState('');
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
                // Sending 'role' to match your User.js backend schema
                body: JSON.stringify({ name, email, password, role: registerType })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate(data.role === 'admin' ? '/admin' : '/menu');
            } else {
                throw new Error(data.message || 'Account creation failed');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center bg-dark-bg relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-spicy/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-8 rounded-3xl border border-gray-800 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold font-display mb-2 text-gradient">Join Us</h2>
                    <p className="text-gray-400">Register as a {registerType} to start</p>
                </div>

                <div className="flex p-1.5 bg-dark-surface rounded-2xl mb-8 border border-gray-800 shadow-inner">
                    <button type="button" onClick={() => setRegisterType('student')} className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${registerType === 'student' ? 'bg-spicy text-white shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}>Student</button>
                    <button type="button" onClick={() => setRegisterType('admin')} className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${registerType === 'admin' ? 'bg-dark-bg text-spicy-yellow border border-gray-700 shadow-lg scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}>Admin</button>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={20} />
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="Your Name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={20} />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="email@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-spicy transition-colors" size={20} />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark-surface/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-spicy transition-all outline-none" placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${registerType === 'student' ? 'bg-gradient-to-r from-spicy to-spicy-red text-white' : 'bg-dark-surface border border-spicy-yellow text-spicy-yellow'}`}>
                        Create {registerType} Account <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-10 text-center text-gray-400">
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