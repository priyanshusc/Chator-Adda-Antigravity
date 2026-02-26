import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Upload, Image as ImageIcon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // TODO: Upload profile image separately if needed later

            alert('Registration successful!');
            navigate('/menu');
        } catch (error) {
            console.error('Register error:', error);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:py-12">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-spicy-yellow/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-spicy/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-lg p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-spicy-red via-spicy to-spicy-yellow" />

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Join the Club</h2>
                    <p className="text-gray-400">Create an account to order</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-full bg-dark-bg/80 border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-spicy-yellow transition-colors overflow-hidden group relative"
                        >
                            {preview ? (
                                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-500 group-hover:text-spicy-yellow" size={32} />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload className="text-white" size={20} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Tap to upload profile pic</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-dark-bg/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-spicy-yellow focus:ring-1 focus:ring-spicy-yellow transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
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
                        className="w-full bg-gradient-to-r from-spicy-red to-spicy text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-shadow mt-4"
                    >
                        <UserPlus size={20} />
                        <span>Create Account</span>
                    </motion.button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-spicy hover:text-spicy-light transition-colors font-semibold">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
