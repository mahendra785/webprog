"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import ReactPlayer from "react-player";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface YouTubePlayerProps {
  startTime?: number;
  className?: string;
}
export default function YouTubePlayer({
  startTime = 0,
  className,
}: YouTubePlayerProps) {
  const videoId = "dQw4w9WgXcQ";
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [ignoreEvents, setIgnoreEvents] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const roomId = `video_${videoId}`;

  // Hardcoded video ID for testing

  // Initialize Socket.IO connection
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit("join:room", roomId);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPlay(time: number) {
      if (!playerRef.current || !isReady || ignoreEvents) return;

      setIgnoreEvents(true);
      playerRef.current.seekTo(time);
      setIsPlaying(true);
      setTimeout(() => setIgnoreEvents(false), 500);
    }

    function onPause(time: number) {
      if (!playerRef.current || !isReady || ignoreEvents) return;

      setIgnoreEvents(true);
      playerRef.current.seekTo(time);
      setIsPlaying(false);
      setTimeout(() => setIgnoreEvents(false), 500);
    }

    function onSeek(time: number) {
      if (!playerRef.current || !isReady || ignoreEvents) return;

      setIgnoreEvents(true);
      playerRef.current.seekTo(time);
      setTimeout(() => setIgnoreEvents(false), 500);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("player:play", onPlay);
    socket.on("player:pause", onPause);
    socket.on("player:seek", onSeek);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("player:play", onPlay);
      socket.off("player:pause", onPause);
      socket.off("player:seek", onSeek);
      socket.disconnect();
    };
  }, [isReady, ignoreEvents, roomId]);

  // Update current time periodically
  useEffect(() => {
    if (!isPlaying || !isReady) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isReady]);

  // Handle player state changes
  const handlePlay = () => {
    if (ignoreEvents) return;
    setIsPlaying(true);
    socket.emit("player:play", currentTime, roomId);
  };

  const handlePause = () => {
    if (ignoreEvents) return;
    setIsPlaying(false);
    socket.emit("player:pause", currentTime, roomId);
  };

  const handleSeek = (seconds: number) => {
    if (ignoreEvents) return;
    setCurrentTime(seconds);
    socket.emit("player:seek", seconds, roomId);
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    if (!ignoreEvents) {
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Controls visibility timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    resetTimeout();

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", resetTimeout);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener("mousemove", resetTimeout);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={playerContainerRef}
        className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group"
      >
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={muted ? 0 : volume}
          onReady={() => {
            setIsReady(true);
            if (startTime > 0) {
              playerRef.current?.seekTo(startTime);
            }
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={(error) => console.error("Player error:", error)}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                start: startTime,
              },
            },
          }}
        />

        {/* Custom Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={([value]) => handleSeek(value)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={() => (isPlaying ? handlePause() : handlePlay())}
                className="text-white hover:text-red-500 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => {
                    setVolume(value);
                    if (value > 0 && muted) setMuted(false);
                  }}
                  className="w-24 cursor-pointer"
                />
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-sm text-white">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
              <span className="hidden sm:inline">| Room: {videoId}</span>
            </div>
          </div>
        </div>

        {/* Big Play Button when paused */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 m-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Play className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Playback is synchronized across all viewers of this video.
      </p>
    </div>
  );
}
