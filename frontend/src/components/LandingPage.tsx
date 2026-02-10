import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1DA077] to-[#0f766e] text-white px-6">
      
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        HireSkill Online Examination Platform
      </h1>

      <p className="max-w-2xl text-center text-lg opacity-90 mb-10">
        Streamline your hiring process with our comprehensive online
        examination platform. Create and manage tests, evaluate candidates,
        and make informed hiring decisions all in one place.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/admin/login")}
          className="px-8 py-3 rounded-2xl bg-white text-[#1DA077] font-semibold shadow-lg hover:scale-105 transition"
        >
          Admin Login
        </button>

        <button
          onClick={() => navigate("/user/login")}
          className="px-8 py-3 rounded-2xl border border-white font-semibold hover:bg-white hover:text-[#1DA077] transition"
        >
          User Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
