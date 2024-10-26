import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AddAnnouncementModal from '../modals/AddAnnouncementModal';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const socket = io('http://localhost:5000');

        // Listen for initial announcements
        socket.on('initialAnnouncements', (initialData) => {
            setAnnouncements(initialData);
        });

        // Listen for new announcements
        socket.on('announcement', (newAnnouncement) => {
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        });

        // Listen for deleted announcements
        socket.on('deleteAnnouncement', (announcementId) => {
            setAnnouncements(prev => prev.filter(announcement => announcement._id !== announcementId));
        });

        return () => socket.disconnect();
    }, []);

    const handleAddAnnouncement = () => {
        setShowModal(true);
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            const response = await fetch(`/api/announcements/${announcementId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete announcement');
            }
        } catch (error) {
            setErrorMessage(error.message); // Set error message
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Announcements</h2>

            {/* Add Announcement Button */}
            <button 
                className="btn btn-primary mb-4" 
                onClick={handleAddAnnouncement}
            >
                Add Announcement
            </button>

            {showModal && (
                <AddAnnouncementModal onClose={() => setShowModal(false)} />
            )}

            {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display error message */}

            {/* Announcements List */}
            {announcements.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No announcements available.
                </div>
            ) : (
                <div className="list-group">
                    {announcements.map((announcement) => (
                        <div key={announcement._id} className="list-group-item border rounded mb-2 shadow-sm">
                            <h5 className="mb-1">{announcement.title}</h5>
                            <p className="mb-1">{announcement.content}</p>
                            <small className="text-muted">Posted on: {new Date(announcement.createdAt).toLocaleString()}</small>
                            {/* Delete Button */}
                            <button 
                                className="btn btn-danger btn-sm mt-2"
                                onClick={() => handleDeleteAnnouncement(announcement._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Announcements;