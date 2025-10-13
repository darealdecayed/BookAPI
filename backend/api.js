const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const bookController = require("./controllers/bookController");

const app = express();
const PORT = 6767;

// Enable CORS for all routes, allow frontend origin
app.use(cors({
  origin: [
    "https://supreme-space-cod-7v4pjqw57j95h4xg-3000.app.github.dev",
    "http://localhost:3000"
  ],
  credentials: true
}));
// Middleware
app.use(bodyParser.json());

// Book routes using controller
app.post("/book", bookController.createBook);
app.get("/book/:id", bookController.getBook);
app.put("/book/:id", bookController.updateBook);
app.delete("/book/:id", bookController.deleteBook);

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
