import React, { useState } from "react";
import * as XLSX from "xlsx";
import StudentService from "../../services/student.services";
import CreateStudentManually from "./CreateStudentManually";

const StudentManagement: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Store selected file only
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsError(false);
    setSuccessMsg("");
  };

  // Step 2: Upload when button clicked
  const handleUpload = async () => {
    if (!selectedFile) {
      setIsError(true);
      setErrorMsg("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(workSheet);

        const formattedData = rawData.map((row: any) => ({
          name: String(row["Full Name"]),
          email: String(row["DDU Email Address"]),
          phone: String(row["Mobile Number"]),
          college: String(row["College Name"]),
        }));

        await StudentService.excelImport({
          studentList: formattedData,
        });

        setSuccessMsg("Students imported successfully ✅");
        setSelectedFile(null);
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(
          err?.response?.data?.message || "Failed to upload students",
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

 return (
  <div className="min-h-screen flex justify-between bg-gray-100 p-6">
    <div className="w-full max-w-md max-h-80 bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Import Students via Excel
      </h2>

      {isError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm break-words">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm break-words">
          {successMsg}
        </div>
      )}

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mt-6 block w-full text-sm text-gray-600
        file:mr-4 file:py-2 file:px-4
        file:rounded-xl file:border-0
        file:text-sm file:font-semibold
        file:bg-green-100 file:text-green-700
        hover:file:bg-green-200
        cursor-pointer"
      />

      {selectedFile && (
        <p className="text-sm text-gray-500 mt-3 break-words">
          Selected: {selectedFile.name}
        </p>
      )}

      <div className="flex justify-center mt-10">
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="bg-[#1DA077] text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Upload File"}
        </button>
      </div>

    </div>

    <CreateStudentManually />
  </div>
);
};

export default StudentManagement;