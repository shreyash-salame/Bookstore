const express = require("express");
const { authenticateToken } = require("../middleware/userAuth");
const bookRouter = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const Book = require("../models/book");
const User = require("../models/user");

// bookRouter.post("/addBook", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const user = await User.findById(id);
//     if (user.role !== "admin") {
//       return res.status(400).json({ message: "cannot perform admin work" });
//     }
//     const newBook = new Book({
//       url: req.body.url,
//       title: req.body.title,
//       author: req.body.author,
//       price: req.body.price,
//       description: req.body.description,
//       language: req.body.language,
//     });
//     await newBook.save();
//     res.status(200).json({ message: "new book added sucessfully" });
//   } catch (err) {
//     res.status(500).json({ message: "internal server error" + err });
//   }
// });

// bookRouter.patch("/updateBook", authenticateToken, async (req, res) => {
//   try {
//     const { bookid } = req.headers;
//    const updatedBook= await Book.findByIdAndUpdate(bookid, {
//       url: req.body.url,
//       title: req.body.title,
//       author: req.body.author,
//       price: req.body.price,
//       description: req.body.description,
//       language: req.body.language,
//     });
//     return res.status(200).json({ message: " Book addded sucessfully",data:updatedBook });
//   } catch (err) {
//     res.status(500).json({ message: "internal server error" + err });
//   }
// });

// Update addBook route to handle file upload
bookRouter.post("/addBook", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(400).json({ message: "Cannot perform admin work" });
    }

    const newBook = new Book({
      url: req.file.path, // Path to uploaded image
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      language: req.body.language,
    });

    await newBook.save();
    res.status(200).json({ message: "New book added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err });
  }
});


bookRouter.put("/updateBook", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    // Use $set to update only the fields provided in the request body
    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json({ message: "Book updated successfully", data: updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err });
  }
});

bookRouter.delete("/deleteBook", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: " Book Deleted  sucessfully" });
  } catch (err) {
    res.status(500).json({ message: "internal server error" + err });
  }
});

bookRouter.get("/getAllBooks", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: "sucess", data: books });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "an error occured" });
  }
});

bookRouter.get("/getRecentlyAddedBooks", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ status: "sucess", data: books });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "an error occured" });
  }
});

bookRouter.get("/getBookbyId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.status(200).json({ status: "sucess", data: book });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "an error occured" });
  }
});

module.exports = bookRouter;
