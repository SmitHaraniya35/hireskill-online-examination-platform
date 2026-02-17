import React, { useEffect, useState } from 'react';
import Navbar from "../../components/shared/Navbar";
import codingProblemService from "../../services/codingProblemService";
import AddNewProblem from './AddNewProblem';
import Edit from '../../assets/Edit.svg';
import Delete from '../../assets/Delete.svg';

export interface CodingProblemWithTestCasesData {
  id?: string;
  title: string;
  difficulty: string;
  topic: string[];
  problem_description: string;
  problem_description_image: string;
  constraint: string;
  input_format: string;
  output_format: string;
  basic_code_layout: string;
  sample_input?: string;
  sample_output?: string;
  testcases?: {
    input: string;
    expected_output: string;
    is_hidden: boolean;
    id?: string;
  }[];
  testCases?: {
    input: string;
    expected_output: string;
    is_hidden: boolean;
    id?: string;
  }[];
}

const CodingProblem: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCodingProblem, setSelectedCodingProblem] =
    useState<CodingProblemWithTestCasesData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProblems = async () => {
    setLoading(true);
    const res = await codingProblemService.getAllCodingProblem();
    if (res.success) {
      setProblems(res.payload.codingProblemList || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = () => {
    setSelectedCodingProblem(null);
    setIsEditMode(false);
    setOpenModal(true);
  };

  const handleUpdate = async (uuid: string) => {
    const res = await codingProblemService.getCodingProblemWithTestCases(uuid);

    if (res.success) {
      const rawData: CodingProblemWithTestCasesData = res.payload;
      setIsEditMode(true);
      setSelectedCodingProblem(rawData);
      setOpenModal(true);
    } else {
      alert('Could not fetch data: ' + res.message);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this coding problem?')) {
      const res = await codingProblemService.deleteCodingProblem(uuid);
      if (res.success) {
        setProblems((prev) => prev.filter((p) => p.id !== uuid));
      } else {
        alert(res.message);
      }
    }
  };

  const difficultyBadgeClass = (difficulty?: string) => {
    switch ((difficulty || '').toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f5f6f8]">
        <main className="max-w-[900px] mx-auto p-6">
          {/* Header */}
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

          {/* Loader */}
          {loading ? (
            <div className="flex justify-center py-20 font-mono">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
            </div>
          ) : (
            <section className="flex flex-col gap-4 mt-8 font-mono">
              {problems.map((problem) => (
                <article
                  key={problem.id}
                  className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-gray-800">{problem.title}</h3>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${difficultyBadgeClass(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-1">
                      <strong>Topic:</strong>{' '}
                      {Array.isArray(problem.topic)
                        ? problem.topic.join(', ')
                        : problem.topic}
                    </p>
                  </div>

                  <div className="flex gap-5">
                    <img
                      src={Edit}
                      onClick={() => handleUpdate(problem.id)}
                      className="cursor-pointer w-5 h-5 hover:scale-110 transition"
                    />

                    <img
                      src={Delete}
                      onClick={() => handleDelete(problem.id)}
                      className="cursor-pointer w-5 h-5 hover:scale-110 transition"
                    />
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Modal */}
          {openModal && (
            <div className="fixed inset-0 z-[1100] flex justify-center items-start overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
              <div className="bg-white w-[90%] max-w-[700px] p-10 rounded-3xl shadow-2xl relative m-auto animate-[slideUp_0.3s_ease-out]">
                <button
                  className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-red-500"
                  onClick={() => setOpenModal(false)}
                >
                  &times;
                </button>

                <AddNewProblem
                  key={selectedCodingProblem?.id || 'new'}
                  closeModal={() => setOpenModal(false)}
                  refreshLinks={fetchProblems}
                  editData={selectedCodingProblem}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tailwind animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default CodingProblem;

