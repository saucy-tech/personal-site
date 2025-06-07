import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 space-y-6">
      <h1 className="text-4xl font-bold">404 – Page Not Found</h1>
      <p className="text-gray-400 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="text-[var(--accent)] hover:underline text-lg">
        ← Back to Home
      </Link>
    </main>
  );
}
