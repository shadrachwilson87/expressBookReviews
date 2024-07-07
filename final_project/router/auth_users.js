const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./auth_users.js');
const { books } = require('./booksdb.js');
const { secret } = require('../config'); // Assuming secret is defined in a config file

const regd_users = express.Router();

// Login route
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, secret, { expiresIn: '1h' });

  // Save token in session
  req.session.token = token;

  res.json({ message: 'Login successful', token });
});

// Add or modify review route
regd_users.post('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { token } = req.session;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    // Find the book by ISBN
    const bookIndex = books.findIndex(b => b.ISBN === isbn);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReviewIndex = books[bookIndex].reviews.findIndex(r => r.username === username);

    if (existingReviewIndex !== -1) {
      // Modify existing review
      books[bookIndex].reviews[existingReviewIndex].review = review;
    } else {
      // Add new review
      books[bookIndex].reviews.push({ username, review });
    }

    res.json({ message: 'Review added/modified successfully' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

// Delete review route
regd_users.delete('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { token } = req.session;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;

    // Find the book by ISBN
    const bookIndex = books.findIndex(b => b.ISBN === isbn);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Filter out reviews by the logged-in user
    books[bookIndex].reviews = books[bookIndex].reviews.filter(r => r.username !== username);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

module.exports.authenticated = regd_users;
