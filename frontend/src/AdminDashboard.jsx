import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/users');
    const filteredUsers = response.data.filter(user => user.email.endsWith('@gmail.com'));
    setUsers(filteredUsers);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = async (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      await axios.post('http://localhost:5000/delete-user', { email: selectedUser.email });
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = async (email) => {
    await axios.post('http://localhost:5000/logout', { email });
    fetchUsers(); // Refresh the user list after logout
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: 'linear-gradient(to right, #A8CABA, #5D4157)' 
      }}
    >
      <h1 className="text-6xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 border-b border-gray-300">Name</th>
              <th className="py-2 border-b border-gray-300">Date of Login</th>
              <th className="py-2 border-b border-gray-300">Login Time</th>
              <th className="py-2 border-b border-gray-300">Logout Time</th>
              <th className="py-2 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-gray-50 hover:bg-gray-100">
                <td className="py-2 border-b border-gray-300">{user.name}</td>
                <td className="py-2 border-b border-gray-300">
                  {user.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  {user.loginTime ? new Date(user.loginTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  {user.logoutTime ? new Date(user.logoutTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  <button className="mr-2" onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editDialogOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            {/* Add form elements to update login and logout time */}
            <button onClick={() => setEditDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}
      {deleteDialogOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end">
              <button className="mr-2" onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
