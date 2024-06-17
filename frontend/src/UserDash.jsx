import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Wishlist({ wishlistBooks, handleRemoveFromWishlist, handleCloseWishlist }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm max-h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Wishlist</h2>
        {wishlistBooks.map(book => (
          <div key={book._id} className="border p-2 rounded-lg mb-2 flex flex-col">
            <div className="flex items-center">
              <img src={book.imageUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
              <div className="ml-2">
                <h3 className="text-sm font-bold">{book.title}</h3>
                <p className="text-xs text-gray-600">by {book.author?.name}</p>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs mt-2"
                  onClick={() => handleRemoveFromWishlist(book._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <button 
          className="bg-gray-500 text-white px-3 py-1 rounded-sm text-sm mt-4"
          onClick={handleCloseWishlist}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [bookSummary, setBookSummary] = useState('');
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.get('http://localhost:5000/wishlist', { params: { email } });
      setWishlistBooks(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleLogout = async () => {
    const email = localStorage.getItem('email');
    await axios.post('http://localhost:5000/logout', { email });
    localStorage.removeItem('email');
    navigate('/register');
  };

  const handleViewMore = (book) => {
    setExpandedBookId(book._id);
    setBookSummary(book.summary);
  };

  const handleCloseDialog = () => {
    setExpandedBookId(null);
    setBookSummary('');
  };

  const handleBuyNow = async (bookId) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/buy-book', { email, bookId });
      if (response.data.success) {
        setBooks(books.map(b => b._id === bookId ? { ...b, copies: b.copies - 1 } : b));
      } else {
        console.error('Error buying book:', response.data.message);
      }
    } catch (error) {
      console.error('Error buying book:', error);
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      const email = localStorage.getItem('email');
      await axios.post('http://localhost:5000/add-to-wishlist', { email, bookId });
      fetchWishlist(); // Refresh wishlist after adding a book
    } catch (error) {
      console.error('Error adding book to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      const email = localStorage.getItem('email');
      await axios.post('http://localhost:5000/remove-from-wishlist', { email, bookId });
      fetchWishlist(); // Refresh wishlist after removing a book
    } catch (error) {
      console.error('Error removing book from wishlist:', error);
    }
  };

  const handleCloseWishlist = () => {
    setShowWishlist(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24" style={{ background: 'linear-gradient(to right, #A8CABA, #5D4157)' }}>
      <nav className="w-full fixed top-0 left-0 flex items-center justify-between p-4 bg-gray-800 text-white z-10">
        <h1 className="text-2xl">User Dashboard</h1>
        <div className="flex space-x-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setShowWishlist(true)}>
            Wishlist
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="mt-14 p-6 bg-white rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book._id} className="border p-4 rounded-lg shadow-lg flex flex-col">
              <div className="flex md:flex-row justify-between">
                <img src={book.imageUrl} alt={book.title} className="w-32 h-48 object-cover mb-4 rounded md:mb-0 md:mr-4" />
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author?.name}</p>
                  <p className="text-gray-600 mb-2">Published by {book.publisher?.name}</p>
                  <p className="text-gray-600 mb-2">Published on {new Date(book.publishedDate).toDateString()}</p>
                  <p className="text-gray-600 mb-2">Number of copies: {book.copies}</p>
                  <p className="text-gray-600 mb-2">Price: ₹{book.price}</p>
                </div>
              </div>
              <div className="mt-auto flex justify-center space-x-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleViewMore(book)}
                >
                  View More
                </button>
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleBuyNow(book._id)}
                >
                  Buy Now
                </button>
                <button 
                  className="bg-yellow-500 text-white px-3 py-1 rounded-sm text-sm"
                  onClick={() => handleAddToWishlist(book._id)}
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {expandedBookId && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Book Summary</h2>
            <p className="mb-4">{bookSummary}</p>
            <button 
              className="bg-gray-500 text-white px-3 py-1 rounded-sm text-sm"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showWishlist && (
        <Wishlist 
          wishlistBooks={wishlistBooks} 
          handleRemoveFromWishlist={handleRemoveFromWishlist} 
          handleCloseWishlist={handleCloseWishlist} 
        />
      )}
    </div>
  );
}

export default UserDashboard;
