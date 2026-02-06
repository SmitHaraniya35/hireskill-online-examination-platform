import React, { useEffect, useState } from 'react';
import testLinkService from '../services/testLinkService';
import './TestLinkManager.css';
import GenerateNewTest from '../pages/admin/GenerateNewTest';
import Navbar from './Navbar';

const TestLinkManager: React.FC = () => {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleCreate = () => {
        setSelectedTest(null);
        setIsEditMode(false);
        setOpenModal(true);
    }

    const handleUpdate = async (id: string) => {
        const res = await testLinkService.getTestLinkDetails(id);
        
        if (res.success) {
            // Extract the object based on your Postman 'payload' structure
            const rawData = res.payload?.testLink || res.payload;
            
            const normalizedData = {
                ...rawData,
                id: rawData?.id || rawData?._id || id,
                title: rawData?.title || "",
                // Add any other specific fields your backend uses
            };

            setIsEditMode(true);
            setSelectedTest(normalizedData);
            setOpenModal(true);
        } else {
            alert("Could not fetch data: " + res.message);
        }
    };


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

    // Soft delete: remove from UI only (data remains in backend)
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this test link?")) {
            // Remove from UI only - backend still has the data
            setLinks(links.filter(link => link._id !== id && link.id !== id));
            alert("Test link removed from your view.");
        }
    };
    

    return (
        <>
            <Navbar/>
                <div className="test-link-container">
                <div className="manager-header">
                    <div>
                        <h1>Test Management</h1>
                        <p>Manage access links for your Hireskill assessments.</p>
                    </div>
                    <button className="create-btn" onClick={handleCreate}>+ Generate New Test</button>
                </div>

                {loading ? (
                    <div className="loader">Loading secure links...</div>
                ) : (
                    <div className="link-list">
                        {links.map((link,index) => (
                            <div key={index} className="link-item-card">
                                <div className="link-details">
                                    <h3>{link.title || "Untitled Exam"}</h3>
                                    <div className="link-meta">
                                        <span className="link-id-badge">Date: {new Date(link.expiration_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                        <span className="link-id-badge">Duration: {link.duration_minutes || 0} mins</span>
                                    </div>
                                </div>
                                <div className="link-actions">
                                    <button className='cursor-pointer' onClick={() => handleUpdate(link.id)}>
                                        Update
                                    </button>
                                    <button onClick={() => handleDelete(link.id)} className="action-btn delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {openModal && (
                            <div className="modal-overlay"> 
                                <div className="modal-content">
                                    <button className='modal-close' onClick={() => setOpenModal(false)}>
                                        &times; 
                                    </button>
                                    <GenerateNewTest 
                                        // This unique key forces the component to remount with the new data
                                        key={selectedTest?.id || 'new'} 
                                        closeModal={() => setOpenModal(false)} 
                                        refreshLinks={loadLinks}
                                        editData={selectedTest}
                                        isEditMode={isEditMode} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
        
    );
};

export default TestLinkManager;