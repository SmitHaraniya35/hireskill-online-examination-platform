import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import testFlowService from '../../../services/testFlow.services'
import type { TestData } from "../../../types/testFlow.types";

const TestEntry: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<TestData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ isError: boolean; message: string }>({
    isError: false,
    message: "",
  });

  useEffect(() => {
    const fetchTest = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await testFlowService.getTestBySlug(slug);
        setTest(response.payload!.test);
      } catch (err: any) {
        setError({
          isError: true,
          message: err.response?.data?.message || "Failed to load test details",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test || !slug) return;

    setSubmitting(true);
    setError({ isError: false, message: "" });

    try {
      const response = await testFlowService.createStudent({ name, email, phone });

      const studentId = response.payload!.studentId;
        
        // Save test start timestamp
      localStorage.setItem("test_start_time", new Date().toISOString());
        
        // Navigate to instruction page with state
      navigate(`/test/${slug}/instruction`, {state: {test,studentId}});
      
    } catch (err: any) {
      setError({
        isError: true,
        message: err.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading test details...</div>
      </div>
    );
  }

  if (error.isError || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow">
          <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Test Link</h1>
          <p className="text-gray-600 mb-4">
            {error.message || "This test link is invalid or has expired."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#1DA077] text-white py-2.5 rounded-lg font-semibold hover:bg-[#148562] transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const expiration = test.expiration_at
    ? new Date(test.expiration_at).toLocaleString()
    : null;

  return (
    <div className="font-mono min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{test.title}</h1>
          <p className="text-gray-500 text-sm">
            Duration: <span className="font-semibold">{test.duration_minutes} minutes</span>
          </p>
          {expiration && (
            <p className="text-gray-500 text-sm">
              Expires at: <span className="font-semibold">{expiration}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1DA077] focus:border-[#1DA077]"
            />
          </div>

          {error.isError && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
              {error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1DA077] text-white py-2.5 rounded-lg font-semibold hover:bg-[#148562] transition disabled:opacity-60"
          >
            {submitting ? "Please wait..." : "Continue to Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestEntry;