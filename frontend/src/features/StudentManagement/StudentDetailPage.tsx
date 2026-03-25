import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentService from "../../services/student.services";
import type { Student } from "../../types/student.types";
import { ArrowLeft } from "lucide-react";

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await StudentService.getStudentById(id!);
        setStudent(response.payload!.student);
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(err.response?.data?.message || "Failed to fetch student");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const InfoField = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-800 font-medium">
        {value ?? (
          <span className="text-gray-300 font-normal">Not provided</span>
        )}
      </p>
    </div>
  );

  const LinkField = ({
    label,
    url,
  }: {
    label: string;
    url?: string | null;
  }) => (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#1DA077] hover:underline font-medium break-all"
        >
          {url}
        </a>
      ) : (
        <p className="text-sm text-gray-300">Not provided</p>
      )}
    </div>
  );

  //   return (
  //     <div className="min-h-screen bg-[#f5f6f8]">
  //       <div className="max-w-4xl mx-auto px-6 py-8">

  //         {/* Header */}
  //         <div className="flex items-center justify-between mb-8">
  //           <button
  //             onClick={() => navigate(-1)}
  //             className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
  //           >
  //             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //               <path d="M19 12H5M12 19l-7-7 7-7" />
  //             </svg>
  //             Back
  //           </button>
  //         </div>

  //         {/* Profile Header Card */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
  //           <div className="flex items-center gap-5">
  //             {/* Avatar */}
  //             <div className="w-16 h-16 rounded-full bg-[#1DA077]/10 flex items-center justify-center flex-shrink-0">
  //               <span className="text-2xl font-bold text-[#1DA077]">
  //                 {student.name.charAt(0).toUpperCase()}
  //               </span>
  //             </div>
  //             <div>
  //               <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
  //               <p className="text-sm text-gray-500">{student.email}</p>
  //               <p className="text-sm text-gray-500">{student.phone}</p>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Academic Info */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
  //           <h2 className="text-base font-semibold text-gray-800 mb-5">Academic Information</h2>
  //           <div className="grid grid-cols-2 gap-6">
  //             <InfoField label="College" value={student.college} />
  //             <InfoField label="Degree" value={student.degree} />
  //             <InfoField label="Branch" value={student.branch} />
  //             <InfoField label="Graduation Year" value={student.graduation_year} />
  //           </div>
  //         </div>

  //         {/* Skills */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
  //           <h2 className="text-base font-semibold text-gray-800 mb-5">Skills</h2>
  //           {student.skills ? (
  //             <div className="flex flex-wrap gap-2">
  //               {student.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => (
  //                 <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
  //                   {skill}
  //                 </span>
  //               ))}
  //             </div>
  //           ) : (
  //             <p className="text-sm text-gray-300">No skills provided</p>
  //           )}
  //         </div>

  //         {/* Links */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm">
  //           <h2 className="text-base font-semibold text-gray-800 mb-5">Links & Documents</h2>
  //           <div className="grid grid-cols-1 gap-5">
  //             <LinkField label="LinkedIn" url={student.linkedin_url} />
  //             <LinkField label="GitHub" url={student.github_url} />
  //             <LinkField label="Resume" url={student.resume_url} />
  //           </div>
  //         </div>

  //       </div>
  //     </div>
  //   );

  // Helper component for consistent form-style fields
  const ReadOnlyField = ({ label, value, icon }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          readOnly
          value={value || "Not provided"}
          className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-2.5 ${
            icon ? "pl-10" : "px-4"
          } focus:outline-none cursor-default`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-12">
      {/* Top Navigation Bar */}
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-end">
          <button
              onClick={() => navigate(-1)}
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Profile Header Section */}
        <div className="flex items-center gap-10 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20  rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#4a6b8c] font-bold text-xl flex-shrink-0 shadow-sm border border-blue-50">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {student.name}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {student.email}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {student.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Academic & Personal */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#1DA077] rounded-full"></span>
                Academic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <ReadOnlyField
                  label="College / University"
                  value={student.college}
                  icon={undefined}
                />
                <ReadOnlyField
                  label="Degree Program"
                  value={student.degree}
                  icon={undefined}
                />
                <ReadOnlyField
                  label="Field of Study"
                  value={student.branch}
                  icon={undefined}
                />
                <ReadOnlyField
                  label="Graduation Year"
                  value={student.graduation_year}
                  icon={undefined}
                />
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#1DA077] rounded-full"></span>
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {student.skills ? (
                  student.skills.split(",").map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium rounded-xl text-xs"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No skills added yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Links & Actions */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest">
                Professional Links
              </h3>
              <div className="space-y-4">
                <ReadOnlyField
                  label="LinkedIn"
                  value={student.linkedin_url}
                  icon={
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  }
                />
                <ReadOnlyField
                  label="GitHub"
                  value={student.github_url}
                  icon={
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
