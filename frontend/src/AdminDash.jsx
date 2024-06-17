import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', loginTime: '' });
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publisher: '',
    publishedDate: '',
    copies: '',
    imageUrl: '',
    price: '',
    summary: ''
  });
  const [books, setBooks] = useState([]); // Added state for books
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchBooks(); // Fetch books when the component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      const filteredUsers = response.data.filter(user => user.email.endsWith('@gmail.com'));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data); // Assuming you have a state variable for books
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBookSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/add-book', newBook);
      setAddBookDialogOpen(false);
      setNewBook({
        title: '',
        author: '',
        publisher: '',
        publishedDate: '',
        copies: '',
        imageUrl: '',
        price: '',
        summary: ''
      });
      fetchBooks(); // Fetch updated list of books here
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      loginTime: user.logins.length > 0 ? new Date(user.logins[user.logins.length - 1].loginTime).toISOString().slice(0, 16) : ''
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await axios.post('http://localhost:5000/delete-user', { email: selectedUser.email });
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.post('http://localhost:5000/update-user', {
        id: selectedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        loginTime: new Date(updatedUser.loginTime).toISOString()
      });
      const updatedUsers = users.map(user => user._id === selectedUser._id ? { ...user, ...updatedUser } : user);
      setUsers(updatedUsers);
      setEditDialogOpen(false);
      setConfirmationDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setConfirmationDialogOpen(false);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleLogout = () => {
    navigate('/register');
  };

  const handleAddBook = () => {
    setAddBookDialogOpen(true);
  };

  const closeAddBookDialog = () => {
    setAddBookDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24" style={{ background: 'linear-gradient(to right, #A8CABA, #5D4157)' }}>
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between p-4 bg-gray-800 text-white z-10">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={handleAddBook}>
            Add Book
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-4">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 border-b border-gray-300">Name</th>
              <th className="py-2 border-b border-gray-300">Email</th>
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
                <td className="py-2 border-b border-gray-300">{user.email}</td>
                <td className="py-2 border-b border-gray-300">
                  {user.logins.length > 0 ? new Date(user.logins[user.logins.length - 1].loginTime).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  {user.logins.length > 0 ? new Date(user.logins[user.logins.length - 1].loginTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  {user.logins.length > 0 && user.logins[user.logins.length - 1].logoutTime ? new Date(user.logins[user.logins.length - 1].logoutTime).toLocaleTimeString() : 'N/A'}
                </td>
                <td className="py-2 border-b border-gray-300">
                  <button className="mr-2 bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDelete(user)}>
                    Delete
                  </button>
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
            <label className="block mb-2">Name:</label>
            <input 
              type="text" 
              value={updatedUser.name} 
              onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Email:</label>
            <input 
              type="email" 
              value={updatedUser.email} 
              onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">Login Date & Time:</label>
            <input 
              type="datetime-local" 
              value={updatedUser.loginTime}
              onChange={(e) => setUpdatedUser({ ...updatedUser, loginTime: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <button 
              className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={openConfirmationDialog}
            >
              Submit
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={closeEditDialog}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {confirmationDialogOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirm Changes</h2>
            <p>Are you sure you want to make these changes?</p>
            <div className="mt-4 flex justify-end">
              <button 
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeEditDialog}
              >
                No
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateUser}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteDialogOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-end">
              <button 
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeDeleteDialog}
              >
                Cancel
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {addBookDialogOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center mt-14">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Book</h2>
            <label className="block mb-1 text-sm">Title:</label>
            <input 
              type="text" 
              value={newBook.title} 
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Author:</label>
            <input 
              type="text" 
              value={newBook.author} 
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Publisher:</label>
            <input 
              type="text" 
              value={newBook.publisher} 
              onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Published Date:</label>
            <input 
              type="date" 
              value={newBook.publishedDate}
              onChange={(e) => setNewBook({ ...newBook, publishedDate: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Number of Copies:</label>
            <input 
              type="number" 
              value={newBook.copies} 
              onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Image URL:</label>
            <input 
              type="text" 
              value={newBook.imageUrl} 
              onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Price:</label>
            <input 
              type="number" 
              value={newBook.price} 
              onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <label className="block mb-1 text-sm">Summary:</label>
            <textarea 
              value={newBook.summary} 
              onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
              className="w-full p-1 border rounded mb-2 text-sm"
            />
            <button 
              className="mr-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
              onClick={handleAddBookSubmit}
            >
              Submit
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-1 rounded text-sm"
              onClick={closeAddBookDialog}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
