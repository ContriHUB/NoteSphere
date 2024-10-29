import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddAnnouncementModal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/announcements/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, content }),
            });
            console.log(response);
            

            if (!response.ok) {
                throw new Error('Failed to add announcement');
            }

            // Clear fields after submission
            setTitle('');
            setContent('');
            setSuccessMessage('Announcement added successfully!'); // Success message
            onClose(); // Close modal after successful submission
        } catch (error) {
            setErrorMessage(error.message); // Set error message
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Announcement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Title" 
                            required 
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Content" 
                            required 
                            className="form-control"
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddAnnouncementModal;