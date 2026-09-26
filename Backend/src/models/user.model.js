import { model, Schema } from "mongoose";

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contact: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer",
  },
  googleId: String,
});

const userModel = model("users", userSchema);

export default userModel;
