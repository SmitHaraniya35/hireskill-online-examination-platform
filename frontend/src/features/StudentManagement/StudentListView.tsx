import { useEffect, useState } from "react";
import StudentService from "../../services/student.services";
import type { Student } from "../../types/student.types";
import CustomTable from "../../components/shared/CustomTable";
import StudentManagementListSkeleton from "../../skeleton/StudentManagementListSkeleton";
import { useNavigate } from "react-router-dom";
import { IconView, IconEdit } from "../../components/icons";
import { toast } from "react-toastify";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { RefreshCcw, Trash2 } from "lucide-react";

const StudentsListView: React.FC = () => {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  const fetchStudentsList = async () => {
    setIsLoading(true);
    try {
      const response = await StudentService.getAllStudentsList();
      setStudentsList(response.payload!.student);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      toast.warning("Please select at least one student");
      return;
    }

    try {
      const idsArray = Array.from(selectedIds);
      await StudentService.deleteManyStudent(idsArray as string[]);
      toast.success("Students deleted successfully");
      setSelectedIds(new Set());
      fetchStudentsList();
    } catch {
      toast.error("Failed to delete students");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  useEffect(() => {
    fetchStudentsList();
  }, []);

  const columns = [
    {
      header: "Email",
      width: "14%",
      accessor: "email" as keyof Student,
      sortable: true,
    },
    {
      header: "Name",
      width: "14%",
      accessor: "name" as keyof Student,
      sortable: true,
    },
    { header: "Phone", accessor: "phone" as keyof Student, sortable: false },
    {
      header: "College",
      width: "10%",
      accessor: "college" as keyof Student,
      sortable: true,
    },
    {
      header: "Branch",
      width: "7%",
      accessor: "branch" as keyof Student,
      sortable: true,
    },
    {
      header: "Degree",
      width: "10%",
      accessor: "degree" as keyof Student,
      sortable: true,
    },
    {
      header: "Graduation year",
      accessor: "graduation_year" as keyof Student,
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (row: Student) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(`/admin/student-management/students/${row.id}`)
            }
            title="View student details"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-150"
          >
            <IconView className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() =>
              navigate(`/admin/student-management/students/${row.id}?mode=edit`)
            }
            title="Edit student"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150"
          >
            <IconEdit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden max-w-full">
      {/* Error Banner */}
      {isError && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
            />
          </svg>
          {errorMsg}
        </div>
      )}
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Student Directory
            </h2>
            {!isLoading && (
              <p className="text-xs text-gray-400">
                {studentsList.length} student
                {studentsList.length !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchStudentsList()}
          disabled={isLoading}
          className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#1DA077]" : ""}`}
          />
          {isLoading ? "Refreshing…" : "Refresh"}
        </button>

        {/* Bulk Delete — only visible when rows selected */}
        {selectedIds.size > 0 && (
          <button
            onClick={() => setOpenDeleteDialog(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-150"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table / Skeleton */}
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <StudentManagementListSkeleton key={i} />
          ))}
        </div>
      ) : (
        <CustomTable
          data={studentsList as (Student & { id: string | number })[]}
          columns={columns}
          pageSize={10}
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      )}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent
          size="sm"
          className="rounded-2xl border border-gray-100 shadow-lg"
        >
          <AlertDialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-rose-700" strokeWidth={1.8} />
              </div>
              <AlertDialogTitle className="text-[15px] font-medium text-gray-900">
                Delete Students
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="text-[13px] text-gray-500 leading-relaxed">
              Are you sure you want to delete this student(s)? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-1 sm:space-x-0 gap-2">
            <AlertDialogCancel className="h-8 px-4 text-[13px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none m-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="h-8 px-4 text-[13px] font-medium rounded-lg bg-rose-700 hover:bg-rose-800 text-white shadow-none m-0 flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" strokeWidth={2} />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentsListView;
