import { useState, useEffect } from "react";
import SearchBar from "./Components/SearchBar";
import MovieCard from "./Components/MovieCard";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

 

  //"72b04d166859d40f13928c523dd8a4fd";

  // Dark / Light Mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Search Movies
  async function searchMovie() {
    if (query.trim() === "") {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setTrailerKey("");

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch movies. Please try again.");
      }

      const data = await response.json();

      setMovies(data.results || []);

      if (!data.results || data.results.length === 0) {
        setError("No movies found. Try another movie name.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // Get Movie Trailer
  async function getTrailer(movieId) {
    setTrailerKey("");
    setError("");

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch trailer.");
      }

      const data = await response.json();

      const trailer = (data.results || []).find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.key
      );

      const teaser = (data.results || []).find(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Teaser" &&
          video.key
      );

      if (trailer || teaser) {
        setTrailerKey((trailer || teaser).key);
      } else {
        setError("Trailer is not available for this movie.");
      }
    } catch (error) {
      setError(error.message || "Unable to load trailer.");
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>🎬 Movie Search App</h1>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark and light mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <p className="app-subtitle">
        Discover movies and watch their trailers!
      </p>

      {/* Search Bar */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        searchMovie={searchMovie}
      />

      {/* Loading */}
      {loading && <p className="status-message">🔍 Searching movies...</p>}

      {/* Error and Empty Results */}
      {error && <p className="status-message">{error}</p>}

      {/* Movie Trailer */}
      {trailerKey && (
        <div className="trailer-box">
          <h2>🎬 Movie Trailer</h2>

          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />

          <br />

          <a
            href={`https://www.youtube.com/watch?v=${trailerKey}`}
            target="_blank"
            rel="noreferrer"
            className="youtube-btn"
          >
            ▶ Watch on YouTube
          </a>
        </div>
      )}

      {/* Movie Results */}
      <div className="movie-container">
        {!loading && movies.length > 0
          ? movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => getTrailer(movie.id)}
              >
                <MovieCard movie={movie} />
              </div>
            ))
          : !loading &&
            !error && (
              <h3 className="empty-message">
                🍿 Search for a movie to get started!
              </h3>
            )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>🎬 Movie Search App | Discover your next favourite movie</p>
        <p>Movie data provided by TMDB.</p>
      </footer>
    </div>
  );
}

export default App;