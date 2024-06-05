import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    await axios.post('http://localhost:5000/logout', { email });
    localStorage.removeItem('email');
    navigate('/register');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: '#654ea3', 
        background: '-webkit-linear-gradient(to right, #eaafc8, #654ea3)', 
        background: 'linear-gradient(to right, #eaafc8, #654ea3)', 
      }}
    >
      <h1 className="text-6xl font-bold mb-8">Welcome to the User Dashboard</h1>
      <button
        className="mt-4 bg-red-500 hover:bg-orange-700 text-white py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default UserDashboard;
