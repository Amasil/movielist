// Asynchronous function to set up the movie list and genre filter buttons
(async () => {
  // Function to fetch movie details from OMDB API
  async function fetchMovieDetails(movieId) {
    const apiKey = "da76dc6a"; // Your OMDB API key
    const url = `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

    try {
      // Fetch movie details from OMDB API
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  }

  // Function to create a movie card with details
  async function createMovieCard(movieId) {
    const movieData = await fetchMovieDetails(movieId);

    if (!movieData || movieData.Response === "False") {
      return null;
    }

    // Create a movie card element
    const card = document.createElement("div");
    card.classList.add("movie-card");

    // Fill in movie card content with fetched data
    card.innerHTML = `
      <img src="${movieData.Poster}" alt="${movieData.Title}">
      <h2 class="title">${movieData.Title} (${movieData.Year})</h2>
      <p class="genre">${movieData.Genre}</p>
      <p class="rating">IMDB Rating: ${movieData.imdbRating}</p>
      <p class="synopsis">${movieData.Plot}</p>
    `;

    return card;
  }

  // Add movie cards to the page
  const movieList = document.getElementById("movie-list");
  const movieIds = [
    "tt1345836",
    "tt9362722",
    "tt0482571",
    "tt1130884",
    "tt0111161",
    "tt0816692",
    "tt1375666",
    "tt0050083",
    "tt4912910",
    "tt15398776",
    "tt0095327",
    "tt0910970",
    "tt1049413",
    "tt0382932",
    "tt5311514",
    "tt2380307",
    "tt7057496",
    "tt0316654",
    "tt6751668",
    "tt2948372",
  ]; // IMDb IDs for movies

  const genreButtonContainer = document.getElementById("genre-buttons");
  let selectedGenre = "all"; // Keep track of the selected genre

  const allMovieCards = [];
  for (const movieId of movieIds) {
    const movieCard = await createMovieCard(movieId);
    if (movieCard) {
      allMovieCards.push(movieCard);
      movieList.appendChild(movieCard);
      // Add a click event listener to each movie card
      movieCard.addEventListener("click", () => {
        openIMDbPage(movieId); // Open the IMDb page for the clicked movie
      });
    }
  }

  // Add "All" button to clear filters
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.addEventListener("click", () => {
    selectedGenre = "all"; // Update the selected genre
    filterMoviesByGenre(selectedGenre);
    highlightSelectedButton(allButton); // Highlight the "All" button and clear others
  });
  genreButtonContainer.appendChild(allButton);

  const genres = new Set();
  allMovieCards.forEach((movieCard) => {
    const genre = movieCard.querySelector(".genre").textContent;
    const movieGenres = genre.split(",").map((genre) => genre.trim());
    movieGenres.forEach((genre) => genres.add(genre));
  });

  genres.forEach((genre) => {
    const button = document.createElement("button");
    button.textContent = genre;
    button.addEventListener("click", () => {
      selectedGenre = genre; // Update the selected genre
      filterMoviesByGenre(selectedGenre);
      highlightSelectedButton(button); // Highlight the selected genre button and clear others
    });
    genreButtonContainer.appendChild(button);
  });

  // Highlight the selected genre button and clear others
  function highlightSelectedButton(selectedButton) {
    const buttons = genreButtonContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      button.classList.remove("selected");
    });
    selectedButton.classList.add("selected");
  }
  // Function to open the IMDb page for a movie
  function openIMDbPage(movieId) {
    window.open(`https://www.imdb.com/title/${movieId}/`, "_blank");
  }
  // Filter movies based on the selected genre
  function filterMoviesByGenre(selectedGenre) {
    allMovieCards.forEach((movieCard) => {
      const genre = movieCard.querySelector(".genre").textContent;
      const movieGenres = genre.split(",").map((genre) => genre.trim());
      if (selectedGenre === "all" || movieGenres.includes(selectedGenre)) {
        movieCard.style.display = "block"; // Show matching movies
      } else {
        movieCard.style.display = "none"; // Hide non-matching movies
      }
    });
  }
})();
