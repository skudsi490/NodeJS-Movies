const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Import connectDB function
const connectDB = require("./configs/connectDB");

// Routers
const authRouter = require('./routers/authRouter');
const movieRouter = require('./routers/movieRouter');
const usersRouter = require('./routers/usersRouter');

// Middleware
const authenticate = require('./middleware/authenticate');
const actionCounter = require('./middleware/actionCounter'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/movies', authenticate, actionCounter, movieRouter); 
app.use('/api/users', authenticate, usersRouter); 

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'pages', 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500);
  res.json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
