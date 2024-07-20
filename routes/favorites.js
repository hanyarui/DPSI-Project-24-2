const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { favorites } = require("../models");

// Route to create a new favorite
router.post("/", authenticate, async (req, res) => {
  try {
    const { email, wisataID, isFavorite } = req.body;
    const favorite = await favorites.create({
      email,
      wisataID,
      isFavorite,
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get all favorite
router.get("/", authenticate, async (req, res) => {
  try {
    const favorite = await favorites.findAll();
    if (favorite.length === 0) {
      res.status(404).json({ message: "Favorites not found" });
    } else {
      res.json(favorite);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to delete a favorites by ID
router.delete("/deleteFavorite/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await favorites.findByPk(id);
    if (!favorite) throw new Error("Favorite not found");
    await favorite.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
