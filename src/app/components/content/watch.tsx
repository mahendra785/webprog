"use client";

import { useState, useEffect } from "react";

// Sample data for movies and TV shows
const MEDIA_DATA = {
  movie: {
    1: {
      title: "Cosmic Adventure",
      description:
        "A journey through space and time that challenges our understanding of the universe.",
      duration: "2h 15m",
      year: 2023,
      rating: "PG-13",
    },
    2: {
      title: "Midnight Memories",
      description:
        "A nostalgic look at the power of friendship and the memories that bind us together.",
      duration: "1h 58m",
      year: 2022,
      rating: "PG",
    },
    // Add more movies as needed
  },
  tvshow: {
    1: {
      title: "Stranger Things",
      description:
        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
      season: 4,
      episodes: 9,
      year: 2022,
      rating: "TV-14",
    },
    2: {
      title: "Breaking Bad",
      description:
        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      season: 5,
      episodes: 16,
      year: 2013,
      rating: "TV-MA",
    },
    // Add more TV shows as needed
  },
};

interface WatchSectionProps {
  mediaId?: number;
  mediaType?: string;
  isAuthenticated: boolean;
  navigateTo: (view: string, params?: any) => void;
  showToast: (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function WatchSection({
  mediaId,
  mediaType,
  isAuthenticated,
  navigateTo,
  showToast,
}: WatchSectionProps) {
  const [mediaData, setMediaData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (
      mediaId &&
      mediaType &&
      (mediaType === "movie" || mediaType === "tvshow")
    ) {
      // Get media data
      const data =
        MEDIA_DATA[mediaType as keyof typeof MEDIA_DATA][
          mediaId as keyof (typeof MEDIA_DATA)["movie" | "tvshow"]
        ];
      if (data) {
        setMediaData(data);
      } else {
        // Redirect to home if invalid parameters
        navigateTo("home");
      }
    } else {
      // Redirect to home if invalid parameters
      navigateTo("home");
    }
  }, [mediaId, mediaType, navigateTo]);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigateTo("login");
      return;
    }

    setIsLiked(!isLiked);

    showToast(
      isLiked ? "Removed from Liked" : "Added to Liked",
      isLiked
        ? "This title has been removed from your liked list."
        : "This title has been added to your liked list.",
      "success"
    );
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      navigateTo("login");
      return;
    }

    setIsInWatchlist(!isInWatchlist);

    showToast(
      isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
      isInWatchlist
        ? "This title has been removed from your watchlist."
        : "This title has been added to your watchlist.",
      "success"
    );
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    showToast(
      "Share Link Copied",
      "The link has been copied to your clipboard.",
      "success"
    );
  };

  const handleGoBack = () => {
    navigateTo(mediaType === "movie" ? "movies" : "tvshows");
  };

  if (!mediaData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <button
          className="mb-4 text-white hover:text-red-500 transition-colors flex items-center"
          onClick={handleGoBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
          <div className="aspect-video bg-black relative">
            <video
              controls
              className="w-full h-full object-contain"
              poster="/placeholder.svg?height=720&width=1280"
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {mediaData.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {mediaType === "movie" ? (
                <>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {mediaData.year}
                  </span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {mediaData.rating}
                  </span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {mediaData.duration}
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    Season {mediaData.season}
                  </span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {mediaData.episodes} Episodes
                  </span>
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {mediaData.rating}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-300 mb-6">{mediaData.description}</p>

            <div className="flex flex-wrap gap-4">
              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  isLiked
                    ? "bg-red-600 hover:bg-red-700"
                    : "border border-gray-600 hover:bg-gray-800"
                } transition-colors`}
                onClick={handleLike}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isLiked ? "Liked" : "Like"}
              </button>

              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  isInWatchlist
                    ? "bg-red-600 hover:bg-red-700"
                    : "border border-gray-600 hover:bg-gray-800"
                } transition-colors`}
                onClick={handleAddToWatchlist}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              <button
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors flex items-center"
                onClick={handleShare}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={`/placeholder.svg?height=300&width=200&text=Related ${
                    index + 1
                  }`}
                  alt={`Related content ${index + 1}`}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">
                    Related Title {index + 1}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
