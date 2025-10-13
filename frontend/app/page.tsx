
"use client";
import { useEffect, useState } from "react";
import { DotBackground } from "../compnents/DotBackground";

type Book = {
  id: number;
  title: string;
  author: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number|null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // Fetch all books (simulate, since backend has no list endpoint)
  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    // Since backend has no GET /books, brute-force fetch a range
    const maxId = 30;
    const fetched: Book[] = [];
    for (let id = 1; id <= maxId; id++) {
      try {
        const res = await fetch(`http://127.0.0.1:6767/book/${id}`,
          { method: "GET", mode: "cors" }
        );
        if (res.ok) {
          const book = await res.json();
          fetched.push(book);
        }
      } catch {}
    }
    setBooks(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:6767/book", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create book");
      } else {
        setTitle("");
        setAuthor("");
        fetchBooks();
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    try {
  await fetch(`http://127.0.0.1:6767/book/${id}`, { method: "DELETE", mode: "cors" });
      fetchBooks();
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const startEdit = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId == null) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:6767/book/${editId}`, {
        method: "PUT",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, author: editAuthor }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update book");
      } else {
        setEditId(null);
        setEditTitle("");
        setEditAuthor("");
        fetchBooks();
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <DotBackground />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="bg-white/80 dark:bg-black/80 rounded-xl shadow-xl p-8 w-full max-w-lg backdrop-blur-md border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold mb-6 text-center">📚 Book Manager</h1>
          <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-6">
            <input
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Author"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2 disabled:opacity-50"
              disabled={loading}
            >
              Add Book
            </button>
          </form>
          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
          <div className="space-y-4">
            {books.length === 0 && (
              <div className="text-gray-500 text-center">No books found.</div>
            )}
            {books.map(book => (
              <div key={book.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded p-3">
                {editId === book.id ? (
                  <form onSubmit={handleEdit} className="flex flex-1 gap-2 items-center">
                    <input
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                    />
                    <input
                      className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
                      value={editAuthor}
                      onChange={e => setEditAuthor(e.target.value)}
                      required
                    />
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setEditId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-semibold">{book.title}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                    </div>
                    <button
                      className="text-blue-600 hover:underline mr-3"
                      onClick={() => startEdit(book)}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(book.id)}
                      disabled={loading}
                    >Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
