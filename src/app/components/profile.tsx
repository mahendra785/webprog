"use client";

import { useState } from "react";
import { User } from "@prisma/client";

interface ProfileSectionProps {
  user: User | null;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  navigateTo: (view: string) => void;
  showToast: (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function ProfileSection({
  user,
  logout,
  updateUser,
  navigateTo,
  showToast,
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "User");
  const [email, setEmail] = useState(user?.email || "user@example.com");

  const handleSaveProfile = () => {
    updateUser({ name, email });
    setIsEditing(false);

    showToast(
      "Profile Updated",
      "Your profile has been successfully updated.",
      "success"
    );
  };

  const handleLogout = () => {
    logout();
    navigateTo("home");

    showToast(
      "Logged Out",
      "You have been successfully logged out.",
      "success"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-700 to-red-900 h-32 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">User Profile</h1>
          </div>

          <div className="p-8">
            <div className="flex flex-col items-center -mt-20 mb-8">
              <div className="h-32 w-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
                <img
                  src="/placeholder.svg?height=128&width=128"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Subscription
                  </label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-300">
                    Premium
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center"
                    onClick={handleSaveProfile}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Name</h3>
                    <p className="text-lg">{name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Email</h3>
                    <p className="text-lg">{email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Subscription
                    </h3>
                    <p className="text-lg">Premium</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Member Since
                    </h3>
                    <p className="text-lg">March 2023</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                  <button
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
                    onClick={() => setIsEditing(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Viewing History</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="/placeholder.svg?height=60&width=100"
                alt="Movie thumbnail"
                className="h-16 w-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">The Mandalorian</h3>
                <p className="text-sm text-gray-400">Watched 2 days ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <img
                src="/placeholder.svg?height=60&width=100"
                alt="Movie thumbnail"
                className="h-16 w-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">Stranger Things</h3>
                <p className="text-sm text-gray-400">Watched 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
