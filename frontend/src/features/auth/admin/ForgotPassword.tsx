import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "../../../services/auth.services";
import { forgotPasswordSchema, type ForgotPasswordInput } from '../../../validators/auth.validator'

const ForgotPassword: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // hook form with zod resolver
  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  // Submit Handler
  const onFormSubmit = async (data: ForgotPasswordInput) => {
    setServerError("");
    try {
      const result = await authService.forgotPassword(data);

      if (!result.success) {
        setServerError(result.message);
        return;
      }
      navigate("/admin/verify-otp", { state: { email: data.email } });
    } catch (err: any) {
      setServerError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#f0fdf4,#ffffff)] font-mono p-4">
      <div className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-105">
        
        <div className="text-center mb-8">
          <div className="w-12.5 h-12.5 bg-[#1DA077] text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
            H
          </div>
          <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Forgot Password?</h2>
          <p className="text-gray-500 text-[0.95rem]">
            Enter your admin email to receive a 6-digit code.
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2 text-gray-700">Admin Email</label>
            <input
              {...register("email")}
              type="email"
              className={`w-full p-[14px_16px] border rounded-xl text-base transition-all bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${
                errors.email || serverError ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="admin@hireskill.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
            )}
          </div>
          {serverError && (
            <div className="bg-red-50 text-red-500 p-[10px_14px] rounded-lg text-[0.85rem] flex items-center gap-2 border border-red-100">
              <span>⚠️</span> {serverError}
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
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/admin/login" 
            className="text-[#1DA077] font-semibold text-sm hover:text-[#148562] inline-flex items-center gap-1"
          >
            <span className="text-lg">←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;