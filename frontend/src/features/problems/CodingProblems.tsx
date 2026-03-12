import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import codingProblemService from "../../services/codingProblem.services";
import Edit from "../../assets/Edit.svg";
import Delete from "../../assets/Delete.svg";
import type { CodingProblemData } from "../../types/codingProblem.types";
import { toast } from "react-toastify";
import ProblemCardSkeleton from "../../skeleton/ProblemCardSkeleton";

const CodingProblem: React.FC = () => {
  const navigate = useNavigate();
  const [codingProblemList, setCodingProblemList] = useState<CodingProblemData[] | undefined>([]);
  const [loading, setLoading] = useState(true);
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
      setErrorMsg(err.response?.data?.message || "Failed to fetch problems");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = () => {
    navigate("/admin/coding-problem/create-coding-problem");
  };

  const handleUpdate = async (uuid: string) => {
    navigate(`/admin/coding-problem/create-coding-problem?id=${uuid}&mode=edit`);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm("Are you sure you want to delete this coding problem?")) {
      try {
        await codingProblemService.deleteCodingProblem(uuid);
        toast.success("Problem Deleted Successfully!");
        setCodingProblemList((prev) =>
          prev ? prev.filter((p) => p.id !== uuid) : []
        );
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(err.response?.data?.message || "Failed to delete problem");
      }
    }
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

  return (
    <>
      <div className="min-h-0.5">
        {isError && errorMsg && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>
      <div className="min-h-screen bg-[#f5f6f8]">
        <main className="max-w-340 mx-auto p-6">
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
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${difficultyBadgeClass(problem.difficulty)}`}
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
        </main>
      </div>
    </>
  );
};

export default CodingProblem;