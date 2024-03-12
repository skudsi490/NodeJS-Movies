  // API endpoint base URL
  const BASE_URL = "http://localhost:3000/api";

  document.addEventListener("DOMContentLoaded", () => {
    fetchUserMovies();
  });

  async function fetchUserMovies() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/movies/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const movies = await response.json();
        displayUserMovies(movies);
      } else {
        console.error("Failed to fetch movies.");
      }
    } catch (error) {
      console.error("Fetch Movies Error:", error);
    }
  }

  function displayUserMovies(movies) {
    const container = document.getElementById("my-movies");
    container.innerHTML = "";

    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie");

      movieElement.innerHTML = `
              <img src="${movie.image || "default_movie_image.png"}" alt="${
        movie.name
      }" class="my-movie-image">
              <div class="movie-info">
                  <h3 class="movie-name">${movie.name}</h3>
                  <p class="movie-genre">${movie.genre}</p>
                  <p class="movie-length">${movie.length} minutes</p>
                  <button class="edit-movie-btn" data-movie-id="${
                    movie._id
                  }">Edit</button>
                  <button class="delete-movie-btn" data-movie-id="${
                    movie._id
                  }">Delete</button>
              </div>
          `;

      container.appendChild(movieElement);
    });

    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".edit-movie-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const movieId = event.target.dataset.movieId;
        showEditForm(movieId);
      });
    });

    document.querySelectorAll(".delete-movie-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const movieId = event.target.dataset.movieId;
        handleDeleteMovie(movieId);
      });
    });
  }

  async function showEditForm(movieId) {
    const editSection = document.getElementById('edit-movie-form-section');
    const isFormVisible = editSection.style.display === 'block';
    
    // Toggle form visibility if the same movie's edit button is clicked again
    if (isFormVisible && lastEditedMovieId === movieId) {
      editSection.style.display = 'none';
      lastEditedMovieId = null;
      return;
    }

    // Update last edited movie ID
    lastEditedMovieId = movieId;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const movie = await response.json();
        populateEditForm(movie);
        editSection.style.display = 'block'; // Show the form
      } else {
        console.error("Failed to fetch movie details.");
        editSection.style.display = 'none'; // Hide the form on error
      }
    } catch (error) {
      console.error("Fetch Movie Error:", error);
      editSection.style.display = 'none'; // Hide the form on error
    }
  }


  // Function to populate the edit form with movie details
  function populateEditForm(movie) {
    const form = document.getElementById("editMovieForm");

    document.getElementById("movieName").value = movie.name;
    document.getElementById("screeningDate").value = movie.screeningDate.slice(
      0,
      10
    );
    document.getElementById("genre").value = movie.genre;
    document.getElementById("length").value = movie.length;
    document.getElementById("movieImage").value = movie.image;

    form.dataset.movieId = movie._id;

    document.getElementById("edit-movie-form-section").style.display = "block";

    form.scrollIntoView({ behavior: "smooth" });
  }

  // Event listener for the edit button click to show the edit form
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-movie-btn")) {
      const movieId = event.target.getAttribute("data-movie-id");
      showEditForm(movieId);
    }
  });

  // Function to handle the form submission for movie updates
  document
    .getElementById("editMovieForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const movieId = event.currentTarget.dataset.movieId;
      const movieData = {
        name: document.getElementById("movieName").value,
        screeningDate: document.getElementById("screeningDate").value,
        genre: document.getElementById("genre").value,
        length: parseInt(document.getElementById("length").value, 10),
        image: document.getElementById("movieImage").value,
      };

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${BASE_URL}/movies/edit/${movieId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieData),
        });

        if (response.ok) {
          alert("Movie updated successfully.");
          fetchUserMovies();
        } else if (response.status === 429) {
          alert(
            "You have reached your daily limit of updates. Please try again tomorrow."
          );
        } else {
          alert("Failed to update movie.");
        }
      } catch (error) {
        console.error("Update Movie Error:", error);
      }
    });

  // Implement the handleDeleteMovie function
  async function handleDeleteMovie(movieId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/movies/delete/${movieId}`, {
        method: "DELETE",
        headers: {  
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Movie deleted successfully.");
        fetchUserMovies();
      } else if (response.status === 429) {
        alert(
          "You have reached your daily limit of deletions. Please try again tomorrow."
        );
      } else {
        console.error("Failed to delete movie.");
      }
    } catch (error) {
      console.error("Delete Movie Error:", error);
    }
  }
