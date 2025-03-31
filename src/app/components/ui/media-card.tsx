"use client";

interface MediaCardProps {
  id: number;
  title: string;
  image: string;
  type: "movie" | "tvshow";
  onClick: () => void;
}

export default function MediaCard({ title, image, onClick }: MediaCardProps) {
  return (
    <div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    </div>
  );
}
