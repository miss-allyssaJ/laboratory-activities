const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

let books = [
  {
    id: 1,
    title: "Sample Book",
    author: { name: "John Doe" },
    category: { name: "Fiction" },
    yearPublished: 2024,
    cover: "uploads/sample.jpg",
  },
];
app.get("/api/books", (req, res) => {
  res.json(books);
});

app.post("/api/books", upload.single("cover"), (req, res) => {
  const { title, author, category, yearPublished } = req.body;

  const newBook = {
    id: books.length + 1,
    title,
    author: { name: author },
    category: { name: category },
    yearPublished,
    cover: req.file ? `/uploads/${req.file.filename}` : null,
  };

  books.push(newBook);
  res.json(newBook);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
