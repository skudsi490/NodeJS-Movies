// API endpoint base URL
const BASE_URL = "http://localhost:3000/api";

// Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const userInfoElement = document.querySelector(".user-info span");
const logoutLink = document.querySelector('nav ul li a[href="logout.html"]');

// Event Listeners
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}

if (logoutLink) {
  logoutLink.addEventListener("click", handleLogout);
}

// Display Logged-in User's Name or Username
if (userInfoElement) {
  const username = localStorage.getItem("username");
  if (username) {
    userInfoElement.textContent = `Welcome, ${username}!`;
  }
}

// Authentication Handlers
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login Error:", error);
  }
}

// Logout Handler
function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

async function handleRegister(e) {
  e.preventDefault();
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    age: document.getElementById("age").value,
    address: document.getElementById("address").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration Error:", error);
  }
}

// Movie Management
async function fetchMovies() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const movieListSection = document.getElementById("movie-list");
  const myMoviesSection = document.getElementById("my-movies");
  const container = movieListSection || myMoviesSection;

  if (!container) return;

  try {
    const response = await fetch(`${BASE_URL}/movies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const movies = await response.json();
      displayMovies(movies, container);
    } else if (response.status === 429) {
      alert("You've made too many requests. Please try again later.");
    } else {
      alert("Failed to fetch movies");
    }
  } catch (error) {
    console.error("Fetch Movies Error:", error);
  }
}

function displayMovies(movies, container) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    // Populate movieElement with detailed movie information
    movieElement.innerHTML = `
            <img src="${movie.image}" alt="${movie.name}" class="movie-image">
            <h3 class="movie-name">${movie.name}</h3>
            <p class="movie-genre">${movie.genre}</p>
            <p class="movie-length">${movie.length} minutes</p>
        `;

    container.appendChild(movieElement);
  });
}

// Initialize movie fetching for homepage or private area
document.addEventListener("DOMContentLoaded", () => {
  const movieListSection = document.getElementById("movie-list");
  const myMoviesSection = document.getElementById("my-movies");

  if (movieListSection || myMoviesSection) {
    fetchMovies();
  }
});

const addMovieForm = document.getElementById("addMovieForm");

if (addMovieForm) {
  addMovieForm.addEventListener("submit", handleAddMovie);
}

async function handleAddMovie(e) {
  e.preventDefault();

  const movieData = {
    name: document.getElementById("movieName").value,
    screeningDate: document.getElementById("screeningDate").value,
    genre: document.getElementById("genre").value,
    length: document.getElementById("length").value,
    image: document.getElementById("movieImage").value,
  };

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}/movies/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (response.ok) {
      alert("Movie added successfully.");
      fetchMovies();
    } else if (response.status === 429) {
      alert(
        "You have reached your daily limit of adding movies. Please try again tomorrow."
      );
    } else {
      const errorData = await response.json();
      alert("Failed to add movie. " + errorData.message);
    }
  } catch (error) {
    console.error("Add Movie Error:", error);
  }
}
