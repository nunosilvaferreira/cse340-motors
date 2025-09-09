const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Initialize express app first
const app = express();

// Middleware
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Set up static assets directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        message: 'Welcome to CSE340 Motors' 
    });
});

app.get('/inventory', (req, res) => {
    res.render('inventory', { title: 'Inventory' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Use environment port for Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Visit: http://localhost:${port}`);
});

module.exports = app;