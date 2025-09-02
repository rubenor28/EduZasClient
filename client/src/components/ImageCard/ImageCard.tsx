import React from "react";

interface ImageCardProps {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}

export function ImageCard({
  imageUrl,
  children,
  className = "",
}: ImageCardProps) {
  return (
    <div
      className={`relative bg-cover bg-center flex items-center justify-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        {children}
      </div>
    </div>
  );
}
