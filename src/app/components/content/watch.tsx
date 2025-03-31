"use client";

import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import ReactPlayer from "react-player";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Settings,
  Download,
  PictureInPicture,
  Subtitles,
  RotateCcw,
  Bookmark,
  Share2,
  Info,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

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

// Sample subtitle data with actual WebVTT content
const SUBTITLE_DATA = {
  english: `WEBVTT

00:00:01.000 --> 00:00:04.000
Welcome to Cosmic Adventure

00:00:05.000 --> 00:00:09.000
A journey through space and time

00:00:10.000 --> 00:00:15.000
That challenges our understanding of the universe

00:00:20.000 --> 00:00:25.000
Directed by John Smith`,

  spanish: `WEBVTT

00:00:01.000 --> 00:00:04.000
Bienvenido a Aventura Cósmica

00:00:05.000 --> 00:00:09.000
Un viaje a través del espacio y el tiempo

00:00:10.000 --> 00:00:15.000
Que desafía nuestra comprensión del universo

00:00:20.000 --> 00:00:25.000
Dirigido por John Smith`,

  french: `WEBVTT

00:00:01.000 --> 00:00:04.000
Bienvenue à l'Aventure Cosmique

00:00:05.000 --> 00:00:09.000
Un voyage à travers l'espace et le temps

00:00:10.000 --> 00:00:15.000
Qui remet en question notre compréhension de l'univers

00:00:20.000 --> 00:00:25.000
Réalisé par John Smith`,
};

// Available subtitle options
const SUBTITLE_OPTIONS = [
  { code: "english", language: "English" },
  { code: "spanish", language: "Spanish" },
  { code: "french", language: "French" },
  { code: "german", language: "German" },
  { code: "japanese", language: "Japanese" },
];

// Available audio tracks
const AUDIO_OPTIONS = [
  { id: "original", name: "Original" },
  { id: "commentary", name: "Director's Commentary" },
  { id: "dubbed_en", name: "English Dubbed" },
  { id: "dubbed_es", name: "Spanish Dubbed" },
];

