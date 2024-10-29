import React, { useState } from 'react';

const PollCreation = ({ isAdmin }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [hours, setHours] = useState(0);
  const [message, setMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOptions = options.map(option => ({ text: option, votes: 0 }));

    // Convert hours to total seconds
    const timer = hours * 3600;

    const response = await fetch('http://localhost:5000/api/polls/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, options: formattedOptions, timer }),
    });
    console.log('Response status:', response); // Log the response status

    if (response.ok) {
      const result = await response.json();
      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      setHours(0);
    } else {
      const error = await response.json();
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p className="text-red-600">Only admins can create polls.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Create a New Poll</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Poll Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Poll Question"
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {options.map((option, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-semibold mb-1">Option {index + 1}:</label>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="flex">
          <button
            type="button"
            onClick={addOption}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Option
          </button>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Timer (in hours):</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            placeholder="Hours"
            min="0"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Create Poll
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-green-600 font-bold">{message}</p>}
    </div>
  );
};

export default PollCreation;
