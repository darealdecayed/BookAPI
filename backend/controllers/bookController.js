// controllers/bookController.js
const pool = require('../db');

exports.createBook = async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required!' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
      [title, author]
    );
    res.status(201).json({ message: 'Book created!', book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.getBook = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found!' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const id = req.params.id;
  const { title, author } = req.body;
  if (!title && !author) {
    return res.status(400).json({ error: 'At least one of title or author is required!' });
  }
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    if (title) { fields.push(`title = $${idx++}`); values.push(title); }
    if (author) { fields.push(`author = $${idx++}`); values.push(author); }
    values.push(id);
    const result = await pool.query(
      `UPDATE books SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found!' });
    }
    res.json({ message: `Book with ID ${id} updated!`, book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found!' });
    }
    res.json({ message: `Book with ID ${id} deleted!` });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
