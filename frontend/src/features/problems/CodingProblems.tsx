import React, { useEffect, useState } from "react";
import codingProblemService from "../../services/codingProblem.services";
import AddNewProblem from "./AddNewProblem";
import Edit from "../../assets/Edit.svg";
import Delete from "../../assets/Delete.svg";
import type { CodingProblemData } from "../../types/codingProblem.types";
import { toast } from "react-toastify";
import ProblemCardSkeleton from "../../skeleton/ProblemCardSkeleton";

type ViewMode = "list" | "form";

const CodingProblem: React.FC = () => {
  const [codingProblemList, setCodingProblemList] = useState<
    CodingProblemData[] | undefined
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [
    selectedCodingProblemWithTestCases,
    setSelectedCodingProblemWithTestCases,
  ] = useState<CodingProblemData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await codingProblemService.getAllCodingProblems();
      setCodingProblemList(res.payload?.codingProblemList);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = () => {
    setSelectedCodingProblemWithTestCases(null);
    setIsEditMode(false);
    setCurrentView("form");
  };

  const handleUpdate = async (uuid: string) => {
    setFormLoading(true);
    try {
      const res =
        await codingProblemService.getCodingProblemWithTestCases(uuid);
      setIsEditMode(true);
      setSelectedCodingProblemWithTestCases(
        res.payload!.codingProblemWithTestCases!,
      );
      setCurrentView("form");
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (
      window.confirm("Are you sure you want to delete this coding problem?")
    ) {
      try {
        await codingProblemService.deleteCodingProblem(uuid);
        toast.success("Problem Deleted Successfully!");
        setCodingProblemList((prev) =>
          prev ? prev.filter((p) => p.id !== uuid) : [],
        );
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(err.response.data.message);
      }
    }
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedCodingProblemWithTestCases(null);
    setIsEditMode(false);
  };

  const handleFormSuccess = () => {
    fetchProblems();
    handleBackToList();
  };

  const difficultyBadgeClass = (difficulty?: string) => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Render list view
  const renderListView = () => (
    <>
      <header className="flex justify-between items-center mb-8 font-mono">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Code Management</h1>
          <p className="text-gray-500 mt-1">
            Manage technical coding problems for assessments.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-[#1DA077] text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50"
        >
          + Add New Problem
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProblemCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <section className="flex flex-col gap-4 mt-8 font-mono">
          {codingProblemList && codingProblemList.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No problems found. Click "Add New Problem" to create one.
            </div>
          ) : (
            codingProblemList!.map((problem) => (
              <article
                key={problem.id}
                className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-gray-800">
                      {problem.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${difficultyBadgeClass(
                        problem.difficulty,
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    <strong>Topic:</strong>{" "}
                    {Array.isArray(problem.topic)
                      ? problem.topic.join(", ")
                      : problem.topic}
                  </p>
                </div>

                <div className="flex gap-5">
                  <button
                    onClick={() => handleUpdate(problem.id!)}
                    disabled={formLoading}
                    className="disabled:opacity-50"
                  >
                    <img
                      src={Edit}
                      className="cursor-pointer w-5 h-5 hover:scale-110 transition"
                      alt="Edit"
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(problem.id!)}
                    disabled={formLoading}
                    className="disabled:opacity-50"
                  >
                    <img
                      src={Delete}
                      className="cursor-pointer w-5 h-5 hover:scale-110 transition"
                      alt="Delete"
                    />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </>
  );

  // Render form view
  const renderFormView = () => (
    <div className="relative">
      <button
        onClick={handleBackToList}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="cursor-pointer">Back to List</span>
      </button>

      {formLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
        </div>
      ) : (
        <AddNewProblem
          key={selectedCodingProblemWithTestCases?.id || "new"}
          closeModal={handleBackToList}
          refreshLinks={handleFormSuccess}
          editData={selectedCodingProblemWithTestCases}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#f5f6f8]">
        <main className="max-w-[900px] mx-auto p-6">
          {currentView === "list" ? renderListView() : renderFormView()}
        </main>
      </div>
    </>
  );
};

export default CodingProblem;
