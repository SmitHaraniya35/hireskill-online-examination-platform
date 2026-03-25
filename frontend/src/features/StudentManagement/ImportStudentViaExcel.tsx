import React, { useState } from "react";
import * as XLSX from "xlsx";
import StudentService from "../../services/student.services";
import { toast } from "react-toastify";

const ImportStudentViaExcel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Store selected file only
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsError(false);
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

        toast.success("Students imported successfully ✅");
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
  <div className="bg-white shadow-xl rounded-2xl border-inherit p-8 h-fit">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Import Students
    </h2>

    <p className="text-gray-500 text-sm mb-6">
      Upload an Excel file to bulk import students.
    </p>

    {isError && (
      <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
        ⚠️ {errorMsg}
      </div>
    )}

    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-600
      file:mr-4 file:py-2 file:px-4
      file:rounded-xl file:border-0
      file:text-sm file:font-semibold
      file:bg-green-100 file:text-green-700
      hover:file:bg-green-200
      cursor-pointer"
    />

    {selectedFile && (
      <p className="text-sm text-gray-500 mt-3 wrap-break-word">
        Selected: {selectedFile.name}
      </p>
    )}

    <button
      onClick={handleUpload}
      disabled={isLoading}
      className="w-full mt-8 bg-[#1DA077] text-white py-3 rounded-2xl
      font-semibold text-lg shadow-md
      hover:bg-[#148562] hover:-translate-y-0.5
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Uploading..." : "Upload File"}
    </button>
  </div>
);
}
export default ImportStudentViaExcel;