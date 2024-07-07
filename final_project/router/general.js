const express = require('express');
let books = require("./booksdb.js"); // Assuming booksdb.js exports an array of books
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  // Example: Add new user to users array (replace with actual implementation)
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books); // Respond with JSON array of books
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.ISBN === isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = books.filter(b => b.author === author);
  if (authorBooks.length === 0) {
    return res.status(404).json({ message: 'No books found for this author' });
  }
  res.json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = books.filter(b => b.title.includes(title));
  if (titleBooks.length === 0) {
    return res.status(404).json({ message: 'No books found with this title' });
  }
  res.json(titleBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Assume reviews are stored with each book in booksdb.js or another data source
  const book = books.find(b => b.ISBN === isbn);
  if (!book || !book.reviews || book.reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found for this book' });
  }
  res.json(book.reviews);
});

module.exports.general = public_users;