// Video sources with different qualities
const VIDEO_SOURCES = [
  {
    quality: "1080p",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    quality: "720p",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    quality: "480p",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

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

// Format time helper function
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// State management with reducers
// Player state reducer
type PlayerState = {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  seeking: boolean;
  duration: number;
  playbackRate: number;
  showControls: boolean;
  fullscreen: boolean;
  quality: string;
  videoUrl: string;
};

type PlayerAction =
  | { type: "PLAY_PAUSE" }
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_PLAYED"; payload: number }
  | { type: "SET_SEEKING"; payload: boolean }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_PLAYBACK_RATE"; payload: number }
  | { type: "SET_SHOW_CONTROLS"; payload: boolean }
  | { type: "SET_FULLSCREEN"; payload: boolean }
  | { type: "SET_QUALITY"; payload: string }
  | { type: "SET_VIDEO_URL"; payload: string };

const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case "PLAY_PAUSE":
      return { ...state, playing: !state.playing };
    case "SET_PLAYING":
      return { ...state, playing: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload, muted: action.payload === 0 };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "SET_PLAYED":
      return { ...state, played: action.payload };
    case "SET_SEEKING":
      return { ...state, seeking: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_PLAYBACK_RATE":
      return { ...state, playbackRate: action.payload };
    case "SET_SHOW_CONTROLS":
      return { ...state, showControls: action.payload };
    case "SET_FULLSCREEN":
      return { ...state, fullscreen: action.payload };
    case "SET_QUALITY":
      return { ...state, quality: action.payload };
    case "SET_VIDEO_URL":
      return { ...state, videoUrl: action.payload };
    default:
      return state;
  }
};

// UI state reducer
type UIState = {
  showSettings: boolean;
  showSubtitlesMenu: boolean;
  showAudioMenu: boolean;
  showInfoPanel: boolean;
  brightness: number;
  contrast: number;
};

type UIAction =
  | { type: "TOGGLE_SETTINGS" }
  | { type: "SET_SHOW_SETTINGS"; payload: boolean }
  | { type: "TOGGLE_SUBTITLES_MENU" }
  | { type: "SET_SHOW_SUBTITLES_MENU"; payload: boolean }
  | { type: "TOGGLE_AUDIO_MENU" }
  | { type: "SET_SHOW_AUDIO_MENU"; payload: boolean }
  | { type: "TOGGLE_INFO_PANEL" }
  | { type: "SET_SHOW_INFO_PANEL"; payload: boolean }
  | { type: "SET_BRIGHTNESS"; payload: number }
  | { type: "SET_CONTRAST"; payload: number }
  | { type: "RESET_VIDEO_SETTINGS" };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "TOGGLE_SETTINGS":
      return { ...state, showSettings: !state.showSettings };
    case "SET_SHOW_SETTINGS":
      return { ...state, showSettings: action.payload };
    case "TOGGLE_SUBTITLES_MENU":
      return { ...state, showSubtitlesMenu: !state.showSubtitlesMenu };
    case "SET_SHOW_SUBTITLES_MENU":
      return { ...state, showSubtitlesMenu: action.payload };
    case "TOGGLE_AUDIO_MENU":
      return { ...state, showAudioMenu: !state.showAudioMenu };
    case "SET_SHOW_AUDIO_MENU":
      return { ...state, showAudioMenu: action.payload };
    case "TOGGLE_INFO_PANEL":
      return { ...state, showInfoPanel: !state.showInfoPanel };
    case "SET_SHOW_INFO_PANEL":
      return { ...state, showInfoPanel: action.payload };
    case "SET_BRIGHTNESS":
      return { ...state, brightness: action.payload };
    case "SET_CONTRAST":
      return { ...state, contrast: action.payload };
    case "RESET_VIDEO_SETTINGS":
      return { ...state, brightness: 100, contrast: 100 };
    default:
      return state;
  }
};

// User preferences reducer
type PreferencesState = {
  subtitlesEnabled: boolean;
  subtitlesLanguage: string;
  subtitleBlob: string | null;
  audioTrack: string;
  bookmarked: boolean;
  isLiked: boolean;
  isInWatchlist: boolean;
  watchedPosition: number;
};

type PreferencesAction =
  | { type: "TOGGLE_SUBTITLES" }
  | { type: "SET_SUBTITLES_ENABLED"; payload: boolean }
  | { type: "SET_SUBTITLES_LANGUAGE"; payload: string }
  | { type: "SET_SUBTITLE_BLOB"; payload: string | null }
  | { type: "SET_AUDIO_TRACK"; payload: string }
  | { type: "TOGGLE_BOOKMARK" }
  | { type: "SET_BOOKMARKED"; payload: boolean }
  | { type: "TOGGLE_LIKE" }
  | { type: "SET_LIKED"; payload: boolean }
  | { type: "TOGGLE_WATCHLIST" }
  | { type: "SET_IN_WATCHLIST"; payload: boolean }
  | { type: "SET_WATCHED_POSITION"; payload: number };

const preferencesReducer = (
  state: PreferencesState,
  action: PreferencesAction
): PreferencesState => {
  switch (action.type) {
    case "TOGGLE_SUBTITLES":
      return { ...state, subtitlesEnabled: !state.subtitlesEnabled };
    case "SET_SUBTITLES_ENABLED":
      return { ...state, subtitlesEnabled: action.payload };
    case "SET_SUBTITLES_LANGUAGE":
      return { ...state, subtitlesLanguage: action.payload };
    case "SET_SUBTITLE_BLOB":
      return { ...state, subtitleBlob: action.payload };
    case "SET_AUDIO_TRACK":
      return { ...state, audioTrack: action.payload };
    case "TOGGLE_BOOKMARK":
      return { ...state, bookmarked: !state.bookmarked };
    case "SET_BOOKMARKED":
      return { ...state, bookmarked: action.payload };
    case "TOGGLE_LIKE":
      return { ...state, isLiked: !state.isLiked };
    case "SET_LIKED":
      return { ...state, isLiked: action.payload };
    case "TOGGLE_WATCHLIST":
      return { ...state, isInWatchlist: !state.isInWatchlist };
    case "SET_IN_WATCHLIST":
      return { ...state, isInWatchlist: action.payload };
    case "SET_WATCHED_POSITION":
      return { ...state, watchedPosition: action.payload };
    default:
      return state;
  }
};

