const mongoose = require("mongoose");
const validator=require("validator")

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minLenth:3,
    maxLength:20,
    trim:true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid email address:"+value)
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  phone:{
    type:Number,
    required:true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  favourites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
  ],
  cart: [
    {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  ],
},{timestamps:true});

 const User=mongoose.model("user",userSchema)
 module.exports=User