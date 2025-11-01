// // components/PlayerSearchInput.tsx
// "use client";

// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";

// const PlayerSearchInput = ({ value, onChange, placeholder = "Search player by name..." }) => {

//   const [searchQuery, setSearchQuery] = useState("");


//   return (
//     <div className="relative ">
//       <Input
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="pl-10 pr-4 py-4 text-base rounded bg-white/50"
//       />
//       <svg
//         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={1.5}
//         stroke="currentColor"
//         width={20}
//         height={20}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
//         />
//       </svg>
//     </div>
//   );
// };

// export default PlayerSearchInput;








// =================================
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react"; // ✅ clear icon

const PlayerSearchInput = ({ value, onChange, placeholder = "Search player by name..." }) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-9 py-4 text-base rounded bg-white/50"
      />

      {/* 🔍 Search Icon (left side) */}
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={20}
        height={20}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>

      {/* ❌ Clear Button (right side) */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
          type="button"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default PlayerSearchInput;
