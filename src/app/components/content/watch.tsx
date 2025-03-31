"use client";

import { useEffect, useRef, useState } from "react";
import { X, Users, Copy } from "lucide-react";
import { io } from "socket.io-client";

// Create a socket instance
export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
  {
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
);

// Party Watch Modal Component
interface PartyWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateParty: () => void;
  onJoinParty: (partyId: string) => void;
  partyId: string | null;
  partyMembers: string[];
  isHost: boolean;
}

export function PartyWatchModal({
  isOpen,
  onClose,
  onCreateParty,
  onJoinParty,
  partyId,
  partyMembers,
  isHost,
}: PartyWatchModalProps) {
  const [joinPartyId, setJoinPartyId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setJoinPartyId("");
      setCopied(false);
    }
  }, [isOpen]);
  if (typeof window !== "undefined") {
    // Safe to use `window` here
    console.log(window.innerWidth); // or other window-dependent code
  }

  const handleCopyLink = () => {
    if (partyId) {
      navigator.clipboard.writeText(
        `${window.location.origin}?party=${partyId}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Users className="mr-2" /> Party Watch
        </h2>

        {!partyId ? (
          <>
            <div className="space-y-4">
              <button
                onClick={onCreateParty}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Create a Party
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">
                    or join existing
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={joinPartyId}
                  onChange={(e) => setJoinPartyId(e.target.value)}
                  placeholder="Enter party ID"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={() => joinPartyId && onJoinParty(joinPartyId)}
                  disabled={!joinPartyId}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 p-3 bg-gray-800 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Party ID:</span>
                <button
                  onClick={handleCopyLink}
                  className="text-red-500 hover:text-red-400 text-sm flex items-center"
                >
                  {copied ? "Copied!" : "Copy Link"}
                  {!copied && <Copy className="ml-1 w-3 h-3" />}
                </button>
              </div>
              <div className="font-mono text-white bg-gray-900 p-2 rounded text-sm break-all">
                {partyId}
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 text-sm mb-2 flex items-center">
                <Users className="mr-1 w-4 h-4" /> Party Members (
                {partyMembers.length})
              </h3>
              <ul className="bg-gray-800 rounded-md divide-y divide-gray-700">
                {partyMembers.map((member, index) => (
                  <li key={index} className="py-2 px-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-white">
                      {member} {isHost && index === 0 ? "(Host)" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>
                {isHost
                  ? "You're the host. Everyone in the party will follow your playback."
                  : "The host controls playback for everyone in the party."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Party Watch Component with Socket Logic
export function PartyWatch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Check URL for party ID on initial load
    const params = new URLSearchParams(window.location.search);
    const urlPartyId = params.get("party");
    if (urlPartyId) {
      setIsModalOpen(true);
      joinParty(urlPartyId);
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      // Reset party state on disconnect
      setPartyId(null);
      setPartyMembers([]);
      setIsHost(false);
    }

    function onPartyCreated(data: { partyId: string; username: string }) {
      setPartyId(data.partyId);
      setPartyMembers([data.username]);
      setIsHost(true);

      // Update URL with party ID
      const url = new URL(window.location.href);
      url.searchParams.set("party", data.partyId);
      window.history.pushState({}, "", url);
    }

    function onPartyJoined(data: {
      partyId: string;
      members: string[];
      isHost: boolean;
    }) {
      setPartyId(data.partyId);
      setPartyMembers(data.members);
      setIsHost(data.isHost);

      // Update URL with party ID
      const url = new URL(window.location.href);
      url.searchParams.set("party", data.partyId);
      window.history.pushState({}, "", url);
    }

    function onPartyMembers(members: string[]) {
      setPartyMembers(members);
    }

    function onPartyError(error: string) {
      console.error("Party error:", error);
      // You could add toast notifications here
    }

    // Set up socket event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("party:created", onPartyCreated);
    socket.on("party:joined", onPartyJoined);
    socket.on("party:members", onPartyMembers);
    socket.on("party:error", onPartyError);

    return () => {
      // Clean up event listeners
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("party:created", onPartyCreated);
      socket.off("party:joined", onPartyJoined);
      socket.off("party:members", onPartyMembers);
      socket.off("party:error", onPartyError);
    };
  }, []);

  // Handle creating a new party
  const createParty = () => {
    socket.connect();

    // Generate a random username for demo purposes
    // In a real app, you'd likely have user authentication
    const username = `User_${Math.floor(Math.random() * 10000)}`;
    console.log("Creating party with username:", username);
    socket.emit("party:create", { username });
  };

  // Handle joining an existing party
  const joinParty = (partyId: string) => {
    if (!isConnected) {
      socket.connect();
    }

    // Generate a random username for demo purposes
    const username = `User_${Math.floor(Math.random() * 10000)}`;

    socket.emit("party:join", { partyId, username });
  };

  // Handle closing the modal and leaving the party
  const closeModal = () => {
    if (partyId) {
      socket.emit("party:leave");

      // Remove party ID from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("party");
      window.history.pushState({}, "", url);

      setPartyId(null);
      setPartyMembers([]);
      setIsHost(false);
    }

    setIsModalOpen(false);
  };

  // Function to open the modal
  const openPartyModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={openPartyModal}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
      >
        Watch with Friends
      </button>

      {/* Party Watch Modal */}
      <PartyWatchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreateParty={createParty}
        onJoinParty={joinParty}
        partyId={partyId}
        partyMembers={partyMembers}
        isHost={isHost}
      />
    </>
  );
}

// Video Player with Party Watch Integration
interface VideoPlayerWithPartyProps {
  videoUrl: string;
}

export function VideoPlayerWithParty({ videoUrl }: VideoPlayerWithPartyProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    function onPartyJoined(data: { partyId: string; isHost: boolean }) {
      setPartyId(data.partyId);
      setIsHost(data.isHost);
    }

    function onPartyLeft() {
      setPartyId(null);
      setIsHost(false);
    }

    function onPlaybackSync(data: { isPlaying: boolean; currentTime: number }) {
      const video = videoRef.current;
      if (!video || isHost) return;

      // Update video state based on host's playback
      video.currentTime = data.currentTime;

      if (data.isPlaying && video.paused) {
        video.play().catch((err) => console.error("Error playing video:", err));
      } else if (!data.isPlaying && !video.paused) {
        video.pause();
      }
    }

    // Set up socket event listeners
    socket.on("party:joined", onPartyJoined);
    socket.on("party:left", onPartyLeft);
    socket.on("playback:sync", onPlaybackSync);

    return () => {
      // Clean up event listeners
      socket.off("party:joined", onPartyJoined);
      socket.off("party:left", onPartyLeft);
      socket.off("playback:sync", onPlaybackSync);
    };
  }, [isHost]);

  // Sync playback when host controls change
  useEffect(() => {
    if (!partyId || !isHost) return;

    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;

      socket.emit("playback:update", {
        isPlaying: !video.paused,
        currentTime: video.currentTime,
      });
    };

    // Set up video event listeners for host
    const video = videoRef.current;
    if (video) {
      video.addEventListener("play", syncPlayback);
      video.addEventListener("pause", syncPlayback);
      video.addEventListener("seeked", syncPlayback);

      // Sync every 5 seconds during playback
      const interval = setInterval(() => {
        if (!video.paused) {
          syncPlayback();
        }
      }, 5000);

      return () => {
        video.removeEventListener("play", syncPlayback);
        video.removeEventListener("pause", syncPlayback);
        video.removeEventListener("seeked", syncPlayback);
        clearInterval(interval);
      };
    }
  }, [partyId, isHost]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full rounded-lg"
        controls
      />

      <div className="absolute top-4 right-4 z-10">
        <PartyWatch />
      </div>

      {partyId && !isHost && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
          Party Mode: Host controls playback
        </div>
      )}
    </div>
  );
}

// Example usage component
export default function PartyWatchExample() {
  // Connection status display
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Party Watch Demo</h1>

      <div className="max-w-4xl mx-auto">
        <VideoPlayerWithParty videoUrl="https://www.youtube.com/watch?v=3-ELBiUkUWc&t=4116s" />

        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <p>Status: {isConnected ? "connected" : "disconnected"}</p>
          <p>Transport: {transport}</p>
        </div>
      </div>
    </div>
  );
}
