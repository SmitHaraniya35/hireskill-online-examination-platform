// import React from "react";
// import { ArrowLeft } from "lucide-react";
// import type { Student, StudentAttempt, Test } from "../../../types/studentAttempts.types";

// interface HeaderProps {
//   student: Student;
//   test: Test;
//   studentAttempt: StudentAttempt;
//   onBack: () => void;
// }

// const formatDateTime = (iso: string): string => {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   }).replace(",", "");
// };

// const getInitials = (name: string): string =>
//   name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

// const Header: React.FC<HeaderProps> = ({ student, test, studentAttempt, onBack }) => {
//   return (
//     <div className="flex flex-col gap-6 w-full">
//       {/* Back Button and Title */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onBack}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           <ArrowLeft size={20} className="text-gray-600" />
//         </button>
//         <h1 className="text-xl font-semibold text-gray-900">Student Attempt Details</h1>
//       </div>

//       {/* Info Card */}
//       <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center shadow-sm w-full">
//         {/* Left Section: Student Info */}
//         <div className="flex items-center gap-4 min-w-[280px]">
//           <div className="w-14 h-14 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#4a6b8c] font-semibold text-lg flex-shrink-0">
//             {getInitials(student.name)}
//           </div>
//           <div className="flex flex-col">
//             <h2 className="text-[17px] font-semibold text-gray-900">{student.name}</h2>
//             <p className="text-[14px] text-gray-500">{student.email}</p>
//             <p className="text-[14px] text-gray-500">{student.phone}</p>
//           </div>
//         </div>

//         {/* Vertical Divider */}
//         <div className="w-px h-12 bg-gray-100 mx-8" />

//         {/* Middle Section: Test Info */}
//         <div className="flex flex-col flex-1">
//           <h2 className="text-[17px] font-semibold text-gray-900 mb-1">{test.title}</h2>
//           <div className="flex flex-col gap-0.5">
//             <p className="text-[14px] text-gray-400">
//               Started: <span className="text-gray-600">{formatDateTime(studentAttempt.started_at)}</span>
//             </p>
//             <p className="text-[14px] text-gray-400">
//               Submitted: <span className="text-gray-600">{formatDateTime(studentAttempt.finished_at)}</span>
//             </p>
//             <p className="text-[14px] text-gray-400">
//               Expired: <span className="text-gray-600">{formatDateTime(studentAttempt.expires_at)}</span>
//             </p>
//           </div>
//         </div>

//         {/* Right Section: Status Badge */}
//         <div className="flex-shrink-0">
//           {studentAttempt.is_submitted ? (
//             <div className="flex items-center gap-1.5 bg-[#e7f6ec] text-[#1e7e34] px-4 py-1.5 rounded-full border border-[#d3eedd]">
//               <span className="text-xs">✓</span>
//               <span className="text-[13px] font-medium">Submitted</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full border border-yellow-100">
//               <span className="text-[13px] font-medium">● Active</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React from "react";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Calendar,
  Code2,
  Phone,
  Mail,
} from "lucide-react";
import type {
  Student,
  StudentAttempt,
  Test,
} from "../../../types/studentAttempts.types";

interface HeaderProps {
  student: Student;
  test: Test;
  studentAttempt: StudentAttempt;
  onBack: () => void;
}

const formatDateTime = (iso: string): string => {
  if (!iso) return "—";
  return new Date(iso)
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};

const Header: React.FC<HeaderProps> = ({
  student,
  test,
  studentAttempt,
  onBack,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Submission Review
            </h1>
            <p className="text-sm text-gray-500 font-medium">{test.title}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          {studentAttempt.is_submitted ? (
            <div className="flex items-center gap-2 bg-[#ECFDF5] text-[#059669] px-4 py-2 rounded-lg border border-[#A7F3D0]">
              <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Submitted
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                In Progress
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Admin Info Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* 1. Student Identity Section */}
            <div className="col-span-12 lg:col-span-4 flex gap-20 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 items-center">
              <div className="w-30 h-30  rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#4a6b8c] font-bold text-xl flex-shrink-0 shadow-sm border border-blue-50">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              {/* New Details Style: With icons and proper spacing */}
              <div className="flex flex-col justify-center overflow-hidden">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {student.name}
                </h2>
                <div className="space-y-1 mt-1.5">
                  <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                    <Phone size={14} className="text-gray-400" />
                    <span>{student.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Academic & Skills Section */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-y-4 gap-x-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap size={12} /> Institution
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {student.college}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} /> Batch
                </p>
                <p className="text-sm font-semibold text-gray-800  text-[#1DA077]">
                  {student.graduation_year}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} /> Education
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {student.degree} •{" "}
                  <span className="text-gray-500">{student.branch}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Code2 size={12} /> Core Skills
                </p>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {student.skills || "N/A"}
                </p>
              </div>
            </div>

            {/* 3. Timeline Section */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-center space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Started</span>
                <span className="font-semibold text-gray-700">
                  {formatDateTime(studentAttempt.started_at)}
                </span>
              </div>
              <div className="w-full h-px bg-gray-200" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Ended</span>
                <span className="font-semibold text-gray-700">
                  {formatDateTime(studentAttempt.finished_at)}
                </span>
              </div>
              {student.complete_profile && (
                <div className="mt-2 text-center">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase border border-blue-100">
                    Verified Profile
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
