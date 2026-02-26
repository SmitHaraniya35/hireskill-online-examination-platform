import React, { useState, useCallback } from "react";
import studentAttemptService from "../../../services/studentAttempt.services";
import StudentAttemptListSkeleton from "../../../skeleton/StudentAttemptListSkeleton";

interface StudentAttemptsProps {
  testId: string;
  onBack: () => void;
}

const StudentAttempts: React.FC<StudentAttemptsProps> = ({ testId, onBack }) => {
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAttempts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    }
    
    try {
      const res = await studentAttemptService.getStudentAttemptsDetails(testId);
      setStudentAttempts(res.payload!.students);
      setIsError(false); 
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to load attempts");
    } finally {
      setAttemptLoading(false);
      setIsRefreshing(false);
    }
  }, [testId]);

  React.useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const handleRefresh = () => {
    fetchAttempts(true);
  };

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Attempts</h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-[#1DA077] text-white rounded-xl hover:bg-[#148562]"
            >
              ← Back
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center text-red-500">
          ⚠️ {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Attempts</h1>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={attemptLoading || isRefreshing}
            className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#1DA077] text-white rounded-xl hover:bg-[#148562]"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {attemptLoading ? (
          <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudentAttemptListSkeleton key={index} />
          ))}
        </div>
        ) : studentAttempts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No student attempts found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Problem</th>
                <th className="p-3 text-left">Difficulty</th>
                <th className="p-3 text-left">Started</th>
                <th className="p-3 text-left">Expires</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Submitted</th>
              </tr>
            </thead>

            <tbody>
              {studentAttempts.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.student?.name}</td>
                  <td className="p-3">{a.student?.email}</td>
                  <td className="p-3">{a.student?.phone}</td>
                  <td className="p-3">{a.problem?.title}</td>
                  <td className="p-3">{a.problem?.difficulty}</td>
                  <td className="p-3">
                    {new Date(a.started_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {new Date(a.expires_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {a.is_active ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        a.is_submitted
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.is_submitted ? "Submitted" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Optional: Show last updated timestamp */}
        {!attemptLoading && studentAttempts.length > 0 && (
          <div className="p-3 text-xs text-gray-400 border-t text-right">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttempts;