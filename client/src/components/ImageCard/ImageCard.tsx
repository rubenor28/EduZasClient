import React from "react";

interface ImageCardProps {
  imageUrl: string;
  children: React.ReactNode;
}

export function ImageCard({ imageUrl, children }: ImageCardProps) {
  return (
    <div
      className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        {children}
      </div>
    </div>
  );
}
