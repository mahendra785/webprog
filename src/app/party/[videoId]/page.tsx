import YouTubePlayer from "../../components/YoutubePlayer";

export default function PartyPage() {
  if (typeof window !== "undefined") {
    // Safe to use `window` here
    console.log(window.innerWidth); // or other window-dependent code
  }
  return (
    <div className="container mx-auto p-4">
      <YouTubePlayer />
    </div>
  );
}
