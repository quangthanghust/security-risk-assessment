const User = require('../models/User');

const getAllUsers = async (filter = {}) => User.find(filter);
const getUserById = async (id) => User.findById(id);
const createUser = async (data) => {
  const user = new User(data);
  return user.save();
};
const updateUser = async (id, data) => User.findByIdAndUpdate(id, data, { new: true });
const deleteUser = async (id) => User.findByIdAndDelete(id);

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
