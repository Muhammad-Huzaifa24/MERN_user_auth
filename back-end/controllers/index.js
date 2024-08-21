const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const { uploadToCloudinary } = require("../middlewares/index");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();
const client = new OAuth2Client(process.env.CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

const handleProfilePictureUpload = async (req, res) => {
  try {
    let profilePictureUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      console.log(result);
      profilePictureUrl = result.secure_url;
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    user.profilePicture = profilePictureUrl;
    await user.save();

    res.status(200).json({ url: profilePictureUrl });
  } catch (error) {
    console.log("Inside catch  :", error.message);
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};
const handleSignup = async (req, res) => {
  const { name, email, password, gender, age } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePictureUrl = "";

    if (req.file) {
      profilePictureUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "profile_pictures",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      profilePicture: profilePictureUrl,
    });
    console.log(User.age);

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
};
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Server error" });
  }
};
const handleGoogleLogin = async (req, res) => {
  console.log("handle google login");
  const { googleToken } = req.body;

  try {
    if (!googleToken) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("Google payload:", payload);

    // Extract user information from payload
    const { name, email, picture } = payload;
    console.log("name", name);
    console.log("email", email);
    console.log("picture", picture);

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user if they don't exist

      user = new User({
        name,
        email,
        profilePicture: picture,
      });
      const randomPassword = crypto.randomBytes(8).toString("hex");
      user.password = await bcrypt.hash(randomPassword, 10);

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      token,
      user: { name: user.name, profilePicture: user.profilePicture },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const handleGetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const handleGetUserByName = async (req, res) => {
  try {
    const userName = req.params.name; // Get the user name from the request parameters
    const user = await User.findOne({ name: userName }); // Find the user by name

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return the found user
  } catch (error) {
    console.error("Error fetching user by name", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const handleUpdateUserByName = async (req, res) => {
  try {
    const userName = req.params.name;
    let { name, email, gender, age, profilePictureUrl, password, loginType } =
      req.body;

    let user = await User.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = age;
    if (profilePictureUrl !== undefined)
      user.profilePicture = profilePictureUrl;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    } else if (loginType === "google") {
      // const randomPassword = generateRandomPassword();
      const randomPassword = crypto.randomBytes(8).toString("hex");
      user.password = await bcrypt.hash(randomPassword, 10);
    }
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const handleChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Check if the new password is different from the old one
    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: "New password should be different from the old password",
      });
    }

    // Hash the new password and update it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = crypto.randomBytes(8).toString("hex");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const subject = "Your New Password";
    const message = `Your new password is: ${newPassword}`;
    await sendEmail(user.email, subject, message);

    res.status(200).json({ message: "New password sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
  handleGetAllUsers,
  handleGoogleLogin,
  handleProfilePictureUpload,
  handleGetUserByName,
  handleUpdateUserByName,
  handleChangePassword,
  handleForgotPassword,
};
