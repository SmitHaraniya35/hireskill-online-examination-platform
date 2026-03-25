import ImportStudentViaExcel from "./ImportStudentViaExcel";
import StudentsListView from "./StudentListView";

const StudentManagementLayout: React.FC = () => {
  return (
    <div className="grid mt-7 grid-cols-1 lg:grid-cols-3 gap-4 p-2 ">
      <div className="lg:col-span-1 space-y-4 mt-6">
          <ImportStudentViaExcel />
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl  p-4">
        <StudentsListView />
      </div>
    </div>
  );
};

export default StudentManagementLayout;
