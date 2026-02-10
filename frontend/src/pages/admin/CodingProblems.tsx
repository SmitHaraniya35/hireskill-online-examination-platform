import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import codingProblemService from "../../services/codingProblemService";
import './CodingProblem.css';
import AddNewProblem from './AddNewProblem';

const CodingProblem: React.FC = () => {
    const [problems, setProblems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCodingProblem, setSelectedCodingProblem] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchProblems = async () => {
        setLoading(true);
        const res = await codingProblemService.getAllCodingProblem();
        if (res.success) {
            setProblems(res.payload.codingProblemList || []);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProblems(); }, []);

    const handleCreate = () => {
        setSelectedCodingProblem(null);
        setIsEditMode(false);
        setOpenModal(true);
    };

    const handleUpdate = async (uuid: string) => {
        // Fetch specific problem using UUID 'id'
        const res: any = await codingProblemService.getCodingProblem(uuid);

        if (res.success) {
            const rawData = res.payload.codingProblem;
            setIsEditMode(true);
            setSelectedCodingProblem(rawData); 
            setOpenModal(true);
        } else {
            alert("Could not fetch data: " + res.message);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (window.confirm("Are you sure you want to delete this coding problem?")) {
            const res = await codingProblemService.deleteCodingProblem(uuid);
            if (res.success) {
                setProblems(prev => prev.filter(p => p.id !== uuid));
            } else {
                alert(res.message);
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
        <div className="page-container">
            <Navbar />
            <main className="main-container">
                <header className="header">
                    <div>
                        <h1 className="title text-2xl font-bold">Code Management</h1>
                        <p className="subtitle text-gray-500">Manage technical coding problems for assessments.</p>
                    </div>
                    <button onClick={handleCreate} className="bg-[#1DA077] text-white px-6 py-3 border-none rounded-xl font-bold text-base cursor-pointer transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                        + Add New Problem
                    </button>
                </header>

                {loading ? (
                    <div className="loader-container flex justify-center py-20"><div className="loader" /></div>
                ) : (
                    <section className="problem-list grid gap-4 mt-8">
                        {problems.map((problem) => (
                            <article key={problem.id} className="problem-card bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center hover:shadow-md transition-shadow">
                                <div>
                                    <div className="problem-header flex items-center gap-3">
                                        <h3 className="problem-title font-bold text-lg">{problem.title}</h3>
                                        <span className={`badge px-3 py-1 rounded-full text-[10px] font-bold uppercase ${difficultyBadgeClass(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <p className="problem-meta text-sm text-gray-400 mt-1">
                                        <strong>Topic:</strong> {Array.isArray(problem.topic) ? problem.topic.join(', ') : problem.topic}
                                    </p>
                                </div>
                                <div className="actions flex gap-4">
                                    <button onClick={() => handleUpdate(problem.id)} className="text-[#1DA077] font-bold hover:underline">Update</button>
                                    <button onClick={() => handleDelete(problem.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {openModal && (
                    <div className="modal-overlay fixed inset-0 z-[1100] flex justify-center items-start overflow-y-auto bg-black/40 backdrop-blur-sm py-10">
                        <div className="modal-content bg-white w-[90%] max-w-[750px] p-10 rounded-[24px] shadow-2xl relative m-auto">
                            <button className="modal-close absolute top-5 right-5 text-2xl text-gray-400 hover:text-red-500" onClick={() => setOpenModal(false)}>&times;</button>
                            {/* Key prop ensures the form resets correctly */}
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
    );
};

export default CodingProblem;