"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      <FcGoogle className="h-5 w-5" />
      Sign in with Google
    </button>
  );
}
