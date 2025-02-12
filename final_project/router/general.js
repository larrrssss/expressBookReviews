const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "User already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const booksList = await new Promise((resolve) => resolve(books));
    res.json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const { isbn } = req.params;
    const book = await new Promise((resolve) => {
      resolve(Object.values(books).find((book) => book.isbn === isbn));
    });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const { author } = req.params;
    const booksByAuthor = await new Promise((resolve) => {
      resolve(Object.values(books).filter((book) => book.author === author));
    });

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const { title } = req.params;
    const booksByTitle = await new Promise((resolve) => {
      resolve(Object.values(books).filter((book) => book.title === title));
    });

    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(book.reviews);
});

module.exports.general = public_users;
