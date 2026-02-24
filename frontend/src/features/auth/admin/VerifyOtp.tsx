import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "../../../services/auth.services";
import { verifyOtpSchema, type VerifyOtpInput } from  '../../../validators/auth.validators'

const VerifyOtp: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    setValue, 
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email, 
      otp: "",
    },
    mode: "onChange",
  });

  const onFormSubmit = async (data: VerifyOtpInput) => {
    setServerError("");

    if (!data.email) {
      setServerError("Session expired. Please try forgot password again.");
      return;
    }

    try {
      const result = await authService.verifyOtp({
        email: data.email,
        otp: data.otp,
      });

      if (result.success) {
        navigate("/admin/reset-password", { state: { email: data.email } });
      } else {
        setServerError(result.message);
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#f0fdf4,#ffffff)] font-mono p-4">
      <div className="bg-white p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-105">
        
        <div className="text-center mb-8">
          <div className="w-12.5 h-12.5 bg-[#1DA077] text-white rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
            📩
          </div>
          <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Verify OTP</h2>
          <p className="text-gray-500 text-[0.95rem]">
            We've sent a code to <br />
            <strong className="text-gray-800 break-all">{email || "your email"}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Hidden Email Field (Required for Zod Schema) */}
          <input type="hidden" {...register("email")} />

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-3 text-center text-gray-700">
              Enter 6-Digit Code
            </label>
            <input
              {...register("otp", {
                onChange: (e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setValue("otp", val);
                }
              })}
              type="text"
              maxLength={6}
              placeholder="000000"
              className={`w-full p-4 border rounded-xl transition-all text-center text-2xl font-bold tracking-[8px] bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] ${
                errors.otp || serverError ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-2 text-center">{errors.otp.message}</p>
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
                Verifying...
              </span>
            ) : "Verify Code"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate("/admin/forgot-password")}
            className="text-[#1DA077] font-semibold text-sm hover:underline"
          >
            Resend Code?
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;