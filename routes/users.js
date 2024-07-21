const express = require("express");
const router = express.Router();
const { Users } = require("../models/index");
const { uploadProfilePic } = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

router.post(
  "/uploadProfilePic",
  authenticate,
  uploadProfilePic.single("profilePic"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "File size is too large. Max file size is 10MB" });
      }

      const user = await Users.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePic = req.file.path;
      await user.save();
      res.json({
        message: "Profile picture uploaded successfully",
        filePath: req.file.path,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
