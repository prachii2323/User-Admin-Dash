import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    await axios.post('http://localhost:5000/logout', { email });
    localStorage.removeItem('email');
    navigate('/register');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: '#654ea3', 
        background: '-webkit-linear-gradient(to right, #eaafc8, #654ea3)', 
        background: 'linear-gradient(to right, #eaafc8, #654ea3)', 
      }}
    >
      <h1 className="text-6xl font-bold mb-4 text-center">Admin Dashboard</h1>
      <button
        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="bg-white mt-8 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 border-b border-gray-300">Name</th>
              <th className="py-2 border-b border-gray-300">Email</th>
              <th className="py-2 border-b border-gray-300">Login Time</th>
              <th className="py-2 border-b border-gray-300">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-gray-50 hover:bg-gray-100">
                <td className="py-2 border-b border-gray-300">{user.name}</td>
                <td className="py-2 border-b border-gray-300">{user.email}</td>
                <td className="py-2 border-b border-gray-300">{user.loginTime}</td>
                <td className="py-2 border-b border-gray-300">{user.logoutTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
