import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../../../services/auth.services';
import { resetPasswordSchema, type ResetPasswordInput } from  '../../../validators/auth.validators'

const ResetPassword: React.FC = () => {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    // hook form with zod resolver
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: email,
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onChange" 
    });

    const onFormSubmit = async (data: ResetPasswordInput) => {
        setServerError('');
        
        if (!data.email) {
            setServerError('Session expired. Please try forgot password again.');
            return;
        }

        try {
            await authService.resetPassword({email: data.email, newPassword: data.newPassword});
            alert("Password reset successful!");
            navigate('/admin/login');
        } catch (err: any) {
            setServerError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#f0fdf4,#ffffff)] font-mono p-4">
            <div className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-105">
                
                <div className="text-center mb-8">
                    <div className="w-12.5 h-12.5 bg-[#1DA077] text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                        H
                    </div>
                    <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Set New Password</h2>
                    <p className="text-gray-500 text-[0.95rem]">
                        Almost there! Create a strong password for your admin account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                    {/* Hidden Email Field */}
                    <input type="hidden" {...register("email")} />

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2 text-gray-700">New Password</label>
                        <input 
                            {...register("newPassword")}
                            type="password" 
                            placeholder="••••••••" 
                            className={`w-full p-4 border rounded-xl transition-all bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${
                                errors.newPassword ? "border-red-300" : "border-gray-200"
                            }`}
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2 text-gray-700">Confirm New Password</label>
                        <input 
                            {...register("confirmPassword")}
                            type="password" 
                            placeholder="••••••••" 
                            className={`w-full p-4 border rounded-xl transition-all bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${
                                errors.confirmPassword ? "border-red-300" : "border-gray-200"
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                            <span>❌</span> {serverError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full p-4 bg-[#1DA077] text-white rounded-xl text-base font-semibold shadow-md transition-all hover:bg-[#148562] disabled:bg-gray-400"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Updating...
                            </span>
                        ) : 'Update Password'}
                    </button>

                    <div className="mt-8 text-center">
                        <Link 
                            to="/admin/login" 
                            className="text-[#1DA077] font-semibold text-sm hover:underline inline-flex items-center gap-1"
                        >
                            <span className="text-lg">←</span> Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;