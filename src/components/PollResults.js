import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollResults = () => {
    const [polls, setPolls] = useState([]);

    const fetchResults = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/polls');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data && data.length > 0) {
                setPolls(data);
            } else {
                console.log("No polls available to fetch results.");
            }
        } catch (error) {
            console.error("Error fetching poll results:", error);
        }
    };

    const deletePoll = async (pollId) => {
        console.log("id is-" + pollId);
        try {
            const response = await fetch(`http://localhost:5000/api/polls/del/${pollId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete poll');
            }
            const data = await response.json();
            console.log('Poll deleted:', data);
            // Fetch results again after deletion to update the list
            fetchResults();
        } catch (error) {
            console.error("Error deleting poll:", error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    return (
        <div>
            {polls.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {polls.map((poll) => (
                        <div key={poll._id} style={{ width: '45%', margin: '10px 0' }}>
                            <h4>question: {poll.question}</h4>
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
                            <button onClick={() => deletePoll(poll._id)} style={{ marginTop: '10px', color: 'red' }}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No polls available to fetch results.</p>
            )}
        </div>
    );
};

export default PollResults;
