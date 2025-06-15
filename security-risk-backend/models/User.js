const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Thêm trường email
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }, // Đã xác thực email chưa
  verificationToken: { type: String },           // Mã xác thực email
  resetPasswordToken: { type: String },          // Mã reset mật khẩu
  resetPasswordExpires: { type: Date }           // Hạn dùng mã reset
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);