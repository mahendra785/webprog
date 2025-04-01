"use client";

import { useState, useEffect } from "react";
import MediaCard from "../../components/ui/media-card";

// Updated movie data with real poster URLs and YouTube trailer video IDs as IDs
const MOVIES_DATA = [
  {
    id: "CosmicAdvTrailer",
    title: "Cosmic Adventure",
    image: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    genre: "sci-fi",
  },
  {
    id: "MidnightMemTrailer",
    title: "Midnight Memories",
    image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    genre: "drama",
  },
  {
    id: "UrbanLegendsTrailer",
    title: "Urban Legends",
    image: "https://image.tmdb.org/t/p/w500/xbSuFiJbbBWCkyCCKIMfuDCA4yV.jpg",
    genre: "horror",
  },
  {
    id: "DigitalFrontierTrailer",
    title: "Digital Frontier",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genre: "sci-fi",
  },
  {
    id: "SilentEchoesTrailer",
    title: "Silent Echoes",
    image: "https://image.tmdb.org/t/p/w500/8moTOzunF7p40oR5XhlI4hXHSTe.jpg",
    genre: "thriller",
  },
  {
    id: "QuantumShiftTrailer",
    title: "Quantum Shift",
    image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    genre: "sci-fi",
  },
  {
    id: "EternalSunshineTrailer",
    title: "Eternal Sunshine",
    image: "https://image.tmdb.org/t/p/w500/k7L95UFpeY6YipBWR4ENrUpN3sL.jpg",
    genre: "romance",
  },
  {
    id: "LastStandTrailer",
    title: "The Last Stand",
    image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    genre: "action",
  },
  {
    id: "WhispersInTheDarkTrailer",
    title: "Whispers in the Dark",
    image: "https://image.tmdb.org/t/p/w500/nCrqYEEf3HADxYjsT73RkAPwK3O.jpg",
    genre: "horror",
  },
  {
    id: "CityOfDreamsTrailer",
    title: "City of Dreams",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWuxZD1IRgc7unn4n09.jpg",
    genre: "drama",
  },
  {
    id: "ForgottenRealmsTrailer",
    title: "Forgotten Realms",
    image: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    genre: "fantasy",
  },
  {
    id: "TheHeistTrailer",
    title: "The Heist",
    image: "https://image.tmdb.org/t/p/w500/l8Vh8uN3rqv7GZiqC2qxjv0VjDl.jpg",
    genre: "action",
  },
];

interface MoviesSectionProps {
  isAuthenticated: boolean;
  navigateTo: (view: string, params?: { id: string; type: string }) => void;
}

export default function MoviesSection({
  isAuthenticated,
  navigateTo,
}: MoviesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [filteredMovies, setFilteredMovies] = useState(MOVIES_DATA);

  useEffect(() => {
    // Filter movies based on search term and selected genre
    let result = MOVIES_DATA;

    if (searchTerm) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      result = result.filter((movie) => movie.genre === selectedGenre);
    }

    setFilteredMovies(result);
  }, [searchTerm, selectedGenre]);

  const handleCardClick = (id: string) => {
    if (isAuthenticated) {
      navigateTo("watch", { id, type: "movie" });
    } else {
      navigateTo("login");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Trending Movies</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
          >
            <option value="all">All Genres</option>
            <option value="action">Action</option>
            <option value="drama">Drama</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
            <option value="fantasy">Fantasy</option>
          </select>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <MediaCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.image}
                type="movie"
                onClick={() => handleCardClick(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No movies found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