export default function WatchSection({
  mediaId,
  mediaType,
  isAuthenticated,
  navigateTo,
  showToast,
}: WatchSectionProps) {
  const [mediaData, setMediaData] = useState<any>(null);

  // Use reducers for better state management
  const [playerState, dispatchPlayer] = useReducer(playerReducer, {
    playing: false,
    volume: 0.8,
    muted: false,
    played: 0,
    seeking: false,
    duration: 0,
    playbackRate: 1,
    showControls: true,
    fullscreen: false,
    quality: "auto",
    videoUrl: "https://www.youtube.com/watch?v=3-ELBiUkUWc",
  });

  const [uiState, dispatchUI] = useReducer(uiReducer, {
    showSettings: false,
    showSubtitlesMenu: false,
    showAudioMenu: false,
    showInfoPanel: false,
    brightness: 100,
    contrast: 100,
  });

  const [preferencesState, dispatchPreferences] = useReducer(
    preferencesReducer,
    {
      subtitlesEnabled: false,
      subtitlesLanguage: "English",
      subtitleBlob: null,
      audioTrack: "Original",
      bookmarked: false,
      isLiked: false,
      isInWatchlist: false,
      watchedPosition: 0,
    }
  );

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const subtitleTrackRef = useRef<HTMLTrackElement | null>(null);

  // Create subtitle blob URL when language changes
  useEffect(() => {
    const languageCode = preferencesState.subtitlesLanguage.toLowerCase();

    // Only create blob for languages we have data for
    if (SUBTITLE_DATA[languageCode as keyof typeof SUBTITLE_DATA]) {
      const subtitleContent =
        SUBTITLE_DATA[languageCode as keyof typeof SUBTITLE_DATA];
      const blob = new Blob([subtitleContent], { type: "text/vtt" });
      const url = URL.createObjectURL(blob);

      dispatchPreferences({ type: "SET_SUBTITLE_BLOB", payload: url });

      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      dispatchPreferences({ type: "SET_SUBTITLE_BLOB", payload: null });
    }
  }, [preferencesState.subtitlesLanguage]);

  // Load media data
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

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      dispatchPlayer({ type: "SET_SHOW_CONTROLS", payload: true });

      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      controlsTimeout.current = setTimeout(() => {
        if (playerState.playing) {
          dispatchPlayer({ type: "SET_SHOW_CONTROLS", payload: false });
        }
      }, 3000);
    };

    const playerContainer = playerContainerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener("mousemove", handleMouseMove);
      playerContainer.addEventListener("mouseenter", handleMouseMove);
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      if (playerContainer) {
        playerContainer.removeEventListener("mousemove", handleMouseMove);
        playerContainer.removeEventListener("mouseenter", handleMouseMove);
      }
    };
  }, [playerState.playing]);

  // Save watch position periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (playerState.playing && playerRef.current) {
        dispatchPreferences({
          type: "SET_WATCHED_POSITION",
          payload: playerRef.current.getCurrentTime(),
        });
        // In a real app, you would save this to a database
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [playerState.playing]);

  // Handle subtitle track creation and attachment
  useEffect(() => {
    if (
      playerRef.current &&
      preferencesState.subtitlesEnabled &&
      preferencesState.subtitleBlob
    ) {
      const videoElement =
        playerRef.current.getInternalPlayer() as HTMLVideoElement;

      if (videoElement) {
        // Remove existing tracks
        while (videoElement.textTracks.length > 0) {
          const track = videoElement.textTracks[0];
          if (track.mode) {
            track.mode = "disabled";
          }
        }

        // Create and add new track
        if (subtitleTrackRef.current) {
          subtitleTrackRef.current.remove();
        }

        const track = document.createElement("track");
        track.kind = "subtitles";
        track.src = preferencesState.subtitleBlob;
        track.srclang = preferencesState.subtitlesLanguage
          .substring(0, 2)
          .toLowerCase();
        track.label = preferencesState.subtitlesLanguage;
        track.default = true;

        videoElement.appendChild(track);
        subtitleTrackRef.current = track;

        // Enable the track
        setTimeout(() => {
          if (videoElement.textTracks[0]) {
            videoElement.textTracks[0].mode = "showing";
          }
        }, 100);
      }
    }
  }, [
    preferencesState.subtitlesEnabled,
    preferencesState.subtitleBlob,
    preferencesState.subtitlesLanguage,
  ]);

  // Handler functions using the reducers
  const handleLike = useCallback(() => {
    if (!isAuthenticated) {
      navigateTo("login");
      return;
    }

    dispatchPreferences({ type: "TOGGLE_LIKE" });

    showToast(
      preferencesState.isLiked ? "Removed from Liked" : "Added to Liked",
      preferencesState.isLiked
        ? "This title has been removed from your liked list."
        : "This title has been added to your liked list.",
      "success"
    );
  }, [isAuthenticated, navigateTo, preferencesState.isLiked, showToast]);

  const handleAddToWatchlist = useCallback(() => {
    if (!isAuthenticated) {
      navigateTo("login");
      return;
    }

    dispatchPreferences({ type: "TOGGLE_WATCHLIST" });

    showToast(
      preferencesState.isInWatchlist
        ? "Removed from Watchlist"
        : "Added to Watchlist",
      preferencesState.isInWatchlist
        ? "This title has been removed from your watchlist."
        : "This title has been added to your watchlist.",
      "success"
    );
  }, [isAuthenticated, navigateTo, preferencesState.isInWatchlist, showToast]);

  const handleShare = useCallback(() => {
    // In a real app, this would open a share dialog
    showToast(
      "Share Link Copied",
      "The link has been copied to your clipboard.",
      "success"
    );
  }, [showToast]);

  const handleGoBack = useCallback(() => {
    navigateTo(mediaType === "movie" ? "movies" : "tvshows");
  }, [mediaType, navigateTo]);

  // Player control handlers
  const handlePlayPause = useCallback(() => {
    dispatchPlayer({ type: "PLAY_PAUSE" });
  }, []);

  const handleSeekChange = useCallback((value: number[]) => {
    dispatchPlayer({ type: "SET_PLAYED", payload: value[0] });
  }, []);

  const handleSeekMouseDown = useCallback(() => {
    dispatchPlayer({ type: "SET_SEEKING", payload: true });
  }, []);

  const handleSeekMouseUp = useCallback((value: number[]) => {
    dispatchPlayer({ type: "SET_SEEKING", payload: false });
    playerRef.current?.seekTo(value[0]);
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    dispatchPlayer({ type: "SET_VOLUME", payload: value[0] });
  }, []);

  const handleToggleMute = useCallback(() => {
    dispatchPlayer({ type: "TOGGLE_MUTE" });
  }, []);

  const handleDuration = useCallback((duration: number) => {
    dispatchPlayer({ type: "SET_DURATION", payload: duration });
  }, []);

  const handleProgress = useCallback(
    (state: {
      played: number;
      playedSeconds: number;
      loaded: number;
      loadedSeconds: number;
    }) => {
      if (!playerState.seeking) {
        dispatchPlayer({ type: "SET_PLAYED", payload: state.played });
      }
    },
    [playerState.seeking]
  );

  const handleSkipForward = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    }
  }, []);

  const handleSkipBackward = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        Math.max(0, playerRef.current.getCurrentTime() - 10)
      );
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handlePictureInPicture = useCallback(async () => {
    try {
      const videoElement =
        playerRef.current?.getInternalPlayer() as HTMLVideoElement;
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoElement) {
        await videoElement.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP error:", error);
      showToast(
        "Feature Not Supported",
        "Picture-in-Picture is not supported in your browser.",
        "error"
      );
    }
  }, [showToast]);

  const handleQualityChange = useCallback((newQuality: string) => {
    dispatchPlayer({ type: "SET_QUALITY", payload: newQuality });
    dispatchUI({ type: "SET_SHOW_SETTINGS", payload: false });
    // In a real app, you would switch the source URL based on quality
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    dispatchPlayer({ type: "SET_PLAYBACK_RATE", payload: rate });
    dispatchUI({ type: "SET_SHOW_SETTINGS", payload: false });
  }, []);

  // Handlers for additional features
  const toggleSubtitles = useCallback(() => {
    dispatchPreferences({ type: "TOGGLE_SUBTITLES" });

    if (!preferencesState.subtitlesEnabled) {
      showToast(
        "Subtitles Enabled",
        `Subtitles in ${preferencesState.subtitlesLanguage} enabled`,
        "info"
      );
    } else {
      showToast("Subtitles Disabled", "Subtitles have been turned off", "info");
    }
  }, [
    preferencesState.subtitlesEnabled,
    preferencesState.subtitlesLanguage,
    showToast,
  ]);

  const handleSubtitleLanguageChange = useCallback(
    (language: string) => {
      dispatchPreferences({
        type: "SET_SUBTITLES_LANGUAGE",
        payload: language,
      });
      dispatchUI({ type: "SET_SHOW_SUBTITLES_MENU", payload: false });

      if (preferencesState.subtitlesEnabled) {
        showToast(
          "Subtitle Language Changed",
          `Subtitles changed to ${language}`,
          "info"
        );
      }
    },
    [preferencesState.subtitlesEnabled, showToast]
  );

  const toggleBookmark = useCallback(() => {
    dispatchPreferences({ type: "TOGGLE_BOOKMARK" });

    const currentTime = playerRef.current?.getCurrentTime() || 0;
    showToast(
      preferencesState.bookmarked ? "Bookmark Removed" : "Bookmark Added",
      preferencesState.bookmarked
        ? "This scene has been removed from your bookmarks."
        : `Scene at ${formatTime(currentTime)} has been bookmarked.`,
      "success"
    );
  }, [preferencesState.bookmarked, showToast]);

  const handleAudioTrackChange = useCallback(
    (track: string) => {
      dispatchPreferences({ type: "SET_AUDIO_TRACK", payload: track });
      dispatchUI({ type: "SET_SHOW_AUDIO_MENU", payload: false });

      showToast("Audio Track Changed", `Audio changed to ${track}`, "info");
    },
    [showToast]
  );

  const handleRestart = useCallback(() => {
    playerRef.current?.seekTo(0);
    dispatchPlayer({ type: "SET_PLAYING", payload: true });
  }, []);

  const handleBrightnessChange = useCallback((value: number[]) => {
    dispatchUI({ type: "SET_BRIGHTNESS", payload: value[0] });
  }, []);

  const handleContrastChange = useCallback((value: number[]) => {
    dispatchUI({ type: "SET_CONTRAST", payload: value[0] });
  }, []);

  const resetVideoSettings = useCallback(() => {
    dispatchUI({ type: "RESET_VIDEO_SETTINGS" });

    showToast(
      "Video Settings Reset",
      "Brightness and contrast have been reset to default",
      "info"
    );
  }, [showToast]);

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

        <div className="bg-white rounded-lg overflow-hidden shadow-xl">
          <div
            ref={playerContainerRef}
            className="aspect-video bg-black relative group"
            onMouseLeave={() => {
              if (playerState.playing) {
                dispatchPlayer({ type: "SET_SHOW_CONTROLS", payload: false });
              }
            }}
            style={{
              filter: `brightness(${uiState.brightness}%) contrast(${uiState.contrast}%)`,
            }}
          >
            <ReactPlayer
              ref={playerRef}
              url={playerState.videoUrl}
              width="100%"
              height="100%"
              playing={playerState.playing}
              volume={playerState.volume}
              muted={playerState.muted}
              playbackRate={playerState.playbackRate}
              onDuration={handleDuration}
              onProgress={handleProgress}
              onEnded={() => {
                dispatchPlayer({ type: "SET_PLAYING", payload: false });
                dispatchPlayer({ type: "SET_PLAYED", payload: 0 });
              }}
              config={{
                file: {
                  payload: 0,
                },
              }}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous",
                    controlsList: "nodownload",
                  },
                },
              }}
            />

            {/* Custom Controls Overlay - REVERSED COLORS from black to white */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent px-4 py-3 transition-opacity duration-300 ${
                playerState.showControls
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress Bar */}
              <div className="mb-2">
                <Slider
                  value={[playerState.played]}
                  min={0}
                  max={1}
                  step={0.001}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekMouseUp}
                  onPointerDown={handleSeekMouseDown}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-black">
                <div className="flex items-center space-x-3 h-[90%]">
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="p-1 rounded-full hover:bg-black/10"
                  >
                    {playerState.playing ? (
                      <Pause className="w-5 h-5 text-black" />
                    ) : (
                      <Play className="w-5 h-5 text-black" />
                    )}
                  </button>

                  {/* Skip Backward */}
                  <button
                    onClick={handleSkipBackward}
                    className="p-1 rounded-full hover:bg-black/10"
                  >
                    <SkipBack className="w-5 h-5 text-black" />
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={handleSkipForward}
                    className="p-1 rounded-full hover:bg-black/10"
                  >
                    <SkipForward className="w-5 h-5 text-black" />
                  </button>

                  {/* Restart */}
                  <button
                    onClick={handleRestart}
                    className="p-1 rounded-full hover:bg-black/10 hidden sm:block"
                  >
                    <RotateCcw className="w-5 h-5 text-black" />
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleMute}
                      className="p-1 rounded-full hover:bg-black/10"
                    >
                      {playerState.muted ? (
                        <VolumeX className="w-5 h-5 text-black" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-black" />
                      )}
                    </button>
                    <div className="w-20 hidden sm:block">
                      <Slider
                        value={[playerState.muted ? 0 : playerState.volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className="text-sm text-black">
                    {formatTime(playerState.played * playerState.duration)} /{" "}
                    {formatTime(playerState.duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Subtitles Button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        dispatchUI({ type: "TOGGLE_SUBTITLES_MENU" })
                      }
                      className={`p-1 rounded-full ${
                        preferencesState.subtitlesEnabled
                          ? "bg-red-500 text-white"
                          : "hover:bg-black/10 text-black"
                      }`}
                    >
                      <Subtitles className="w-5 h-5" />
                    </button>

                    {uiState.showSubtitlesMenu && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg p-2 z-50 text-black">
                        <div className="flex justify-between items-center mb-2 border-b pb-1">
                          <span className="font-medium">Subtitles</span>
                          <button
                            onClick={toggleSubtitles}
                            className={`px-2 py-1 rounded text-xs ${
                              preferencesState.subtitlesEnabled
                                ? "bg-red-500 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {preferencesState.subtitlesEnabled ? "ON" : "OFF"}
                          </button>
                        </div>
                        <div className="flex flex-col space-y-1">
                          {SUBTITLE_OPTIONS.map((option) => (
                            <button
                              key={option.code}
                              className={`text-left px-2 py-1 rounded ${
                                preferencesState.subtitlesLanguage ===
                                option.language
                                  ? "bg-red-500 text-white"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                handleSubtitleLanguageChange(option.language)
                              }
                            >
                              {option.language}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio Tracks */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => dispatchUI({ type: "TOGGLE_AUDIO_MENU" })}
                      className="p-1 rounded-full hover:bg-black/10 text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </button>

                    {uiState.showAudioMenu && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg p-2 z-50 text-black">
                        <div className="text-sm font-medium mb-1 border-b pb-1">
                          Audio Tracks
                        </div>
                        <div className="flex flex-col space-y-1">
                          {AUDIO_OPTIONS.map((option) => (
                            <button
                              key={option.id}
                              className={`text-left px-2 py-1 rounded ${
                                preferencesState.audioTrack === option.name
                                  ? "bg-red-500 text-white"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                handleAudioTrackChange(option.name)
                              }
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={toggleBookmark}
                    className={`p-1 rounded-full ${
                      preferencesState.bookmarked
                        ? "bg-red-500 text-white"
                        : "hover:bg-black/10 text-black"
                    } hidden sm:block`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>

                  {/* Picture in Picture */}
                  <button
                    onClick={handlePictureInPicture}
                    className="p-1 rounded-full hover:bg-black/10 text-black hidden sm:block"
                  >
                    <PictureInPicture className="w-5 h-5" />
                  </button>

                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={() => dispatchUI({ type: "TOGGLE_SETTINGS" })}
                      className="p-1 rounded-full hover:bg-black/10 text-black"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    {uiState.showSettings && (
                      <div className="absolute bottom-full right-0 mb-2 w-60 bg-white rounded-md shadow-lg p-3 z-50 text-black">
                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1 border-b pb-1">
                            Quality
                          </div>
                          <div className="flex flex-col space-y-1">
                            {VIDEO_SOURCES.map((source) => (
                              <button
                                key={source.quality}
                                className={`text-left px-2 py-1 rounded ${
                                  playerState.quality === source.quality
                                    ? "bg-red-500 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                                onClick={() =>
                                  handleQualityChange(source.quality)
                                }
                              >
                                {source.quality}
                              </button>
                            ))}
                            <button
                              className={`text-left px-2 py-1 rounded ${
                                playerState.quality === "auto"
                                  ? "bg-red-500 text-white"
                                  : "hover:bg-gray-200"
                              }`}
                              onClick={() => handleQualityChange("auto")}
                            >
                              Auto
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1 border-b pb-1">
                            Playback Speed
                          </div>
                          <div className="flex flex-col space-y-1">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                className={`text-left px-2 py-1 rounded ${
                                  playerState.playbackRate === rate
                                    ? "bg-red-500 text-white"
                                    : "hover:bg-gray-200"
                                }`}
                                onClick={() => handlePlaybackRateChange(rate)}
                              >
                                {rate === 1 ? "Normal" : `${rate}x`}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Video Adjustments */}
                        <div>
                          <div className="text-sm font-medium mb-1 border-b pb-1">
                            Video Adjustments
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Brightness</span>
                              <span>{uiState.brightness}%</span>
                            </div>
                            <Slider
                              value={[uiState.brightness]}
                              min={50}
                              max={150}
                              step={5}
                              onValueChange={handleBrightnessChange}
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Contrast</span>
                              <span>{uiState.contrast}%</span>
                            </div>
                            <Slider
                              value={[uiState.contrast]}
                              min={50}
                              max={150}
                              step={5}
                              onValueChange={handleContrastChange}
                              className="cursor-pointer"
                            />
                          </div>
                          <button
                            onClick={resetVideoSettings}
                            className="w-full mt-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                          >
                            Reset to Default
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Information Button */}
                  <button
                    onClick={() => dispatchUI({ type: "TOGGLE_INFO_PANEL" })}
                    className="p-1 rounded-full hover:bg-black/10 text-black hidden md:block"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  {/* Download */}
                  <a
                    href={playerState.videoUrl}
                    download
                    className="p-1 rounded-full hover:bg-black/10 text-black hidden md:block"
                    onClick={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        navigateTo("login");
                      }
                    }}
                  >
                    <Download className="w-5 h-5" />
                  </a>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="p-1 rounded-full hover:bg-black/10 text-black"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Play/Pause on video click */}
            <div
              className="absolute inset-0 cursor-pointer h-[80%]"
              onClick={handlePlayPause}
              onDoubleClick={handleFullscreen}
            />

            {/* Big play button when paused */}
            {!playerState.playing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="bg-red-600 text-white rounded-full p-4 hover:bg-red-700 transition-colors"
                >
                  <Play className="w-8 h-8" />
                </button>
              </div>
            )}

            {/* Info Panel */}
            {uiState.showInfoPanel && (
              <div className="absolute top-0 right-0 w-full md:w-1/3 bg-white/90 text-black p-4 m-4 rounded-lg shadow-lg z-50 max-h-[80%] overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{mediaData.title}</h3>
                  <button
                    onClick={() =>
                      dispatchUI({
                        type: "SET_SHOW_INFO_PANEL",
                        payload: false,
                      })
                    }
                    className="text-black hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="text-sm">
                  <p className="mb-2">{mediaData.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {mediaType === "movie" ? (
                      <>
                        <div>Duration: {mediaData.duration}</div>
                        <div>Year: {mediaData.year}</div>
                        <div>Rating: {mediaData.rating}</div>
                      </>
                    ) : (
                      <>
                        <div>Season: {mediaData.season}</div>
                        <div>Episodes: {mediaData.episodes}</div>
                        <div>Year: {mediaData.year}</div>
                        <div>Rating: {mediaData.rating}</div>
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-600">
                      Last watched:{" "}
                      {formatTime(preferencesState.watchedPosition)} /{" "}
                      {formatTime(playerState.duration)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{
                          width: `${
                            (preferencesState.watchedPosition /
                              playerState.duration) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Info and Actions */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {mediaData.title}
            </h1>
            <div className="flex items-center mt-2 text-sm text-gray-300">
              {mediaType === "movie" ? (
                <>
                  <span>{mediaData.year}</span>
                  <span className="mx-2">•</span>
                  <span>{mediaData.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{mediaData.duration}</span>
                </>
              ) : (
                <>
                  <span>Season {mediaData.season}</span>
                  <span className="mx-2">•</span>
                  <span>{mediaData.episodes} Episodes</span>
                  <span className="mx-2">•</span>
                  <span>{mediaData.rating}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                preferencesState.isLiked
                  ? "text-red-500"
                  : "text-white hover:text-red-500"
              } transition-colors`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="hidden sm:inline">
                {preferencesState.isLiked ? "Liked" : "Like"}
              </span>
            </button>
            <button
              onClick={handleAddToWatchlist}
              className={`flex items-center space-x-1 ${
                preferencesState.isInWatchlist
                  ? "text-red-500"
                  : "text-white hover:text-red-500"
              } transition-colors`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline">
                {preferencesState.isInWatchlist
                  ? "In Watchlist"
                  : "Add to Watchlist"}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-white hover:text-red-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  showToast(
                    "Disliked",
                    "Your feedback has been recorded.",
                    "info"
                  );
                } else {
                  navigateTo("login");
                }
              }}
              className="flex items-center space-x-1 text-white hover:text-red-500 transition-colors"
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="hidden sm:inline">Dislike</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-gray-300">{mediaData.description}</p>
        </div>
      </div>
    </div>
  );
}
