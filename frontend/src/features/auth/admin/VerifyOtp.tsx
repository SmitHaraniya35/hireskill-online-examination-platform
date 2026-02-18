import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../../services/authAdminService";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("forgot_email");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Session expired. Please try forgot password again.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await authService.verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      localStorage.removeItem("forgot_otp");
      navigate("/admin/reset-password");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#f0fdf4,_#ffffff)] font-mono p-4">
      <div className="bg-white p-10 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(29,160,119,0.1)] w-full max-w-[420px] animate-[slideUp_0.6s_ease-out]">
        
        <div className="text-center mb-8">
          <div className="w-[50px] h-[50px] bg-[#1DA077] text-white rounded-[12px] flex items-center justify-center text-2xl font-bold mx-auto mb-6">
            📩
          </div>
          <h2 className="text-[1.75rem] text-gray-900 font-bold mb-2">Verify OTP</h2>
          <p className="text-gray-500 text-[0.95rem]">
            We've sent a code to <br />
            <strong className="text-gray-800 break-all">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-3 text-center text-gray-700">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              className={`w-full p-4 border rounded-xl transition-all duration-200 bg-gray-50 focus:outline-none focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 text-center text-2xl font-bold tracking-[8px] ${
                error ? "border-red-200" : "border-gray-200"
              }`}
              onChange={(e) => {
                // Allow only numbers
                const val = e.target.value.replace(/[^0-9]/g, "");
                setOtp(val);
                setError("");
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-[10px_14px] rounded-lg text-[0.85rem] flex items-center gap-2 border border-red-100 animate-[shake_0.4s_ease-in-out]">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || otp.length < 6}
            className="w-full p-4 bg-[#1DA077] text-white rounded-xl text-base font-semibold shadow-[0_4px_10px_rgba(29,160,119,0.2)] transition-all duration-300 hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
          >
            {loading ? (
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
            className="text-[#1DA077] font-semibold text-sm hover:text-[#148562] transition-colors cursor-pointer"
          >
            Resend Code?
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;