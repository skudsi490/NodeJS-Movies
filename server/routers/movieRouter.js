const express = require('express');
const multer = require('multer');
const router = express.Router();
const movieBLL = require('../BLL/movieBLL');
const authenticate = require('../middleware/authenticate');
const actionCounter = require('../middleware/actionCounter');

// Set up storage engine for image uploads  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {

        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }   
});

const upload = multer({ storage: storage });

// Route to fetch all movies, accessible to logged-in users
router.get('/', authenticate, actionCounter, async (req, res) => {
    try {
        const movies = await movieBLL.getAllMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch movies uploaded by the logged-in user
router.get('/my', authenticate, actionCounter, async (req, res) => {
    try {
        const userMovies = await movieBLL.getMoviesByUser(req.user.id);
        res.json(userMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to handle movie creation with image upload
router.post('/add', authenticate, actionCounter, upload.single('image'), async (req, res) => {
    const movieData = req.body;
    if (req.file) {
        movieData.image = req.file.path; 
    }
    try {
        const savedMovie = await movieBLL.addMovie(movieData, req.user.id);
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to edit a movie
router.put('/edit/:id', authenticate, actionCounter, async (req, res) => {
    try {
        const updatedMovie = await movieBLL.updateMovie(req.params.id, req.body, req.user.id);
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a movie
router.delete('/delete/:id', authenticate, actionCounter, async (req, res) => {
    try {
        await movieBLL.deleteMovie(req.params.id, req.user.id);
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch a specific movie by ID
router.get('/:id', authenticate, actionCounter, async (req, res) => {
    try {
        const movie = await movieBLL.getMovieById(req.params.id, req.user.id);
        res.json(movie);
    } catch (error) {
        if (error.message.includes('Movie not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});


module.exports = router;
