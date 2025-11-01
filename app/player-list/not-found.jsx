// app/player-list/not-found.jsx
"use client";

import { useRouter } from "next/navigation";

export default function PlayerListNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">
        Oops ! Page Not Found 😕
      </h1>
  
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        Go to Home Page
      </button>
    </div>
  );
}
