"use client";

import { useState, useEffect } from "react";
import MediaCard from "../../components/ui/media-card";

// Sample TV shows data
const TV_SHOWS_DATA = [
  {
    id: 1,
    title: "Stranger Things",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
  {
    id: 2,
    title: "Breaking Bad",
    image: "/placeholder.svg?height=400&width=300",
    genre: "drama",
  },
  {
    id: 3,
    title: "The Crown",
    image: "/placeholder.svg?height=400&width=300",
    genre: "drama",
  },
  {
    id: 4,
    title: "Game of Thrones",
    image: "/placeholder.svg?height=400&width=300",
    genre: "fantasy",
  },
  {
    id: 5,
    title: "The Mandalorian",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
  {
    id: 6,
    title: "Money Heist",
    image: "/placeholder.svg?height=400&width=300",
    genre: "action",
  },
  {
    id: 7,
    title: "Friends",
    image: "/placeholder.svg?height=400&width=300",
    genre: "comedy",
  },
  {
    id: 8,
    title: "The Office",
    image: "/placeholder.svg?height=400&width=300",
    genre: "comedy",
  },
  {
    id: 9,
    title: "Squid Game",
    image: "/placeholder.svg?height=400&width=300",
    genre: "thriller",
  },
  {
    id: 10,
    title: "The Witcher",
    image: "/placeholder.svg?height=400&width=300",
    genre: "fantasy",
  },
  {
    id: 11,
    title: "Peaky Blinders",
    image: "/placeholder.svg?height=400&width=300",
    genre: "drama",
  },
  {
    id: 12,
    title: "Dark",
    image: "/placeholder.svg?height=400&width=300",
    genre: "sci-fi",
  },
];

interface TVShowsSectionProps {
  isAuthenticated: boolean;
  navigateTo: (view: string, params?: { id: number; type: string }) => void;
}

export default function TVShowsSection({
  isAuthenticated,
  navigateTo,
}: TVShowsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [filteredShows, setFilteredShows] = useState(TV_SHOWS_DATA);

  useEffect(() => {
    // Filter shows based on search term and selected genre
    let result = TV_SHOWS_DATA;

    if (searchTerm) {
      result = result.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      result = result.filter((show) => show.genre === selectedGenre);
    }

    setFilteredShows(result);
  }, [searchTerm, selectedGenre]);

  const handleCardClick = (id: number) => {
    if (isAuthenticated) {
      window.location.href = `/party/${id}`;
    } else {
      navigateTo("login");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">TV Shows</h1>

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
              placeholder="Search TV shows..."
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
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="thriller">Thriller</option>
          </select>
        </div>

        {filteredShows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredShows.map((show) => (
              <MediaCard
                key={show.id}
                id={show.id}
                title={show.title}
                image={show.image}
                type="tvshow"
                onClick={() => handleCardClick(show.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No TV shows found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
