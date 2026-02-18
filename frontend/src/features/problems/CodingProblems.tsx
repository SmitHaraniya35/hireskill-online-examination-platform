
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

type ViewMode = 'list' | 'form';

const CodingProblem: React.FC = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedCodingProblem, setSelectedCodingProblem] =
    useState<CodingProblemWithTestCasesData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
    setCurrentView('form');
  };

  const handleUpdate = async (uuid: string) => {
    setFormLoading(true);
    try {
      const res = await codingProblemService.getCodingProblemWithTestCases(uuid);
      if (res.success) {
        const rawData: CodingProblemWithTestCasesData = res.payload;
        setIsEditMode(true);
        setSelectedCodingProblem(rawData);
        setCurrentView('form');
      } else {
        alert('Could not fetch data: ' + res.message);
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
      alert('Failed to fetch problem data');
    } finally {
      setFormLoading(false);
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

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCodingProblem(null);
    setIsEditMode(false);
  };

  const handleFormSuccess = () => {
    fetchProblems();
    handleBackToList();
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
        <div className="flex justify-center py-20 font-mono">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
        </div>
      ) : (
        <section className="flex flex-col gap-4 mt-8 font-mono">
          {problems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No problems found. Click "Add New Problem" to create one.
            </div>
          ) : (
            problems.map((problem) => (
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
                  <button
                    onClick={() => handleUpdate(problem.id)}
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
                    onClick={() => handleDelete(problem.id)}
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
        <span className='cursor-pointer'>Back to List</span>
      </button>

      {formLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
        </div>
      ) : (
        <AddNewProblem
          key={selectedCodingProblem?.id || 'new'}
          closeModal={handleBackToList}
          refreshLinks={handleFormSuccess}
          editData={selectedCodingProblem}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f5f6f8]">
        <main className="max-w-[900px] mx-auto p-6">
          {currentView === 'list' ? renderListView() : renderFormView()}
        </main>
      </div>
    </>
  );
};

export default CodingProblem;