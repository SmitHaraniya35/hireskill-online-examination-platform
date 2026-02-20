import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/authContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.log(err.message)
            setError(err.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f0fdf4,_#ffffff)] font-mono">
            <div className="bg-white p-8 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(29,160,119,0.1)] w-full max-w-[420px] animate-[slideUp_0.6s_ease-out]">
                <div className="w-12.5 h-12.5 bg-[#1DA077] text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    H
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-[0.95rem]">Enter your credentials to access the admin panel</p>
                </div>
                
                <form onSubmit={handleFormSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-[10px_14px] rounded-lg text-[0.85rem] mb-6 flex items-center gap-2 border border-red-100 animate-[shake_0.4s_ease-in-out]">
                            <span>⚠️</span> {error}
                        </div>
                    )}
                    
                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="admin@hireskill.com" 
                            className={`w-full p-[14px_16px] border rounded-xl text-base transition-all duration-200 bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 ${error ? 'border-red-200' : 'border-gray-200'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className={`w-full p-[14px_16px] border rounded-xl text-base transition-all duration-200 bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 ${error ? 'border-red-200' : 'border-gray-200'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button 
                                type="button" 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1DA077] font-semibold text-[0.85rem] px-2 py-1 rounded-md hover:bg-[#1DA077]/5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm my-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-[#1DA077] w-4 h-4 cursor-pointer" /> 
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <Link to="/admin/forgot-password" className="text-sm text-[#1DA077] font-semibold hover:text-[#148562]">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full p-4 bg-[#1DA077] text-white rounded-xl text-base font-semibold shadow-[0_4px_10px_rgba(29,160,119,0.2)] transition-all duration-300 hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;