'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      className="flex flex-col items-center space-y-4 w-full mx-auto px-2 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--accent)] shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
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
      </motion.div>

      <motion.div
        className="text-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{name}</h1>

        {/* Bio with proper overflow handling */}
        <div className="relative w-full max-w-2xl mx-auto px-4">
          {/* Bio text container */}
          <div className="overflow-x-auto overflow-y-hidden pb-1 no-scrollbar">
            <motion.p
              className="text-[var(--text-secondary)] text-center whitespace-normal sm:whitespace-nowrap mx-auto px-2 sm:px-8 text-base sm:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {bio}
            </motion.p>
          </div>

          {/* Gradient fades for overflow */}
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
