const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const sendMail = require('../utils/sendMail');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function validatePassword(password) {
  if (password.length < 8) return 'Mật khẩu phải dài ít nhất 8 ký tự.';
  if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái thường.';
  if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái in hoa.';
  if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.';
  return '';
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
  if (!user.isVerified) return res.status(400).json({ message: 'Tài khoản chưa xác thực email' });
  if (!user.isActive) return res.status(400).json({ message: 'Tài khoản đã bị khóa' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '5d' }
  );


  user.lastLogin = new Date();
  await user.save();

  res.json({
    message: 'Đăng nhập thành công',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// Đăng ký
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }
  const pwErr = validatePassword(password);
  if (pwErr) return res.status(400).json({ message: pwErr });
  const existingEmail = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
  if (existingEmail) return res.status(400).json({ message: 'Email đã tồn tại' });

  const hashed = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ username, email, password: hashed, verificationToken });

  // Gửi email xác thực (chỉ gửi 1 lần, gửi link)
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
  await sendMail(email, 'Xác thực tài khoản', `Bấm vào link để xác thực: ${verificationUrl}`);

  res.status(201).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.' });
};

// Xác thực email
exports.verifyEmail = async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email, verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Mã xác thực không đúng' });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  // Tạo JWT token đăng nhập 
  const jwtToken = require('jsonwebtoken').sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '5d' }
  );

  res.json({
    message: 'Xác thực email thành công',
    token: jwtToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  // Hạn sử dụng token là 1 giờ
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Chỉ gửi 1 email reset (gửi link)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
  await sendMail(email, 'Đặt lại mật khẩu', `Bấm vào link để đặt lại mật khẩu: ${resetUrl}`);

  res.json({ message: 'Đã gửi link đặt lại mật khẩu tới email.' });
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  const pwErr = validatePassword(newPassword);
  if (pwErr) return res.status(400).json({ message: pwErr });
  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Mã không hợp lệ hoặc đã hết hạn' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Đặt lại mật khẩu thành công' });
};

