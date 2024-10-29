// middleware/adminAuth.js
const fetchuser = require('./fetchUser');

const adminAuth = (req, res, next) => {
    fetchuser(req, res, (err) => {
        
        if (err) {
            // If there's an error in fetchuser, respond with an error
            
            return res.status(500).json({ message: 'Error fetching user', error: err });
        }
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: "Access denied. Admins only." });
        }
    });
}

module.exports = adminAuth;
