const MovieModel = require("../models/movieModel");

// Add a new movie
async function addMovie(movieData, userId) {
  try {
    const newMovie = new MovieModel({
      ...movieData,
      createdBy: userId,
    });
    const savedMovie = await newMovie.save();
    return savedMovie;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw new Error("Error adding movie: " + error.message);
  }
}

// Get all movies
async function getAllMovies() {
  try {
    const movies = await MovieModel.find({});
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Error fetching movies: " + error.message);
  }
}

// Get movies by a specific user
async function getMoviesByUser(userId) {
  try {
    const movies = await MovieModel.find({ createdBy: userId });
    return movies;
  } catch (error) {
    console.error("Error fetching user movies:", error);
    throw new Error("Error fetching user movies: " + error.message);
  }
}

// Get a movie by ID
async function getMovieById(movieId, userId) {
  try {
    const movie = await MovieModel.findOne({ _id: movieId, createdBy: userId });
    if (!movie) {
      throw new Error(
        "Movie not found or user not authorized to view this movie"
      );
    }
    return movie;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    throw new Error("Error fetching movie by ID: " + error.message);
  }
}

// Update a movie
async function updateMovie(movieId, movieData, userId) {
  try {
    const movie = await MovieModel.findOneAndUpdate(
      { _id: movieId, createdBy: userId },
      movieData,
      { new: true }
    );
    if (!movie) {
      throw new Error("Movie not found or user not authorized");
    }
    return movie;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw new Error("Error updating movie: " + error.message);
  }
}

// Delete a movie
async function deleteMovie(movieId, userId) {
  try {
    const result = await MovieModel.findOneAndDelete({
      _id: movieId,
      createdBy: userId,
    });
    if (!result) {
      throw new Error("Movie not found or user not authorized");
    }
    return { message: "Movie deleted successfully" };
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw new Error("Error deleting movie: " + error.message);
  }
}

module.exports = {
  addMovie,
  getAllMovies,
  getMoviesByUser,
  updateMovie,
  deleteMovie,
  getMovieById,
};
