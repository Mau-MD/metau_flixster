const imageBaseUrl = "https://image.tmdb.org/t/p";
const apikey = "cd15fea9187d35cc3a6e75a69496e208";
const baseUrl = "https://api.themoviedb.org/3";

// QUERY SELECTORS

const movieContainer = document.querySelector("#movies-grid");
const searchInput = document.querySelector("#search-input");
const removeSearchButton = document.querySelector("#close-search-btn");
const loadMoreButton = document.querySelector("#load-more-movies-btn");
const modalElement = document.querySelector(".modal");

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
      <div class="movie-card" onclick="handleMovieClick('${movie.id}')">
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

async function getMovieInfo(id) {
  const dataJson = await fetch(`${baseUrl}/movie/${id}?api_key=${apikey}`);
  return await dataJson.json();
}

async function getMovieVideo(id) {
  const dataJson = await fetch(
    `${baseUrl}/movie/${id}/videos?api_key=${apikey}`
  );
  return await dataJson.json();
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

function getiFrameDimension() {
  const windowWidth = window.innerWidth;

  if (windowWidth > 1000) {
    return windowWidth * 0.4 - 100;
  }
  if (windowWidth > 800) {
    return windowWidth * 0.6 - 100;
  }
  return windowWidth * 0.8 - 100;
}

async function handleMovieClick(id) {
  const movieInfo = await getMovieInfo(id);
  const movieVideos = await getMovieVideo(id);

  const movieGenresArray = movieInfo.genres.reduce((prev, curr) => {
    prev.push(curr.name);
    return prev;
  }, []);

  console.log(getiFrameDimension());
  modalElement.classList.remove("hidden");
  modalElement.innerHTML = `
    <div class="modal-container">
    ${
      movieInfo.backdrop_path
        ? `
    <div class="modal-poster-container">
      <img class="modal-poster" src="${imageBaseUrl}/original${movieInfo.backdrop_path}"></img>
    </div>
    `
        : ""
    }
    <div class="modal-content">
      <h2 class="modal-title">${movieInfo.title}</h2>
      <p>Runtime: ${movieInfo.runtime}</p>
      <p>Release Date: ${movieInfo.release_date}</p>
      <p>Genres: ${movieGenresArray.join(" ")}</p>
      <p class="modal-description">
      ${movieInfo.overview}
      </p>
      ${
        movieVideos.results.length > 0 &&
        `
        <iframe width="${getiFrameDimension()}" height="300" src="https://www.youtube.com/embed/${
          movieVideos.results[0].key
        }" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      
      `
      }
    </div>
  `;
}

function handleOutsideModalClick() {
  modalElement.classList.add("hidden");
}

function addEventListeners() {
  searchInput.addEventListener("keydown", toggleCloseButton);
  removeSearchButton.addEventListener("click", handleCloseButton);
  loadMoreButton.addEventListener("click", handleLoadMore);
  modalElement.addEventListener("click", handleOutsideModalClick);
}

function main() {
  addEventListeners();
  fetchMovies("");
}

main();
