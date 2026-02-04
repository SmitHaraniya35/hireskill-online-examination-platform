import React, { useEffect, useState } from 'react';
import testLinkService from '../services/testLinkService';
import './TestLinkManager.css';
import GenerateNewTest from '../pages/admin/GenerateNewTest';

const TestLinkManager: React.FC = () => {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const loadLinks = async () => {
        setLoading(true);
        const res = await testLinkService.getAllTestLinks();
        if (res.success) {
            setLinks(res.payload.testList);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this test link?")) {
            const res = await testLinkService.deleteTestLink(id);
            if (res.success) {
                setLinks(links.filter(link => link._id !== id));
            } else {
                alert(res.message);
            }
        }
    };

    return (
        <div className="test-link-container">
            <div className="manager-header">
                <div>
                    <h1>Test Management</h1>
                    <p>Manage access links for your Hireskill assessments.</p>
                </div>
                <button className="create-btn" onClick={() => setOpenModal(true)}>+ Generate New Test</button>
            </div>

            {loading ? (
                <div className="loader">Loading secure links...</div>
            ) : (
                <div className="link-list">
                    {links.map((link,index) => (
                        <div key={index} className="link-item-card">
                            <div className="link-details">
                                <h3>{link.title || "Untitled Exam"}</h3>
                                <span className="link-id-badge">{link.id}</span>
                            </div>
                            <div className="link-actions">
                                <button>
                                    Update
                                </button>
                                <button onClick={() => handleDelete(link.id)} className="action-btn delete">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {openModal && (
                        <div className="modal-overlay"> {/* Fixed typo: model-overlay to modal-overlay */}
                            <div className="modal-content">
                                <button className='modal-close' onClick={() => setOpenModal(false)}>
                                    &times; 
                                </button>
                                <GenerateNewTest 
                                    closeModal={() => setOpenModal(false)} 
                                    refreshLinks={loadLinks} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestLinkManager;