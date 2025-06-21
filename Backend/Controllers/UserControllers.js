const User = require('../Model/UserModel');

// Data Display
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password'); // Exclude password field
    } catch (err) {
        console.log(err);
    }
    if (!users) {
        return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
};

// Data Insert
const addUsers = async (req, res, next) => {
    const { name, email, age, address, password} = req.body;
    let users;
    try {
        users = new User({name, email, age, address, password});
        await users.save();
    } catch (err) {
        console.log(err);
    }
    if (!users) {
        return res.status(404).json({ message: "Unable to add users" });
    }
    return res.status(200).json({ users });
};

// Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }
  try {
    const users = await User.findById(id, '-password'); // Exclude password field
    if (!users) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching user" });
  }
};

// Update User Details
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }
  const { name, email, age, address, password } = req.body;
  try {
    const users = await User.findByIdAndUpdate(id, { name, email, age, address, password }, { new: true, select: '-password' });
    if (!users) {
      return res.status(404).json({ message: "Unable to update user by this ID" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate email error" });
    }
    return res.status(500).json({ message: "Error updating user" });
  }
};

// Delete User Details
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let users;
    try {
        users = await User.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }  
    if (!users) {
        return res.status(404).json({ message: "Unable to delete user by this ID" });
    }
    return res.status(200).json({ users });
};

// New Endpoint to Get User Count
const getUserCount = async (req, res, next) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching user count" });
    }
};

exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserCount = getUserCount;