import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollResults = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/polls');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPolls(data);
        } catch (error) {
            console.error("Error fetching poll results:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePoll = async (pollId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/polls/del/${pollId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete poll');
            }
            // Update state by filtering out the deleted poll
            setPolls(prevPolls => prevPolls.filter(poll => poll._id !== pollId));
            //console.log('Poll deleted successfully');
        } catch (error) {
            console.error("Error deleting poll:", error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) return <p className="text-center">Loading poll results...</p>;

    return (
        <div className="container mx-auto p-4">
            {polls.length > 0 ? (
                <div className="flex flex-wrap -mx-2">
                    {polls.map((poll) => (
                        <div key={poll._id} className="w-full md:w-1/2 p-2">
                            <div className="bg-white shadow-md rounded-lg p-4">
                                <h4 className="text-lg font-bold mb-2">{poll.question}</h4>
                                <Bar
                                    data={{
                                        labels: poll.options.map(option => option.text),
                                        datasets: [{
                                            label: 'Votes',
                                            data: poll.options.map(option => option.votes),
                                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                                <button
                                    onClick={() => deletePoll(poll._id)}
                                    className="mt-4 text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No polls available to fetch results.</p>
            )}
        </div>
    );
};

export default PollResults;
