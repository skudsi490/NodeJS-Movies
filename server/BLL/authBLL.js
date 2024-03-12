const UserModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const getUsers = async (username, submittedPassword) => {
  try {
    let user = await UserModel.findOne({ username: username });
    if (!user) {
      return { error: "User not found or Bad Credentials" };
    }
    const isMatch = await bcrypt.compare(submittedPassword, user.password);
    if (!isMatch) {
      return { error: "User not found or Bad Credentials" };
    }
    let token = jwt.sign(
      {
        username: user.username,
        fname: user.fname,
        lname: user.lname,
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id };
  } catch (e) {
    console.error("Error in getUsers:", e);
    return { error: "An error occurred during the login process" };
  }
};

const saveNewUser = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    let newUser = new UserModel(user);
    await newUser.save();
    return {
      message: "New User created successfully",
      userId: newUser._id.toString(),
    };
  } catch (e) {
    console.error("Error in saveNewUser:", e);
    return { error: "Some Error occurred" };
  }
};

module.exports = {
  getUsers,
  saveNewUser,
};
