import React, { useState, useCallback, useMemo } from "react";
import studentAttemptService from "../../../services/studentAttempt.services";
import StudentAttemptListSkeleton from "../../../skeleton/StudentAttemptListSkeleton";
import CustomTable from "../../../components/CustomTable";
import type { GetStudentAttempts } from "../../../types/studentAttempts.types";


const StudentAttempts: React.FC<{ testId: string; onBack: () => void }> = ({ testId, onBack }) => {
  const [studentAttempts, setStudentAttempts] = useState<GetStudentAttempts[]>([]);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAttempts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await studentAttemptService.getStudentAttemptsDetails(testId);
      setStudentAttempts(res.payload!.students);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setAttemptLoading(false);
      setIsRefreshing(false);
    }
  }, [testId]);

  React.useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const columns = useMemo(() => [
    {
      header: "Name",
      accessor: (row: GetStudentAttempts) => (
        <span className="font-medium text-gray-900 capitalize">{row.student?.name}</span>
      ),
    },
    { header: "Email", accessor: (row: GetStudentAttempts) => row.student?.email },
    { header: "Phone", accessor: (row: GetStudentAttempts) => row.student?.phone },
    { header: "Problem", accessor: (row: GetStudentAttempts) => row.problem?.title },
    { header: "Difficulty", accessor: (row: GetStudentAttempts) => row.problem?.difficulty },
    {
      header: "Started",
      accessor: (row: GetStudentAttempts) => (
        <div className="text-xs">
          <div>{new Date(row.started_at).toLocaleDateString()}</div>
          <div className="text-gray-400">{new Date(row.started_at).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      header: "Expiray",
      accessor: (row: GetStudentAttempts) => (
        <div className="text-xs">
          <div>{new Date(row.expires_at).toLocaleDateString()}</div>
          <div className="text-gray-400">{new Date(row.started_at).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: GetStudentAttempts) => (row.is_active ? "Active" : "Inactive")
    },
    {
      header: "Submitted",
      accessor: (row: GetStudentAttempts) => (
        <span className={`px-3 py-1 rounded-md text-xs border ${
          row.is_submitted 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-yellow-50 text-yellow-700 border-yellow-200"
        }`}>
          {row.is_submitted ? "Submitted" : "Pending"}
        </span>
      ),
    },
  ], []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Attempts</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchAttempts(true)} 
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button onClick={onBack} className="px-4 py-2 bg-[#1DA077] text-white rounded-lg hover:bg-[#168a65]">
            ← Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {attemptLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => <StudentAttemptListSkeleton key={i} />)}
          </div>
        ) : (
          <CustomTable<GetStudentAttempts> 
            data={studentAttempts} 
            columns={columns as any} 
            pageSize={8} 
          />
        )}
      </div>
    </div>
  );
};

export default StudentAttempts;