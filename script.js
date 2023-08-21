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

  const genreDropdown = document.getElementById("genre-dropdown");
  let selectedGenre = "all"; // Track the selected genre

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

  // Create the genre dropdown options
  const genres = new Set();
  allMovieCards.forEach((movieCard) => {
    const genre = movieCard.querySelector(".genre").textContent;
    const movieGenres = genre.split(",").map((genre) => genre.trim());
    movieGenres.forEach((genre) => genres.add(genre));
  });

  // Create the "All Genres" option in the dropdown
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Genres";
  genreDropdown.appendChild(allOption);

  // Create options for other genres in the dropdown
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreDropdown.appendChild(option);
  });

  // Add change event listener to the genre dropdown
  genreDropdown.addEventListener("change", (event) => {
    selectedGenre = event.target.value;
    filterMoviesByGenre(selectedGenre);
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

  // Sort dropdown functionality
  const sortDropdown = document.getElementById("sort-dropdown");

  sortDropdown.addEventListener("change", () => {
    const selectedOption = sortDropdown.value;
    if (selectedOption === "sort") {
      // Revert to default sorting here (if you have one)
      // For example, you can sort by IMDb Highest-Lowest initially.
      sortMoviesByIMDb("highest");
    } else {
      const sortType = selectedOption.split("-")[0];
      const sortOrder = selectedOption.split("-")[1];

      if (sortType === "imdb") {
        sortMoviesByIMDb(sortOrder);
      } else if (sortType === "name") {
        sortMoviesByName(sortOrder);
      }
    }
  });

  // Sort movies by IMDb rating
  function sortMoviesByIMDb(order) {
    allMovieCards.sort((a, b) => {
      const ratingA = parseFloat(
        a.querySelector(".rating").textContent.split(":")[1]
      );
      const ratingB = parseFloat(
        b.querySelector(".rating").textContent.split(":")[1]
      );

      return order === "highest" ? ratingB - ratingA : ratingA - ratingB;
    });

    updateMovieList();
  }

  // Sort movies by title
  function sortMoviesByName(order) {
    allMovieCards.sort((a, b) => {
      const titleA = a.querySelector(".title").textContent;
      const titleB = b.querySelector(".title").textContent;

      if (order === "az") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    updateMovieList();
  }

  // Update the movie list after sorting
  function updateMovieList() {
    movieList.innerHTML = "";
    allMovieCards.forEach((movieCard) => {
      movieList.appendChild(movieCard);
    });
  }
})();
