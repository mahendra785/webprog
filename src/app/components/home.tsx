"use client";

interface HomePageProps {
  isAuthenticated: boolean;
  navigateTo: (view: string) => void;
}

export default function HomePage({
  isAuthenticated,
  navigateTo,
}: HomePageProps) {
  const handleStartWatching = () => {
    if (isAuthenticated) {
      navigateTo("movies");
    } else {
      navigateTo("login");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1920x1080/?cinema,film')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Watch All The Movies and Shows You Want!
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Stream unlimited movies and TV shows on your phone, tablet, laptop,
            and TV.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-md transition-colors"
            onClick={handleStartWatching}
          >
            Start Watching Now!
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose StreamIt?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Content</h3>
              <p className="text-gray-400">
                Watch thousands of shows and movies, with new titles added
                regularly.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Watch Anywhere</h3>
              <p className="text-gray-400">
                Stream on your phone, tablet, laptop, and TV without paying
                more.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cancel Anytime</h3>
              <p className="text-gray-400">
                Flexible plans with no complicated contracts and no commitments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
