import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  let location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-gray-800 p-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link className="text-white text-lg mr-10 " to="/">Navbar</Link>
          <div className="flex space-x-6">
            <Link 
              className={`text-white hover:underline `} 
              to="/">Home
            </Link>
            <Link 
              className={`text-white hover:underline`} 
              to="/about">About
            </Link>
          </div>

          <div className="ml-auto space-x-2">
            {!localStorage.getItem('token') ? (
              <>
                <Link className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" to="/login" role='button'>Login</Link>
                <Link className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" to="/signup" role='button'>Signup</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Logout</button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
