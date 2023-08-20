(async () => {
  // Function to fetch movie details from OMDB API
  async function fetchMovieDetails(movieId) {
    const apiKey = process.env.OMDB_API_KEY;
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

    const card = document.createElement("a"); // Change to an anchor element
    card.classList.add("movie-card");
    card.href = `https://www.imdb.com/title/${movieId}/`; // IMDb URL
    card.target = "_blank"; // Open in a new tab
    // Inside createMovieCard function
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
  ]; // IMDb IDs for movies

  for (const movieId of movieIds) {
    const movieCard = await createMovieCard(movieId);
    if (movieCard) {
      movieList.appendChild(movieCard);
    }
  }
})();
