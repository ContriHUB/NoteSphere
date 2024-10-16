// middleware/adminAuth.js
const fetchuser = require('./fetchUser');

const adminAuth = (req, res, next) => {
    fetchuser(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: "Access denied. Admins only." });
        }
    });
}

module.exports = adminAuth;
