import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import codingProblemService from "../../services/codingProblemService";
import './CodingProblem.css';

const CodingProblem: React.FC = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProblems = async () => {
        setLoading(true);
        const res = await codingProblemService.getAllCodingProblem();

        if (res.success) {
            setProblems(res.payload.codingProblemList || []);
        } else {
            console.error("Fetch error:", res.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this coding problem?")) {
            const res = await codingProblemService.deleteCodingProblem(id);
            if (res.success) {
                setProblems(prev => prev.filter(p => p._id !== id && p.id !== id));
            } else {
                alert(res.message);
            }
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <main className="main-container">

                {/* Header */}
                <header className="header">
                    <div>
                        <h1 className="title">Code Management</h1>
                        <p className="subtitle">Manage technical coding problems for assessments.</p>
                    </div>

                    <button
                        onClick={() => navigate('/admin/coding-problem/add-new-problem')}
                        className="btn btn-primary"
                    >
                        + Add New Problem
                    </button>
                </header>

                {/* Loading */}
                {loading && (
                    <div className="loader-container">
                        <div className="loader" />
                    </div>
                )}

                {/* Problems List */}
                {!loading && problems.length > 0 && (
                    <section className="problem-list">
                        {problems.map((problem) => (
                            <article key={problem._id || problem.id} className="problem-card">

                                <div>
                                    <div className="problem-header">
                                        <h3 className="problem-title">{problem.title}</h3>

                                        <span className={`badge ${
                                            problem.difficulty?.toLowerCase() === 'easy'
                                                ? 'easy'
                                                : problem.difficulty?.toLowerCase() === 'medium'
                                                    ? 'medium'
                                                    : 'hard'
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>

                                    <p className="problem-meta">
                                        <strong>Topic:</strong>{" "}
                                        {Array.isArray(problem.topic) ? problem.topic.join(', ') : problem.topic}
                                        {" • "}
                                        <strong>Created:</strong>{" "}
                                        {new Date(problem.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="actions">
                                    <button
                                        onClick={() => navigate(`/admin/coding-problem/update/${problem.id}`)}
                                        className="btn btn-warning"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() => handleDelete(problem.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {/* Empty State */}
                {!loading && problems.length === 0 && (
                    <section className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h2>No Problems Found</h2>
                        <p>Create your first coding challenge to get started.</p>

                        <button
                            onClick={() => navigate('/admin/coding-problem/add-new-problem')}
                            className="btn btn-primary"
                        >
                            Add First Problem
                        </button>
                    </section>
                )}
            </main>
        </div>
    );
};

export default CodingProblem;
