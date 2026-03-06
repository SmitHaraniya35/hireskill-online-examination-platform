// import React, { useState, useCallback, useMemo } from "react";
// import studentAttemptService from "../../../services/studentAttempt.services";
// import StudentAttemptListSkeleton from "../../../skeleton/StudentAttemptListSkeleton";
// import CustomTable from "../../../components/shared/CustomTable";
// import type { GetStudentAttempts } from "../../../types/studentAttempts.types";


// const StudentAttempts: React.FC<{ testId: string; onBack: () => void }> = ({ testId, onBack }) => {
//   const [studentAttempts, setStudentAttempts] = useState<GetStudentAttempts[]>([]);
//   const [attemptLoading, setAttemptLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const fetchAttempts = useCallback(async (showRefreshing = false) => {
//     if (showRefreshing) setIsRefreshing(true);
//     try {
//       const res = await studentAttemptService.getStudentAttemptsDetails(testId);
//       setStudentAttempts(res.payload!.students);
//     } catch (err) {
//       console.error("Failed to fetch", err);
//     } finally {
//       setAttemptLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [testId]);

//   React.useEffect(() => {
//     fetchAttempts();
//   }, [fetchAttempts]);

//   const columns = useMemo(() => [
//     {
//       header: "Name",
//       accessor: (row: GetStudentAttempts) => (
//         <span className="font-medium text-gray-900 capitalize">{row.student?.name}</span>
//       ),
//     },
//     { header: "Email", accessor: (row: GetStudentAttempts) => row.student?.email },
//     { header: "Phone", accessor: (row: GetStudentAttempts) => row.student?.phone },
//     { header: "Problem", accessor: (row: GetStudentAttempts) => row.problem?.title },
//     { header: "Difficulty", accessor: (row: GetStudentAttempts) => row.problem?.difficulty },
//     {
//       header: "Started",
//       accessor: (row: GetStudentAttempts) => (
//         <div className="text-xs">
//           <div>{new Date(row.started_at).toLocaleDateString()}</div>
//           <div className="text-gray-400">{new Date(row.started_at).toLocaleTimeString()}</div>
//         </div>
//       ),
//     },
//     {
//       header: "Expiray",
//       accessor: (row: GetStudentAttempts) => (
//         <div className="text-xs">
//           <div>{new Date(row.expires_at).toLocaleDateString()}</div>
//           <div className="text-gray-400">{new Date(row.started_at).toLocaleTimeString()}</div>
//         </div>
//       ),
//     },
//     {
//       header: "Status",
//       accessor: (row: GetStudentAttempts) => (row.is_active ? "Active" : "Inactive")
//     },
//     {
//       header: "Submitted",
//       accessor: (row: GetStudentAttempts) => (
//         <span className={`px-3 py-1 rounded-md text-xs border ${
//           row.is_submitted 
//             ? "bg-green-50 text-green-700 border-green-200" 
//             : "bg-yellow-50 text-yellow-700 border-yellow-200"
//         }`}>
//           {row.is_submitted ? "Submitted" : "Pending"}
//         </span>
//       ),
//     },
//   ], []);

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Student Attempts</h1>
//         <div className="flex gap-3">
//           <button 
//             onClick={() => fetchAttempts(true)} 
//             disabled={isRefreshing}
//             className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//           >
//             {isRefreshing ? "Refreshing..." : "Refresh"}
//           </button>
//           <button onClick={onBack} className="px-4 py-2 bg-[#1DA077] text-white rounded-lg hover:bg-[#168a65]">
//             ← Back
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         {attemptLoading ? (
//           <div className="p-4 space-y-4">
//             {[...Array(5)].map((_, i) => <StudentAttemptListSkeleton key={i} />)}
//           </div>
//         ) : (
//           <CustomTable<GetStudentAttempts> 
//             data={studentAttempts} 
//             columns={columns as any} 
//             pageSize={8} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentAttempts;


import React, { useState, useCallback, useMemo } from "react";
import studentAttemptService from "../../../services/studentAttempt.services";
import StudentAttemptListSkeleton from "../../../skeleton/StudentAttemptListSkeleton";
import CustomTable from "../../../components/shared/CustomTable";
import type { GetStudentAttempts } from "../../../types/studentAttempts.types";

import View from "../../../assets/viewIcon.svg";
import Delete from "../../../assets/Delete.svg";
import { toast } from "react-toastify";
import submissionService from "../../../services/submission.services";
import { useNavigate } from "react-router-dom";

const StudentAttempts: React.FC<{ testId: string; onBack: () => void }> = ({ testId, onBack }) => {
  const [studentAttempts, setStudentAttempts] = useState<GetStudentAttempts[]>([]);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

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

const handleView = async(id: string) => {
  try{
    const response = await submissionService.getSubmissionByStudentAttemptId(id);
    console.log(response.payload?.submission)
    // Wrap the submission in an object with the correct structure
    navigate(`/submission/${id}`, { 
      state: { 
        submission: response.payload?.submission,
        studentAttemptId: id 
      } 
    });
  }catch(err: any){
    toast.error(err.response.data.message);
  }
};

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this test link?")) return;
    try {
      await studentAttemptService.deleteStudentAttempt(id);
      toast.success("Test Deleted Successfully!");
      setStudentAttempts((prevLinks) => prevLinks!.filter((link) => link.id !== id));
    } catch (err: any) {
      toast.error("Failed to delete test");
    }
  };

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
      header: "Expiry",
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
    {
      header: "Actions",
      accessor: (row: GetStudentAttempts) => (
        <div className="flex items-center gap-4">
          {/* View Icon Button */}
          <img
            src={View}
            alt="View"
            className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => handleView(row.id!)}
            title="View attempt details"
          />
          
          {/* Delete Icon Button */}
          <img
            src={Delete}
            alt="Delete"
            className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => handleDelete(row.id!)}
            title="Delete attempt"
          />
        </div>
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