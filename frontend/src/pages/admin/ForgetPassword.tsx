import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Reset link sent to:", email);
        setIsSubmitted(true);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {!isSubmitted ? (
                    <>
                        <div className="login-header">
                            <h2>Forgot Password?</h2>
                            <p>Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        <form className="admin-login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Admin Email</label>
                                <input 
                                    type="email" 
                                    placeholder="admin@hireskill.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="admin-login-btn">
                                Send Reset Link
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-state" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📩</div>
                        <h3>Check your email</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: '1rem 0' }}>
                            We have sent a password recover link to <strong>{email}</strong>
                        </p>
                        <button 
                            className="admin-login-btn" 
                            onClick={() => setIsSubmitted(false)}
                            style={{ background: '#f0f0f0', color: '#333' }}
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="form-options" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                    <Link to="/admin/login" style={{ textDecoration: 'none', fontWeight: '600' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;