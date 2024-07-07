const axios = require('axios');
const express = require('express');
const public_users = express.Router();

// Task 10: Get the list of books available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://api.example.com/books');
    const books = response.data;
    return res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  
  axios.get(`http://api.example.com/book/${isbn}`)
    .then(response => {
      const book = response.data;
      return res.json({ book });
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
      return res.status(500).json({ message: 'Failed to fetch book details' });
    });
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;

  try {
    const response = await axios.get(`http://api.example.com/books?author=${author}`);
    const books = response.data;
    return res.json({ books });
  } catch (error) {
    console.error('Error fetching books by author:', error);
    return res.status(500).json({ message: 'Failed to fetch books by author' });
  }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  axios.get(`http://api.example.com/books?title=${title}`)
    .then(response => {
      const books = response.data;
      return res.json({ books });
    })
    .catch(error => {
      console.error('Error fetching books by title:', error);
      return res.status(500).json({ message: 'Failed to fetch books by title' });
    });
});

module.exports.general = public_users;
