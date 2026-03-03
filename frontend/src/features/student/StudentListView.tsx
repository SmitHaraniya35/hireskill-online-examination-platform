import { useEffect, useState } from "react";
import StudentService from "../../services/student.services";
import type { Student } from "../../types/student.types";
import CustomTable from "../../components/shared/CustomTable"; 
import StudentManagementListSkeleton from "../../skeleton/StudentManagementListSkeleton";

const StudentsListView: React.FC = () => {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl border-inherit p-8 h-fit">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        </div>

        {isError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
            {[...Array(10)].map((_, i) => <StudentManagementListSkeleton key={i} />)}
          </div>
          ) : (
            <CustomTable 
              data={studentsList as (Student & { id: string | number })[]} 
              columns={columns} 
              pageSize={10} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsListView;