"use client";

import { useState, useEffect, useRef } from "react";
import MediaCard from "../../components/ui/media-card";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const MOVIES_DATA = [
  {
    id: "bLvqoHBptjg", // Cosmic Adventure
    title: "Cosmic Adventure",
    image: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    genre: "sci-fi",
  },
  {
    id: "PLl99DlL6b4", // Midnight Memories
    title: "Midnight Memories",
    image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    genre: "drama",
  },
  {
    id: "H0VW6sg50Pk", // Urban Legends
    title: "Urban Legends",
    image: "https://image.tmdb.org/t/p/w500/xbSuFiJbbBWCkyCCKIMfuDCA4yV.jpg",
    genre: "horror",
  },
  {
    id: "L8X-9j_TiTg", // Digital Frontier
    title: "Digital Frontier",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genre: "sci-fi",
  },
  {
    id: "Aq8H7cN1R_w", // Silent Echoes
    title: "Silent Echoes",
    image: "https://image.tmdb.org/t/p/w500/8moTOzunF7p40oR5XhlI4hXHSTe.jpg",
    genre: "thriller",
  },
  {
    id: "Wg86eQkdudI", // Quantum Shift
    title: "Quantum Shift",
    image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    genre: "sci-fi",
  },
  {
    id: "0zMfWvX4V0I", // Eternal Sunshine
    title: "Eternal Sunshine",
    image: "https://image.tmdb.org/t/p/w500/k7L95UFpeY6YipBWR4ENrUpN3sL.jpg",
    genre: "romance",
  },
  {
    id: "0vxOhd4qlnA", // The Last Stand
    title: "The Last Stand",
    image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    genre: "action",
  },
  {
    id: "1CbFxGmD0HA", // Whispers in the Dark
    title: "Whispers in the Dark",
    image: "https://image.tmdb.org/t/p/w500/nCrqYEEf3HADxYjsT73RkAPwK3O.jpg",
    genre: "horror",
  },
  {
    id: "dYjQX2lIBHs", // City of Dreams
    title: "City of Dreams",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWuxZD1IRgc7unn4n09.jpg",
    genre: "drama",
  },
  {
    id: "Zy9hL3gPXI8", // Forgotten Realms
    title: "Forgotten Realms",
    image: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    genre: "fantasy",
  },
  {
    id: "Z7AYp7B9n0w", // The Heist
    title: "The Heist",
    image: "https://image.tmdb.org/t/p/w500/l8Vh8uN3rqv7GZiqC2qxjv0VjDl.jpg",
    genre: "action",
  },
];
interface MoviesSectionProps {
  isAuthenticated: boolean;
  navigateTo: (view: string, params?: { id: string; type: string }) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function MoviesSection({
  isAuthenticated,
  navigateTo,
}: MoviesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [filteredMovies, setFilteredMovies] = useState(MOVIES_DATA);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey there! Want movie suggestions based on mood, genre, or anything else? Ask me! 🎬",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      // In your real app, you might want to navigate or push to a route
      // like: navigateTo("party", { id, type: "tvshow" });
      window.location.href = `/party/${id}`;
    } else {
      navigateTo("login");
    }
  };
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setUserInput("");
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing Gemini API key.");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `User asked: "${userInput}"\nAvailable Movies: ${MOVIES_DATA.map(
        (m) => `${m.title} (${m.genre})`
      ).join(", ")}. Suggest the best matches.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text || "Couldn't find a suggestion this time.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong with recommendations.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Trending Movies</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
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

        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
        >
          {showChatbot ? "Hide Suggestions" : "Get Suggestions"}
        </button>
      </div>

      {showChatbot && (
        <div className="mb-8 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-white text-xl font-semibold">
              Movie Suggestions
            </h2>
          </div>
          <div className="h-64 overflow-y-auto p-4 bg-gray-900">
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`mb-4 ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div className="inline-block px-4 py-2 bg-gray-700 rounded-md text-white max-w-xs">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left text-sm text-gray-300">
                Generating suggestions...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask for suggestions..."
              className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}

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
  );
}
