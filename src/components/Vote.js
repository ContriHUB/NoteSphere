import React, { useEffect, useState, useContext } from 'react';
import PollCreation from './PollCreation';
import PollResults from './PollResults';
import CastVote from './CastVote';
import AuthContext from '../context/AuthContext';

const Vote = () => {
  const [polls, setPolls] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch polls from the server
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls');
        if (!response.ok) {
          throw new Error('Failed to fetch polls');
        }
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div>
      {user?.isAdmin ? (
        <div>
          <PollCreation isAdmin={user.isAdmin} />
          <h2 className="mt-4">Poll Results</h2>
          {polls.length > 0 ? (
            polls.map(poll => (
              <PollResults key={poll._id} pollId={poll._id} isAdmin={user.isAdmin} />
            ))
          ) : (
            <p>No polls available.</p>
          )}
        </div>
      ) : (
        <div>
          {polls.length > 0 ? (
            polls.map(poll => (
              <CastVote key={poll._id} poll={poll} />
            ))
          ) : (
            <p>You do not have permission to create polls.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Vote;
