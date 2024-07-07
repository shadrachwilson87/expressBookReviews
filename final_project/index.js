const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Session configuration for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for customer/auth routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if there is a session and session.token
    if (req.session && req.session.token) {
        // Verify the token using jwt.verify
        jwt.verify(req.session.token, 'your_secret_key', function(err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                // Token is valid, proceed to the next middleware/route handler
                req.user = decoded;  // Optional: Store decoded token payload in req.user
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
