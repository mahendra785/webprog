"use client";

import { useState, useEffect, useRef } from "react";
import MediaCard from "../../components/ui/media-card";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TVShowsSection({
  isAuthenticated,
  navigateTo,
}: TVShowsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [filteredShows, setFilteredShows] = useState(TV_SHOWS_DATA);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I can suggest TV shows based on your mood, preferences, or shows you already enjoy. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Gemini API key.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Based on the user's request: "${userInput}", suggest TV shows from this list: ${TV_SHOWS_DATA.map(
        (show) => `${show.title} (${show.genre})`
      ).join(", ")}.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text || "I couldn't generate recommendations. Try again!",
        },
      ]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "There was an error fetching recommendations.",
        },
      ]);
    } finally {
      setIsLoading(false);
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

          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center justify-center"
          >
            {showChatbot ? "Hide Suggestions" : "Get Suggestions"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {showChatbot && (
          <div className="mb-8 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-white">
                TV Show Suggestions
              </h2>
            </div>

            <div className="h-64 overflow-y-auto p-4 bg-gray-900 w-full">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "text-left"
                  }`}
                >
                  <div className="bg-gray-700 p-3 rounded-md text-white w-fit">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-800 text-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700 flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for show suggestions based on mood, genre, or similar shows..."
                className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

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
