const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 6767;


// Enable CORS for all routes
app.use(cors());
// Middleware
app.use(bodyParser.json());

// Temporary in-memory database
let books = {};
let currentId = 1;

// ✅ Create a book
app.post("/book", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required!" });
  }

  const id = currentId++;
  books[id] = { id, title, author };

  res.status(201).json({ message: "Book created!", book: books[id] });
});

// 📖 Get a book by ID
app.get("/book/:id", (req, res) => {
  const id = req.params.id;
  const book = books[id];

  if (!book) {
    return res.status(404).json({ error: "Book not found!" });
  }

  res.json(book);
});

// 🗑️ Delete a book
// ✏️ Update a book by ID
app.put("/book/:id", (req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;
  const book = books[id];

  if (!book) {
    return res.status(404).json({ error: "Book not found!" });
  }
  if (!title && !author) {
    return res.status(400).json({ error: "At least one of title or author is required!" });
  }
  if (title) book.title = title;
  if (author) book.author = author;

  res.json({ message: `Book with ID ${id} updated!`, book });
});
app.delete("/book/:id", (req, res) => {
  const id = req.params.id;
  const book = books[id];

  if (!book) {
    return res.status(404).json({ error: "Book not found!" });
  }

  delete books[id];
  res.json({ message: `Book with ID ${id} deleted!` });
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
