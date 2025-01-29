const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out For Delivery", "Canceled"],
    },
  },
  { timestamps: true }
);
const Order=mongoose.model("order",orderSchema)
module.exports=Order