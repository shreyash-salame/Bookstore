const express = require("express");
const orderRouter = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("../middleware/userAuth");

orderRouter.post("/placeOrder", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDatafromDb = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDatafromDb._id },
      });

      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({ status: "sucess", message: "order Placed Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal error" + err });
  }
});

orderRouter.get("/getOrderHistory", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const ordersData = userData.orders.reverse();
    return res.json({ status: "success", data: ordersData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal error" + err });
  }
});

orderRouter.get("/getAllOrders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    return res.json({ status: "success", data: userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal error" + err });
  }
});

orderRouter.put("/updateStatus/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "success",
      message: "status Updated Sucessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal error" + err });
  }
});

module.exports = orderRouter;
