"use client";

import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import YouTubePlayer from "../../components/YoutubePlayer";

export default function PartyControls({
  title,
  description,
}: {
  title: string;
  description: string;
  thumbnail: string;
}) {
  const videoId = "dQw4w9WgXcQ";
  const [partyCode, setPartyCode] = useState("");
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Generate a random party code if host
    if (typeof window !== "undefined" && !window.location.hash) {
      const code = Math.random().toString(36).substring(2, 8);
      window.location.hash = code;
      setPartyCode(code);
    } else {
      setPartyCode(window.location.hash.substring(1));
    }

    // Set username from localStorage or prompt
    const storedUsername = localStorage.getItem("ott-username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const newUsername = prompt("Enter your username") || "Anonymous";
      setUsername(newUsername);
      localStorage.setItem("ott-username", newUsername);
    }

    // Socket.io connection
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("join-party", {
        partyCode: window.location.hash.substring(1),
        username,
        videoId,
      });
    });

    socket.on("party-members", (members: string[]) => {
      setPartyMembers(members);
    });

    return () => {
      socket.off("connect");
      socket.off("party-members");
      socket.disconnect();
    };
  }, [username, videoId]);

  const copyPartyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/party/${videoId}#${partyCode}`
    );
    alert("Party link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <YouTubePlayer className="w-full" />

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Party Code: </span>
            <span className="bg-yellow-100 px-2 py-1 rounded">{partyCode}</span>
          </div>
          <button
            onClick={copyPartyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Invite Friends
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">
          Party Members ({partyMembers.length})
        </h3>
        <ul className="space-y-1">
          {partyMembers.map((member) => (
            <li key={member} className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
