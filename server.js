const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const passport = require('passport');
const session = require('express-session');
const linkedInRoutes = require('./landing/assets/routes/linkedin');
require('./auth');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Static file middleware
app.use(express.static(path.join(__dirname, "landing", "public")));
app.use("/assets", express.static(path.join(__dirname, "landing", "assets")));
app.use(express.json());

// Page routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "landing", "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "landing", "public", "index.html"));
});

app.get("/about-me", (req, res) => {
  res.sendFile(path.join(__dirname, "landing", "public", "about.html"));
});

app.get("/privacy", (req, res) => {
    res.sendFile(path.join(__dirname, "landing", "public", "privacy.html"));
});

// Contact form route
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Received message from ${name} (${email}): ${message}`);
    res.send("Message sent!");
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
});
