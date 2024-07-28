const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksArray = Object.values(books);

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username === "" || password === "") {
      return res.status(400).json({ message: "Username or password is empty" });
    }
  
    if (isValid(username)) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      users.push({ username, password });
      return res.status(200).json({ message: "User created. You can now log in" });
    }
  });

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.send(JSON.stringify(books)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let author_books = [];
    for (const isbn in books) {
      if (Object.hasOwnProperty.call(books, isbn)) {
        const book = books[isbn];
        if (book.author === author) {
          author_books.push(book);
        }
      }
    if (author_books.length === 0) {
      return res.status(404).json({message: "Author not found"});
    } else {
      return res.status(200).json(author_books);
    }
  }});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let title_books = [];
    for (const isbn in books) {
      if (Object.hasOwnProperty.call(books, isbn)) {
        const book = books[isbn];
        if (book.title === title) {
          title_books.push(book);
        }
      }
    if (title_books.length === 0) {
      return res.status(404).json({message: "Title not found"});
    } else {
      return res.status(200).json(title_books);
    }
  }});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  });


module.exports.general = public_users;
