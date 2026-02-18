import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../../services/authAdminService";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authService.forgotPassword(email);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    
    // TEMP: store OTP for frontend verification
    localStorage.setItem("forgot_otp", result.otp);
    localStorage.setItem("forgot_email", email);

    console.log("OTP from backend:", result.otp);

    navigate("/admin/verify-otp", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f0fdf4,_#ffffff)] font-mono p-4">
      <div className="bg-white p-10 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(29,160,119,0.1)] w-full max-w-[420px] animate-[slideUp_0.6s_ease-out]">
        
        <div className="text-center mb-8">
          <div className="w-[50px] h-[50px] bg-[#1DA077] text-white rounded-[12px] flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
            H
          </div>
          <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2 leading-tight">Forgot Password?</h2>
          <p className="text-gray-500 text-[0.95rem]">
            Enter your admin email to receive a 6-digit code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2 text-gray-700">Admin Email</label>
            <input
              type="email"
              required
              className={`w-full p-[14px_16px] border rounded-xl text-base transition-all duration-200 bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 ${
                error ? "border-red-200" : "border-gray-200"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="admin@hireskill.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-[10px_14px] rounded-lg text-[0.85rem] flex items-center gap-2 border border-red-100 animate-[shake_0.4s_ease-in-out]">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-[#1DA077] text-white rounded-xl text-base font-semibold shadow-[0_4px_10px_rgba(29,160,119,0.2)] transition-all duration-300 hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
          >
            {loading ? (
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
            className="text-[#1DA077] font-semibold text-sm hover:text-[#148562] transition-colors inline-flex items-center gap-1"
          >
            <span className="text-lg">←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;