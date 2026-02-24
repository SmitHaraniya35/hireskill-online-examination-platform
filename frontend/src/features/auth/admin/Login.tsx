import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/authContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../../../validators/auth.validators' 
import {toast} from 'react-toastify';

const Login: React.FC = () => {
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // hook form with zod resolver
    const {
        register,          
        handleSubmit,
        formState: { errors, isSubmitting } 
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched" 
    });

    const onFormSubmit = async (data: LoginInput) => {
        setServerError('');
        try {
            await login(data.email, data.password);
            toast.success("Successfully Loggedin");
            navigate('/admin/dashboard');
        } catch (err: any) {
            setServerError(err.message || 'Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#f0fdf4,#ffffff)] font-mono">
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-105">
                
                <div className="w-12.5 h-12.5 bg-[#1DA077] text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    H
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-[0.95rem]">Admin Panel Access</p>
                </div>
                
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    {serverError && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center gap-2">
                            <span>⚠️</span> {serverError}
                        </div>
                    )}
                    
                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                        <input 
                            {...register('email')} 
                            type="email" 
                            placeholder="admin@gmail.com" 
                            className={`w-full p-4 border rounded-xl transition-all bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {/* zod error message */}
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                {...register('password')} 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className={`w-full p-4 border rounded-xl transition-all bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            <button 
                                type="button" 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1DA077] font-semibold text-xs"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-between items-center text-sm my-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-[#1DA077] w-4 h-4 cursor-pointer" /> 
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <Link to="/admin/forgot-password" virtual-link="true" className="text-[#1DA077] font-semibold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full p-4 bg-[#1DA077] text-white rounded-xl text-base font-semibold transition-all hover:bg-[#148562] disabled:bg-gray-400 shadow-md"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;