// app/not-found.jsx
"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <motion.h1
        className="text-6xl font-extrabold text-blue-600 mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-gray-600 text-lg mb-8 text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Oops! The page you’re looking for doesn’t exist or you don’t have access.
      </motion.p>

      <motion.button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
        whileHover={{ scale: 1.05 }}
      >
        Go Back Home
      </motion.button>
    </div>
  );
}
