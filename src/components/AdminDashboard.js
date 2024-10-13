import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from "../context/AuthContext";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [images, setImages] = useState({});
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Image Function
    const fetchImage = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/fetchimagenote/${noteId}`, {
                method: 'GET',
                headers: {
                    'auth-token': token,
                },
            });
            console.log(response);
            
            if (response.ok) {
                const blob = await response.blob();
                console.log(blob);
                
                const url = URL.createObjectURL(blob);
                setImages(prev => ({ ...prev, [noteId]: url }));
            } else {
                // No image found or error
                setImages(prev => ({ ...prev, [noteId]: null }));
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            setImages(prev => ({ ...prev, [noteId]: null }));
        }
    };

    // Fetch All Notes
    useEffect(() => {
        const fetchAllNotes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/notes', {
                    headers: {
                        'auth-token': token,
                    },
                });
                setNotes(res.data);
                // Fetch images for each note
                res.data.forEach(note => {
                    fetchImage(note._id);
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch notes');
                setLoading(false);
            }
        };

        if (token) {
            fetchAllNotes();
        } else {
            setError('No authentication token found');
            setLoading(false);
        }
    }, [token]);

    // Filtered Notes based on Search and Tag
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.tag.toLowerCase().includes(searchTerm.toLowerCase()) 
        return matchesSearch ;
    });

    // Prepare Data for Bar Chart: Number of Notes per Tag
    const tags = Array.from(new Set(notes.map(note => note.tag)));
    const notesPerTag = tags.map(tag => notes.filter(note => note.tag === tag).length);

    // Prepare Data for Pie Chart: Notes Distribution by User
    const users = Array.from(new Set(notes.map(note => note.user.name)));
    const notesPerUser = users.map(user => notes.filter(note => note.user.name === user).length);
    
    const pieColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        // Add more colors if needed
    ];

    if (loading) return <p className="text-center mt-3">Loading notes...</p>;
    if (error) return <p className="text-center mt-3 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            
            {/* Header with Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded mb-4 md:mb-0"
                />
            
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map(note => (
                        <div key={note._id} className="border rounded p-4 shadow bg-white">
                            <h3 className="text-xl font-semibold">{note.title}</h3>
                            <p className="mt-2">{note.description}</p>
                            <p className="mt-2 text-sm text-gray-600">Tag: {note.tag}</p>
                            <p className="mt-2 text-sm text-gray-600">Date: {new Date(note.date).toLocaleString()}</p>
                            <p className="mt-2 text-sm text-gray-600">User: {note.user.name} ({note.user.email})</p>
                            {images[note._id] && (
                                <img 
                                    src={images[note._id]} 
                                    alt="Note" 
                                    className="mt-2 w-full h-auto rounded"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Statistics */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mt-4 mb-2">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bar Chart: Number of Notes per Tag */}
                    <div className="bg-white p-4 rounded shadow">
                        <Bar
                            data={{
                                labels: tags,
                                datasets: [
                                    {
                                        label: '# of Notes',
                                        data: notesPerTag,
                                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                        borderColor: 'rgba(54, 162, 235, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Number of Notes per Tag',
                                    },
                                },
                            }}
                        />
                    </div>
                    
                    {/* Pie Chart: Notes Distribution by User */}
                    <div className="bg-white p-4 rounded shadow">
                        <Pie
                            data={{
                                labels: users,
                                datasets: [
                                    {
                                        label: '# of Notes',
                                        data: notesPerUser,
                                        backgroundColor: pieColors,
                                        borderColor: 'rgba(255, 255, 255, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Notes Distribution by User',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AdminDashboard;
