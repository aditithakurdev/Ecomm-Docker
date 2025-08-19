const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided or format incorrect.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part
    console.log('Token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};


module.exports = authenticateToken;
