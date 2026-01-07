const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

// Send token response
exports.sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = exports.generateToken(user.id);

    // Remove password from output
    delete user.password_hash;

    res.status(statusCode).json({
        success: true,
        token,
        user
    });
};
