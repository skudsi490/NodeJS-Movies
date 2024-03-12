const UserModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const getAllUsers = async (token) => {
  if (!token) {
    return "Token not found";
  } else {
    try {
      let response = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (response) {
        let users = await UserModel.find({});
        if (users.length > 0) {
          return users;
        } else {
          return "No users found";
        }
      }
    } catch (e) {
      return "Token not valid";
    }
  }
};

const getUser = async (id, token) => {
  if (!token) {
    return "Token not found";
  } else {
    try {
      let response = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (response) {
        let user = await UserModel.findOne({ _id: id });
        if (user) {
          return user;
        } else {
          return "User not found";
        }
      }
    } catch (e) {
      return "token not valid";
    }
  }
};

const deleteUser = async (id, token) => {
  if (!token) {
    return "Token not found";
  } else {
    try {
      let response = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (response) {
        try {
          await UserModel.findByIdAndDelete(id);
          return "User Deleted Successfully";
        } catch (e) {
          return "User not deleted, please try again";
        }
      }
    } catch (e) {
      return "Token not valid";
    }
  }
};

const updateUser = async (id, token, updateData) => {
  if (!token) {
    return "Token not found";
  } else {
    try {
      let response = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (response) {
        try {
          let user = await UserModel.findByIdAndUpdate(id, updateData, {
            new: true,
          });
          if (user) {
            return user;
          } else {
            return "User not found";
          }
        } catch (e) {
          return "Error updating user, please try again";
        }
      }
    } catch (e) {
      return "Token not valid";
    }
  }
};

const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { error: "Current password is incorrect" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return { message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "An error occurred while changing the password" };
  }
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  changeUserPassword,
};
