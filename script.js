(async () => {
  // Function to fetch movie details from OMDB API
  async function fetchMovieDetails(movieId) {
    const apiKey = "da76dc6a"; // Your OMDB API key
    const url = `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  }

  // Function to create movie card
  async function createMovieCard(movieId) {
    const movieData = await fetchMovieDetails(movieId);

    if (!movieData || movieData.Response === "False") {
      return null;
    }

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movieData.Poster}" alt="${movieData.Title}">
      <h2 class="title">${movieData.Title} (${movieData.Year})</h2>
      <p class="genre">${movieData.Genre}</p>
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
    // ... (other movie IDs)
  ]; // IMDb IDs for movies

  const genreButtonContainer = document.createElement("div");
  genreButtonContainer.id = "genre-buttons";
  movieList.appendChild(genreButtonContainer);

  const allMovieCards = [];
  for (const movieId of movieIds) {
    const movieCard = await createMovieCard(movieId);
    if (movieCard) {
      allMovieCards.push(movieCard);
      movieList.appendChild(movieCard);
    }
  }

  const genres = new Set();
  allMovieCards.forEach((movieCard) => {
    const genre = movieCard.querySelector(".genre").textContent;
    const movieGenres = genre.split(",").map((genre) => genre.trim());
    movieGenres.forEach((genre) => genres.add(genre));
  });

  const genreSelect = document.createElement("select");
  genreSelect.id = "genre-select";
  genreSelect.addEventListener("change", () => {
    const selectedGenre = genreSelect.value;
    filterMoviesByGenre(selectedGenre);
  });

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Genres";
  genreSelect.appendChild(defaultOption);

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  genreButtonContainer.appendChild(genreSelect);

  function filterMoviesByGenre(selectedGenre) {
    allMovieCards.forEach((movieCard) => {
      const genre = movieCard.querySelector(".genre").textContent;
      const movieGenres = genre.split(",").map((genre) => genre.trim());
      if (selectedGenre === "all" || movieGenres.includes(selectedGenre)) {
        movieCard.style.display = "block";
      } else {
        movieCard.style.display = "none";
      }
    });
  }
})();
