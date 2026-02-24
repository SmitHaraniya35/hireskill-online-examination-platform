import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    
    const stats = [
        { label: 'Total Exams', count: '12', icon: '📝', color: '#1DA077' },
        { label: 'Active Students', count: '148', icon: '👥', color: '#3b82f6' },
        { label: 'Submissions', count: '85', icon: '📥', color: '#f59e0b' },
        { label: 'Avg. Score', count: '72%', icon: '📊', color: '#10b981' },
    ];

    const recentExams = [
        { id: 1, title: 'React Junior Dev Test', date: '2026-02-01', status: 'Active', participants: 45 },
        { id: 2, title: 'Node.js Backend Basics', date: '2026-01-28', status: 'Completed', participants: 32 },
        { id: 3, title: 'MERN Stack Challenge', date: '2026-01-15', status: 'Completed', participants: 71 },
    ];

    return (
        <>
            <div className="dashboard-container font-mono!">
                <header className="dashboard-header">
                    <h1>Overview</h1>
                    <p>Welcome back! Here's what's happening with Hireskill today.</p>
                </header>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div className="stat-card" key={index}>
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{stat.count}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-content">
                    <div className="table-card">
                        <div className="table-header">
                            <h2>Recent Exams</h2>
                            <button className="view-all-btn">View All</button>
                        </div>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Exam Title</th>
                                    <th>Date Created</th>
                                    <th>Status</th>
                                    <th>Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentExams.map(exam => (
                                    <tr key={exam.id}>
                                        <td><strong>{exam.title}</strong></td>
                                        <td>{exam.date}</td>
                                        <td>
                                            <span className={`status-badge ${exam.status.toLowerCase()}`}>
                                                {exam.status}
                                            </span>
                                        </td>
                                        <td>{exam.participants} Students</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;