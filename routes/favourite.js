const express = require("express");
const favouriteRouter = express.Router();
const User = require("../models/user");
const { authenticateToken } = require("../middleware/userAuth");

favouriteRouter.put(
  "/addbookToFavourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userdata = await User.findById(id);
      const isBookFavourite = userdata.favourites.includes(bookid);
      if (isBookFavourite) {
        return res
          .status(200)
          .json({ message: "Book is already in favourites" });
      }

      await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
      return res.status(200).json({ message: "Book Added to favourites" });
    } catch (err) {
      res.status(500).json({ message: "internal server error" + err });
    }
  }
);

favouriteRouter.put(
  "/removebookFromFavourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userdata = await User.findById(id);
      const isBookFavourite = userdata.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
      }

      return res.status(200).json({ message: "Book removed from favourites" });
    } catch (err) {
      res.status(500).json({ message: "internal server error" + err });
    }
  }
);

favouriteRouter.get(
  "/getFavouriteBooks",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id).populate("favourites");
      const favouriteBooks = userData.favourites;
      return res.status(200).json({ status: "sucess", data: favouriteBooks });
    } catch (err) {
      res.status(500).json({ message: "internal server error" + err });
    }
  }
);

module.exports = favouriteRouter;
