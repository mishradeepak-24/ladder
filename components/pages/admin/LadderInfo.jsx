// "use client";

// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Info } from "lucide-react";

// export default function LadderInfo() {
//   const ladders = [
//     {
//       id: 1,
//       title: "Win/Lose Ladders",
//       description: "Players move up or down based on wins and losses only. If the match score is not important to the players, then this ladder is the simplest and easiest to use. ",
//     },
//     {
//       id: 2,
//       title: "Best of 3 sports Ladders",
//       description: "“Best of 3” ladders are designed for sports where the results of matches are decided by a “best of 3” result.  Tennis, squash, badminton, table tennis and more are such sports that sometimes use the best of three format. Final scores can be 2-0, 2-1 This ladder is designed to record the match score and the effort of the losing player and reward that effort in his playing performance statistics by reducing the points penalties for losing. ",
//     },
//     {
//       id: 3,
//       title: "Best of 5 sports Ladders",
//       description: "“Best of 5” ladders are designed for sports where the results of matches are decided by a “best of 5” result.  Tennis, squash, badminton, table tennis and more are such sports. Final scores can be 3-0, 3-1 and 3-2. This ladder is designed to record the match score and the effort of the losing player and reward that effort in his playing performance statistics by reducing the points penalties for losing. ",
//     },
//   ];

//   return (
//     <div className="w-full max-w-md">
//       <h2 className="text-2xl font-bold mb-4 text-blue-600">Ladders</h2>
//       <ul className="space-y-3">
//         {ladders.map((ladder) => (
//           <li
//             key={ladder.id}
//             className="flex items-center gap-2"
//           >
//             <div className="flex items-center gap-2 font-semibold">
//               <span className="text-gray-700">({ladder.id})</span>
//               <span>{ladder.title}</span> 
//             </div>

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button className="p-1 rounded-full hover:bg-gray-100 transition">
//                     <Info className="w-6 h-6 cursor-pointer bg-blue-500 rounded-full text-white" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent side="right" className="max-w-xs text-sm">
//                   <p>{ladder.description}</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




// ==================================== 123

"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export default function LadderInfo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const ladders = [
    {
      id: 1,
      title: "Win/Lose Ladders",
      description:
        "Players move up or down based on wins and losses only. If the match score is not important to the players, then this ladder is the simplest and easiest to use.",
    },
    {
      id: 2,
      title: "Best of 3 sports Ladders",
      description:
        "“Best of 3” ladders are designed for sports where the results of matches are decided by a “best of 3” result. Tennis, squash, badminton, table tennis and more are such sports that sometimes use the best of three format. Final scores can be 2-0, 2-1. This ladder is designed to record the match score and the effort of the losing player and reward that effort in his playing performance statistics by reducing the points penalties for losing.",
    },
    {
      id: 3,
      title: "Best of 5 sports Ladders",
      description:
        "“Best of 5” ladders are designed for sports where the results of matches are decided by a “best of 5” result. Tennis, squash, badminton, table tennis and more are such sports. Final scores can be 3-0, 3-1 and 3-2. This ladder is designed to record the match score and the effort of the losing player and reward that effort in his playing performance statistics by reducing the points penalties for losing.",
    },
  ];

  return (
    <div className="w-full max-w-md px-3 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-600">
        Ladders
      </h2>
      <ul className="space-y-3">
        {ladders.map((ladder) => (
          <li
            key={ladder.id}
            className="flex items-start sm:items-center gap-2"
          >
            <div className="flex items-center text-justify sm:flex-row sm:items-center gap-1 sm:gap-2 font-semibold">
              <span className="text-gray-700">({ladder.id})</span>
              <span>{ladder.title}</span>
            </div>

            {isMobile ? (
              // 📱 Mobile → Popover
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-gray-100 transition">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-blue-500 rounded-full text-white" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="max-w-md text-sm leading-snug border-2 bg-white text-black">
                  <p>{ladder.description}</p>
                </PopoverContent>
              </Popover>
            ) : (
              // 💻 Desktop → Tooltip
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-100 transition">
                      <Info className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer bg-blue-500 rounded-full text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={8}
                    className="max-w-md text-sm border-2 bg-white text-black leading-snug break-words"
                  >
                    <p>{ladder.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

