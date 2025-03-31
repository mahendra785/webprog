"use client";

import { useState, useEffect } from "react";
import MediaCard from "../../components/ui/media-card";

// Sample movie data
const MOVIES_DATA = [
  {
    id: 1,
    title: "Cosmic Adventure",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
  {
    id: 2,
    title: "Midnight Memories",
    image: "/placeholder.svg?height=400&width=300",
    genre: "drama",
  },
  {
    id: 3,
    title: "Urban Legends",
    image: "/placeholder.svg?height=400&width=300",
    genre: "horror",
  },
  {
    id: 4,
    title: "Digital Frontier",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
  {
    id: 5,
    title: "Silent Echoes",
    image: "/placeholder.svg?height=400&width=300",
    genre: "thriller",
  },
  {
    id: 6,
    title: "Quantum Shift",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
  {
    id: 7,
    title: "Eternal Sunshine",
    image: "/placeholder.svg?height=400&width=300",
    genre: "romance",
  },
  {
    id: 8,
    title: "The Last Stand",
    image: "/placeholder.svg?height=400&width=300",
    genre: "action",
  },
  {
    id: 9,
    title: "Whispers in the Dark",
    image: "/placeholder.svg?height=400&width=300",
    genre: "horror",
  },
  {
    id: 10,
    title: "City of Dreams",
    image: "/placeholder.svg?height=400&width=300",
    genre: "drama",
  },
  {
    id: 11,
    title: "Forgotten Realms",
    image: "/placeholder.svg?height=400&width=300",
    genre: "fantasy",
  },
  {
    id: 12,
    title: "The Heist",
    image: "/placeholder.svg?height=400&width=300",
    genre: "action",
  },
];

interface MoviesSectionProps {
  isAuthenticated: boolean;
  navigateTo: (view: string, params?: any) => void;
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

  const handleCardClick = (id: number) => {
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
