const express = require("express");
const { upload } = require("../middlewares/index");
const { authenticateToken } = require("../middlewares/auth");
const { uploadToCloudinary } = require("../middlewares/index");
const userController = require("../controllers");
const router = express.Router();

router.post("/signup", upload.single("profilePicture"), async (req, res) => {
  try {
    let profilePictureUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      profilePictureUrl = result.secure_url;
    }
    await userController.handleSignup(req, res, profilePictureUrl);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({
      message: "Error uploading image to Cloudinary",
      error: error.message,
    });
  }
});
router.post("/login", userController.handleLogin);

router.post("/google-login", userController.handleGoogleLogin);

router.post(
  "/change-password",
  authenticateToken,
  userController.handleChangePassword
);

router.post("/forgot-password", userController.handleForgotPassword);

router.get("/users", userController.handleGetAllUsers);

router.get("/users/name/:name", userController.handleGetUserByName);

router.patch(
  "/users/name/:name",
  authenticateToken,
  userController.handleUpdateUserByName
);

router.get("/check-auth", authenticateToken, (req, res) => {
  res.json({ isAuthenticated: true });
});

router.post(
  "/upload-profile-picture",
  authenticateToken,
  upload.single("profilePicture"),
  userController.handleProfilePictureUpload
);

module.exports = router;
