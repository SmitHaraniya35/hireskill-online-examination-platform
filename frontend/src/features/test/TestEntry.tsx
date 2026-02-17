import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import testService from "../../services/testFlowService";

const TestEntry: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [testError, setTestError] = useState<string | null>(null);
  const [test, setTest] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const res = await testService.getTestBySlug(slug);

        if (res?.success && res.payload?.test) {
          setTest(res.payload.test);
          setTestError(null);
        } else {
          setTestError(res?.message || "Invalid or expired test link.");
        }
      } catch (err) {
        console.error(err);
        setTestError("Unable to fetch test. Please try again later.");
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
    try {
      const res = await testService.createStudent({ name, email, phone });

      // Try to extract studentId from several possible response shapes
      const studentId =
        res?.payload?.id ||
        res?.payload?.studentId ||
        res?.payload?.student?.id ||
        res?.id ||
        res?.studentId ||
        res?.student?.id;

      if (!studentId) {
        console.error("Unexpected create-student response:", res);
        alert("Could not create student. Please try again.");
        return;
      }

      // Pass required data to instruction page via location state
      navigate(`/test/${slug}/instruction`, {
        state: {
          test,
          studentId,
        },
      });
    } catch (err: any) {
      console.error("Create-student error:", err);
      const backendMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "Unable to create student. Please check your details and try again.";

      alert(backendMessage);
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

  if (testError || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow">
          <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Test Link</h1>
          <p className="text-gray-600 mb-4">
            {testError || "This test link is invalid or has expired."}
          </p>
        </div>
      </div>
    );
  }

  const expiration = test.expiration_at
    ? new Date(test.expiration_at).toLocaleString()
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

