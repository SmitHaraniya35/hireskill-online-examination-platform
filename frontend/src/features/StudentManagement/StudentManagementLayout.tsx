import { useState } from "react";
import ImportStudentViaExcel from "./ImportStudentViaExcel";
import StudentsListView from "./StudentListView";
import CreateStudent from "./CreateStudent";
import { Plus, X } from "lucide-react"; // Imported X for consistency

const StudentManagementLayout: React.FC = () => {
  const [modalType, setModalType] = useState<"import" | "create" | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className=" w-full px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 py-8 max-w-screen-2xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Student management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage and view all registered students
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalType("import")}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
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

            <button
              onClick={() => setModalType("create")}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DA077] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#18906b] transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Student
            </button>
          </div>
        </div>
        <div>
          <StudentsListView />
        </div>

        {/* Modal Overlay */}
        {modalType && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setModalType(null)}
          >
            <div className="relative w-full max-w-md animate-modal-in">
              {modalType === "import" ? (
                <>
                  {/* Floating Close Button for Import Modal */}
                  <button
                    onClick={() => setModalType(null)}
                    className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 hover:border-gray-300 shadow-sm transition-all cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <ImportStudentViaExcel onSuccess={() => setModalType(null)} />
                </>
              ) : (
                <CreateStudent
                  onClose={() => setModalType(null)}
                  onSuccess={() => setModalType(null)}
                />
              )}
            </div>
          </div>
        )}

        <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.2s ease-out both; }
      `}</style>
      </div>
    </div>
  );
};

export default StudentManagementLayout;
