import { useState } from "react";
import ImportStudentViaExcel from "./ImportStudentViaExcel";
import StudentsListView from "./StudentListView";


const StudentManagementLayout: React.FC = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-8">
      {/* Header Row */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage and view all registered students
          </p>
        </div>

        {/* Import Button */}
        <button
          onClick={() => setIsImportOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DA077] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#18906b] hover:shadow-md transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3"
            />
          </svg>
          Import Students
        </button>
      </div>

      {/* Centered Student List */}
      <div className="max-w-5xl mx-auto">
        <StudentsListView />
      </div>

      {/* Import Modal Overlay */}
      {isImportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsImportOpen(false);
          }}
        >
          <div className="relative w-full max-w-md mx-4 animate-modal-in">
            {/* Close Button */}
            <button
              onClick={() => setIsImportOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 hover:border-gray-300 shadow-sm transition-all"
              title="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <ImportStudentViaExcel onSuccess={() => setIsImportOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal animation */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default StudentManagementLayout;