const mongoose = require("mongoose");
const validator = require("validator");

const userImageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  imageHash: {
    type: String,
    required: true,
    trim: true,
  },
});

const userImages = new mongoose.model("userImages", userImageSchema);
module.exports = userImages;
