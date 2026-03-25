import { useEffect, useState } from "react";
import StudentService from "../../services/student.services";
import type { Student } from "../../types/student.types";
import CustomTable from "../../components/shared/CustomTable";
import StudentManagementListSkeleton from "../../skeleton/StudentManagementListSkeleton";
import View from "../../assets/View.svg";
import Edit from "../../assets/Edit.svg";
import { useNavigate } from "react-router-dom";
import { IconView, IconEdit } from "../../components/icons";

const StudentsListView: React.FC = () => {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );
  const navigate = useNavigate();

  const handleDeleteSelected = async () => {
    // your delete logic here
    console.log("Delete these IDs:", Array.from(selectedIds));
  };

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

  useEffect(() => {
    fetchStudentsList();
  }, []);

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Student,
      sortable: true,
    },
    {
      header: "Email",
      accessor: "email" as keyof Student,
      sortable: true,
    },
    {
      header: "Phone",
      accessor: "phone" as keyof Student,
      sortable: false,
    },
    {
      header: "College",
      accessor: "college" as keyof Student,
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (row: Student) => (
        <div className="flex items-center gap-2">
          {/* View Button */}
          <button
            onClick={() =>
              navigate(`/admin/student-management/students/${row.id}`)
            }
            title="View student details"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#f0fdf4] hover:border-[#bbf7d0] hover:text-[#16a34a] transition-all duration-150"
          >
            <IconView className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          <button
            // onClick={() => handleEdit(row.id!)}
            title="Edit student"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#eff6ff] hover:border-[#bfdbfe] hover:text-blue-600 transition-all duration-150"
          >
            <IconEdit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl border-inherit p-8 h-fit">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Directory
          </h1>

          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
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
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>

        {isError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default StudentsListView;
