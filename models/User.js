const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide e-mail"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid e-mail",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function () {
  console.log("in Model User preSave middlware:");

  const salt = await bcrypt.genSalt(10);

  console.log("salt:\n", salt);
  console.log("password: ", this.password);

  this.password = await bcrypt.hash(this.password, salt);

  console.log("password after hash:  ", this.password);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
UserSchema.methods.comparePassword = async function (candidatePassword) {

  console.log(
    "User Schema => comparePassword : Candidate password:  ",
    candidatePassword,
    "\nUser Schema => comparePassword : this.password is:    ",
    this.password
  );
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
