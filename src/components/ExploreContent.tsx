"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface CurrentlyListening {
  title: string;
  description: string;
  link: string;
}

interface CurrentlyReading {
  title: string;
  author: string;
  thoughts: string;
}

interface ExploreContentProps {
  currentlyListening: CurrentlyListening;
  currentlyReading: CurrentlyReading;
}

const ExploreContent: React.FC<ExploreContentProps> = ({
  currentlyListening,
  currentlyReading,
}) => {
  return (
    <main className="min-h-screen py-16 px-6 container mx-auto max-w-4xl">
      <div className="mb-16">
        <motion.a
          href="/"
          className="inline-flex items-center text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </motion.a>
      </div>

      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-8 md:mb-16 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Currently Exploring
      </motion.h1>

      <motion.div
        className="space-y-16 md:space-y-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.section 
          className="bg-[rgba(212,175,55,0.15)] backdrop-blur-sm p-8 rounded-lg border border-[rgba(212,175,55,0.3)] shadow-lg shadow-[rgba(0,0,0,0.2)]"
          whileHover={{ 
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            scale: 1.01 
          }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-8">
            Currently Listening
          </h2>
          <div className="space-y-6">
            <h3 className="text-xl text-[#D4AF37]">
              {currentlyListening.title}
            </h3>
            <p className="text-[#F5F5F5]/90">
              {currentlyListening.description}
            </p>
            <motion.a
              href={currentlyListening.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline inline-flex items-center"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              Listen Now
              <ArrowLeftIcon className="h-4 w-4 ml-2 rotate-180" />
            </motion.a>
          </div>
        </motion.section>

        <motion.section 
          className="bg-[rgba(212,175,55,0.15)] backdrop-blur-sm p-8 rounded-lg border border-[rgba(212,175,55,0.3)] shadow-lg shadow-[rgba(0,0,0,0.2)]"
          whileHover={{ 
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            scale: 1.01 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2
          }}
        >
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-8">
            Currently Reading
          </h2>
          <div className="space-y-6">
            <h3 className="text-xl text-[#D4AF37]">{currentlyReading.title}</h3>
            <p className="text-[#F5F5F5]/70">by {currentlyReading.author}</p>
            <p className="text-[#F5F5F5]/90">{currentlyReading.thoughts}</p>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
