const express = require("express");
const cartRouter = express.Router();
const User = require("../models/user");
const { authenticateToken } = require("../middleware/userAuth");

cartRouter.put("/addToCart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "sucess",
        message: "Book already in cart",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.json({ status: "sucess", message: "Book added to cart" });
  } catch (err) {
    console.log(err);
    return  res.status(500).json({ message: "internal server error" + err });
  }
});

cartRouter.put(
  "/removeBookFromCart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.headers;
      const { bookid } = req.params;

      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.json({ status: "sucess", message: "Book removed from cart" });
    } catch (err) {
      console.log(err);
      return  res.status(500).json({ message: "internal server error" + err });
    }
  }
);

cartRouter.get("/getUserCart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({ status: "sucess", data: cart });
  } catch (err) {
    console.log(err);
    return  res.status(500).json({ message: "internal server error" + err });
  }
});

module.exports = cartRouter;
