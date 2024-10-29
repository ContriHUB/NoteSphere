import React, { useState } from 'react';

const CastVote = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteCast, setVoteCast] = useState(false);
  const handleVote = async () => {
    if (selectedOption === null) {
        alert("Please select an option.");
        return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/polls/vote/${poll._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log('Vote cast successfully:', { success: data.success, message: data.message });
      setVoteCast(true); // Hide poll after successful vote
    } catch (error) {
      console.error('Error while voting:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (voteCast) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg my-4">
        <p className="text-green-600 font-bold">Thank you for voting!</p>
      </div>
    );
  }
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg my-4">
      <h3 className="text-xl font-bold mb-4">{poll.question}</h3>
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            {poll.options.map((option, index) => (
              <td key={option._id || index} className="px-4 py-2 text-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`poll-${poll._id}`}
                    value={index}
                    onChange={() => setSelectedOption(index)}
                    className="form-radio"
                  />
                  <span>{option.text}</span>
                </label>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleVote}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Cast Vote
      </button>
    </div>
  );
};

export default CastVote;
