const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};