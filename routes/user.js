const express= require("express")
const router = express.Router()
const User = require("../models/User")

// CREATE (POST) - Create a new user
router.post('/users/signup', async (req, res) => {
    const userExist = await User.findOne({email:req.email})
    if(userExist){
        res.status(401).json({message:"L'email est déjà utilisé"})
    }
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("✓ user created", savedUser)
    res.status(201).json(savedUser);
  } catch (error) {
      console.error("× error creating new user", error)
      if(error.code===11000){
          res.status(401).json({message:"L'email est déjà utilisé"})
      }
      res.status(400).json({ message: error.message });
 }
});

// READ (GET) - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
      console.error("× error occurred", error.message)
    res.status(500).json({ message: error.message });
  }
});

// READ (GET) - Get a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE (PUT) - Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, returnDocument:'after' }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE (DELETE) - Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;