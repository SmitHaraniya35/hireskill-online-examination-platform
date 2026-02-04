import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import "./Login.css";

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon">H</div>
          <h2>Forgot Password?</h2>
          <p>Enter your admin email to receive a 6-digit code.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="admin@hireskill.com"
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div
          className="form-options"
          style={{ justifyContent: "center", marginTop: "1.5rem" }}
        >
          <Link to="/admin/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
