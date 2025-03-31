"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../hooks/use-media-query";

interface NavbarProps {
  isAuthenticated: boolean;
  logout: () => void;
  navigateTo: (view: string) => void;
}

export default function Navbar({
  isAuthenticated,
  logout,
  navigateTo,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Close menu when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  const handleNavigation = (view: string) => {
    navigateTo(view);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigateTo("home");
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="text-2xl font-bold text-red-600 mr-8"
              onClick={() => handleNavigation("home")}
            >
              StreamIt
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <button
                className="text-white hover:text-red-500 transition-colors"
                onClick={() => handleNavigation("home")}
              >
                Home
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors"
                onClick={() => handleNavigation("tvshows")}
              >
                TV Shows
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors"
                onClick={() => handleNavigation("movies")}
              >
                Movies
              </button>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Auth Button (Desktop) */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex space-x-4">
                <button
                  className="text-white hover:text-red-500 transition-colors"
                  onClick={() => handleNavigation("profile")}
                >
                  Profile
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                onClick={() => handleNavigation("login")}
              >
                Log In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <nav className="flex flex-col space-y-4">
              <button
                className="text-white hover:text-red-500 transition-colors text-left"
                onClick={() => handleNavigation("home")}
              >
                Home
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors text-left"
                onClick={() => handleNavigation("tvshows")}
              >
                TV Shows
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors text-left"
                onClick={() => handleNavigation("movies")}
              >
                Movies
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    className="text-white hover:text-red-500 transition-colors text-left"
                    onClick={() => handleNavigation("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-full text-left"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors w-full text-left"
                  onClick={() => handleNavigation("login")}
                >
                  Log In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
