import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./Login.css";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || localStorage.getItem("forgot_email");

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
      // OTP verified successfully on backend
      localStorage.removeItem("forgot_otp");
      navigate("/admin/reset-password");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon">📩</div>
          <h2>Verify OTP</h2>
          <p>
            We've sent a code to <strong>{email}</strong>
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label>Enter 6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              style={{
                textAlign: "center",
                letterSpacing: "8px",
                fontSize: "1.5rem",
              }}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
