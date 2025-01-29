const express = require("express");
const path=require("path")
require("dotenv").config();
const cors=require("cors")
const connectDB = require("./config/database.js");
const userRouter = require("./routes/user.js");
const bookRouter = require("./routes/books.js");
const favouriteRouter = require("./routes/favourite.js");
const cartRouter = require("./routes/cart.js");
const orderRouter = require("./routes/order.js");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1",userRouter)
app.use("/api/v1",bookRouter)
app.use("/api/v1",favouriteRouter)
app.use("/api/v1",cartRouter)
app.use("/api/v1",orderRouter)

app.get("/home", (req, res) => {
  res.send("hello from home");
});
connectDB()
  .then(() => {
    console.log("database connected succesfully");

    app.listen(port, () => {
      console.log(`Server started successfully at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("database cannot be connected"+ err);
  });
