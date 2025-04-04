'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GalaxyBackground from '@/components/GalaxyBackground';
import Button from '@/components/ui/Button';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <GalaxyBackground>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-[var(--card-background)] backdrop-blur-sm p-8 rounded-lg border border-[var(--card-border)] shadow-xl"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10 
            }}
          >
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-[var(--accent)]" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mt-6 mb-2 text-[var(--accent)]"
          >
            Something went wrong
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[var(--text-secondary)] mb-6"
          >
            {isDev ? error.message : "We're experiencing some technical difficulties. Please try again later."}
          </motion.p>
          
          {isDev && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-left"
            >
              <details className="bg-[rgba(0,0,0,0.3)] p-4 rounded-md overflow-auto text-sm font-mono">
                <summary className="cursor-pointer text-[var(--accent)] mb-2">View Error Details</summary>
                <pre className="p-2 overflow-auto whitespace-pre-wrap text-[var(--text-secondary)] text-xs">
                  {error.stack}
                </pre>
              </details>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={resetErrorBoundary}
              className="flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-hover)]"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Try Again
            </Button>
            
            <Link href="/" passHref>
              <Button 
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[rgba(212,175,55,0.1)]"
              >
                <HomeIcon className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </GalaxyBackground>
  );
};

export default ErrorFallback;

