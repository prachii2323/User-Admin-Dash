import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5000/login', { email, password });
    setMessage(response.data.message);
    if (response.data.message.includes('admin')) {
      localStorage.setItem('email', email);
      navigate('/admin-dashboard');
    } else if (response.data.message.includes('user')) {
      localStorage.setItem('email', email);
      navigate('/user-dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(to right, #A8CABA, #5D4157)' 
      }}
    >
      <h1 className="text-6xl font-bold mb-8">Login</h1>
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {message && <p className="text-red-500 text-xs italic">{message}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-black">
        Don't have an account?{' '}
        <button
          className="text-blue-500"
          onClick={() => navigate('/register')}
        >
          Register 
        </button> now
      </p>
      </form>
      
    </div>
  );
}

export default Login;
