import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import StudentService from "../../services/student.services";
import { toast } from "react-toastify";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

interface ImportStudentViaExcelProps {
  onSuccess?: () => void;
}

const ImportStudentViaExcel: React.FC<ImportStudentViaExcelProps> = ({
  onSuccess,
}) => {
  useLockBodyScroll();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleTemplate = () => {
    // 1. Define the headers as an array of objects
    const sampleData = [
      {
        "Full Name": "John Doe",
        "Email Address": "john.doe@ddu.ac.in",
        "Mobile Number": "9876543210",
        "College Name": "Dharmsinh Desai University",
      },
    ];

    // 2. Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // 3. Generate buffer and trigger download
    XLSX.writeFile(workbook, "student_import_template.xlsx");
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsError(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

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
          email: String(row["Email Address"]),
          phone: String(row["Mobile Number"]),
          college: String(row["College Name"]),
        }));

        await StudentService.excelImport({ studentList: formattedData });

        toast.success("Students imported successfully");
        setSelectedFile(null);
        onSuccess?.();
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(
          err?.response?.data?.message || "Failed to upload students"
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-emerald-600"
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
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Import Students
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Upload an Excel file to bulk import
          </p>
        </div>
      </div>

      {/* --- NEW DOWNLOAD BUTTON --- */}
        <button
          onClick={downloadSampleTemplate}
          className="flex mb-5 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50/50 text-emerald-700 text-xs font-medium hover:bg-emerald-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Template
        </button>

      {/* Error */}
      {isError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100 flex items-start gap-2">
          <svg
            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
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

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-emerald-400 bg-emerald-50/60"
              : selectedFile
              ? "border-emerald-300 bg-emerald-50/30"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile ? (
          <>
            {/* File icon */}
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 break-all">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB ·{" "}
                <span
                  className="text-emerald-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Change file
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Drop your file here, or{" "}
                <span className="text-emerald-600">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports .xlsx and .xls files
              </p>
            </div>
          </>
        )}
      </div>

      {/* Template hint */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Columns needed:{" "}
        <span className="font-medium text-gray-500">
          Full Name, Email Address, Mobile Number, College Name
        </span>
      </p>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isLoading || !selectedFile}
        className="w-full mt-5 flex items-center justify-center gap-2 bg-[#1DA077] text-white py-2.5 rounded-xl font-medium text-sm shadow-sm hover:bg-[#18906b] hover:shadow transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Uploading…
          </>
        ) : (
          <>
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
            Upload & Import
          </>
        )}
      </button>
    </div>
  );
};

export default ImportStudentViaExcel;