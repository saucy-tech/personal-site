'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileProps {
  name: string;
  bio: string;
  imageSrc: string;
}

const Profile: React.FC<ProfileProps> = ({ name, bio, imageSrc }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full mx-auto px-2 mb-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--accent)] shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
        )}
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{name.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={`${name}'s profile photo`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 128px) 100vw, 128px"
            onLoad={handleImageLoad}
            onError={handleImageError}
            quality={85}
          />
        )}
      </div>

      <div className="text-center w-full">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{name}</h1>

        <div className="w-full max-w-2xl mx-auto px-4">
          <p className="mx-auto px-2 sm:px-8 text-base sm:text-lg text-center text-[var(--text-secondary)] whitespace-normal">
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
