const imageBaseUrl = "https://image.tmdb.org/t/p";
const apikey = "cd15fea9187d35cc3a6e75a69496e208";
const baseUrl = "https://api.themoviedb.org/3";

// QUERY SELECTORS

const movieContainer = document.querySelector("#movies-grid");
const searchInput = document.querySelector("#search-input");
const removeSearchButton = document.querySelector("#close-search-btn");
const loadMoreButton = document.querySelector("#load-more-movies-btn");

let page = 1;
// FETCH LOGIC
async function fetchMovies(query) {
  console.log("Fetching... " + query);

  let filteredMoviesJson;

  if (query === "") {
    filteredMoviesJson = await fetch(
      `${baseUrl}/discover/movie?sort_by=popularity.desc&api_key=${apikey}&page=${page}`
    );
  } else {
    filteredMoviesJson = await fetch(
      `${baseUrl}/search/movie?query=${query}&api_key=${apikey}&page=${page}`
    );
  }

  const filteredMovies = await filteredMoviesJson.json();

  if (page === 1) movieContainer.innerHTML = "";

  filteredMovies.results.forEach((movie) => {
    movieContainer.innerHTML += `
      <div class="movie-card">
        <img
          class="movie-poster"
          src="${imageBaseUrl}/w342${movie.poster_path}"
          alt="${movie.title}"
          title="${movie.title}"
        />
        <div class="movie-title">${movie.title}</div>
        <div class="movie-votes">${movie.vote_average}</div>
      </div>
  `;
  });
}

function toggleCloseButton(e) {
  if (searchInput.value !== "") {
    removeSearchButton.classList.remove("hidden");
  } else if (searchInput.value === "") {
    removeSearchButton.classList.add("hidden");
  }
  if (e.code === "Enter") {
    page = 1;
    fetchMovies(searchInput.value);
  }
}

function handleCloseButton() {
  page = 1;
  fetchMovies("");
  searchInput.value = "";
}

function handleLoadMore() {
  page += 1;
  fetchMovies(searchInput.value);
}

function addEventListeners() {
  searchInput.addEventListener("keydown", toggleCloseButton);
  removeSearchButton.addEventListener("click", handleCloseButton);
  loadMoreButton.addEventListener("click", handleLoadMore);
}

function main() {
  addEventListeners();
  fetchMovies("");
}

main();
