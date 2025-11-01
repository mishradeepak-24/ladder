

// "use client";

// import React, { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useSearchParams } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogHeader,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// // ✅ Normalize type
// function normalizeMatchType(raw) {
//   if (!raw) return "best of 3";
//   const str = String(raw).toLowerCase().trim();
//   const compact = str.replace(/[\s_-]/g, "");
//   if (
//     str.includes("5") ||
//     compact.includes("bo5") ||
//     compact.includes("bestof5") ||
//     compact.includes("bestoffive")
//   ) {
//     return "best of 5";
//   }
//   return "best of 3";
// }

// export default function PlayerStatsBox() {
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   // ✅ Pick correct ladder by ID
//   const ladders = useSelector((state) => state.fetchLadder?.allLadders || []);
//   const currentLadder = ladders.find(
//     (ladder) => String(ladder.id) === String(ladderId)
//   );
//   const type = currentLadder?.type || "";

//   const userId = useSelector((state) => state.player.selectedPlayer.id);
//   const matchType = useMemo(() => normalizeMatchType(type), [type]);

//   if (!currentLadder) {
//     return (
//       <div className="text-center text-gray-500 mt-6">
//         Loading ladder details...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 max-w-lg mx-auto">
//       <div className="flex justify-center items-center">
//         <h2 className="text-xl font-semibold">
//          Match type: {" "}
//           <span className="text-blue-600 capitalize">{matchType}</span>
//         </h2>
//       </div>

//       <PlayerStatsUser
//         userId={userId}
//         ladderId={ladderId}
//         matchType={matchType}
//       />
//     </div>
//   );
// }

// function PlayerStatsUser({ userId, ladderId, matchType }) {
//   const dispatch = useDispatch();
//   const { data, loading, error } = useSelector((state) => state.playerResult);

//   useEffect(() => {
//     if (userId && ladderId) {
//       dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
//     }
//   }, [userId, ladderId, dispatch]);

//   const playerData = data?.result;
//   const winRank = data?.win_rank;

//   if (loading)
//     return (
//       <Card className="w-full mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle>Loading Player Stats...</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded mb-2" />
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded mb-2" />
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
//         </CardContent>
//       </Card>
//     );

//   if (error)
//     return (
//       <Card className="w-full mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle className="text-red-600">Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-500">{error}</p>
//         </CardContent>
//       </Card>
//     );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="flex justify-center"
//     >
//       <div className="w-full sm:w-full lg:max-w-md overflow-auto">
//         <div className="flex justify-center items-center px-4 py-3">
      

//           {/* ✅ Stats Explained Dialog */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
//                 Stats Explained
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-xl">
//               <DialogHeader>
//                 <DialogTitle className="text-center text-lg font-bold text-blue-900">
//                   Your score points on this basis
//                 </DialogTitle>
//                 <DialogDescription className="mt-4 space-y-2 text-sm text-black">
//                   {matchType === "best of 5" ? (
//                     <>
//                       <span>(i) WIN v Higher-section: +8</span> <br />
//                       <span>(ii) WIN v Same section: +4</span> <br />
//                       <span>(iii) WIN v Lower section: +2</span> <br />
//                       <span>(iv) LOSS v Higher section: -4</span> <br />
//                       <span>(-2 if 3-1) (-0 if 3-2)</span>
//                       <br />
//                       <span>(v) LOSS v Same section: -6</span> <br />
//                       <span>(-4 if 3-1) (-2 if 3-2)</span>
//                       <br />
//                       <span className="font-semibold">
//                         (vi) LOSS v Lower section: -10
//                       </span>
//                       <br />
//                       <span>(-8 if 3-1) (-6 if 3-2)</span>
//                       <br />
//                     </>
//                   ) : (
//                     <>
//                       <span>(i) WIN v Higher-section: +8</span> <br />
//                       <span>(ii) WIN v Same section: +4</span> <br />
//                       <span>(iii) WIN v Lower section: +2</span> <br />
//                       <span>(iv) LOSS v Higher section: -4</span> <br />
//                       <span>(-2 if 2-1)</span>
//                       <br />
//                       <span>(v) LOSS v Same section: -6</span> <br />
//                       <span>(-4 if 2-1)</span>
//                       <br />
//                       <span className="font-semibold">
//                         (vi) LOSS v Lower section: -10
//                       </span>
//                       <br />
//                       <span>(-8 if 2-1)</span>
//                       <br />
//                     </>
//                   )}
//                 </DialogDescription>
//               </DialogHeader>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* ✅ Table content */}
//         {playerData ? (
//           <div className="w-full overflow-x-auto">
//             <Table className="w-full text-sm">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Games</TableHead>
//                   <TableHead className="text-green-600">Wins</TableHead>
//                   <TableHead className="text-red-600">Win%</TableHead>
//                   <TableHead>Points</TableHead>
//                   <TableHead>Avg.Points</TableHead>
//                   <TableHead>Rank</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <motion.tr
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="border-b"
//                 >
//                   <TableCell>{playerData?.total_game}</TableCell>
//                   <TableCell className="font-semibold text-green-600">
//                     {playerData?.total_win}
//                   </TableCell>
//                   <TableCell className="font-semibold text-red-600">
//                     {playerData?.total_game > 0
//                       ? (
//                           (playerData?.total_win / playerData?.total_game) *
//                           100
//                         ).toFixed(2) + "%"
//                       : "0%"}
//                   </TableCell>
//                   <TableCell className="font-semibold">
//                     {playerData?.total_point}
//                   </TableCell>
//                   <TableCell className="font-semibold">
//                     {playerData?.total_game > 0
//                       ? (
//                           playerData?.total_point / playerData?.total_game
//                         ).toFixed(2)
//                       : 0}
//                   </TableCell>
//                   <TableCell className="font-semibold">{winRank ?? "-"}</TableCell>
//                 </motion.tr>
//               </TableBody>
//             </Table>

//                    <div className="text-center font-semibold text-md mt-4">
//         <p>Need three results to get a ranking</p>
//       </div>
//           </div>

//         ) : (
//           <p className="text-gray-500 text-center">
//             No stats found for this player.
//           </p>
//         )}
//       </div>

     
//     </motion.div>
//   );
// }






// =========================

"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// ✅ Normalize match type
function normalizeMatchType(raw) {
  if (!raw) return "best of 3";
  const str = String(raw).toLowerCase().trim();
  const compact = str.replace(/[\s_-]/g, "");
  if (
    str.includes("5") ||
    compact.includes("bo5") ||
    compact.includes("bestof5") ||
    compact.includes("bestoffive")
  ) {
    return "best of 5";
  }
  return "best of 3";
}

export default function PlayerStatsBox() {
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladder_id");

  // ✅ Ladder selection
  const ladders = useSelector((state) => state.fetchLadder?.allLadders || []);
  const currentLadder = ladders.find(
    (ladder) => String(ladder.id) === String(ladderId)
  );
  const type = currentLadder?.type || "";

  const userId = useSelector((state) => state.player.selectedPlayer?.id);
  const matchType = useMemo(() => normalizeMatchType(type), [type]);

  if (!currentLadder) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Loading ladder details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-semibold">
          Match Type:{" "}
          <span className="text-blue-600 capitalize">{matchType}</span>
        </h2>
      </div>

      <PlayerStatsUser
        userId={userId}
        ladderId={ladderId}
        matchType={matchType}
      />
    </div>
  );
}

function PlayerStatsUser({ userId, ladderId, matchType }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.playerResult);

  useEffect(() => {
    if (userId && ladderId) {
      dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
    }
  }, [userId, ladderId, dispatch]);

  const playerData = data?.result;
  const winRank = data?.win_rank;

  if (loading)
    return (
      <Card className="w-full mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Loading Player Stats...</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-full bg-gray-200 animate-pulse rounded mb-2"
            />
          ))}
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className="w-full mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center"
    >
      <div className="w-full sm:w-full lg:max-w-md overflow-x-auto">
        {/* Header + Dialog */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-2 py-3 gap-3">
          {/* <h1 className="text-base sm:text-lg font-semibold text-center sm:text-left">
            Player Stats • {matchType}
          </h1> */}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                Stats Explained
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-w-[90vw] p-4">
              <DialogHeader>
                <DialogTitle className="text-center text-base sm:text-lg font-bold text-blue-900">
                  Your score points on this basis
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm sm:text-base text-black space-y-1">
                  {matchType === "best of 5" ? (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 3-1) (-0 if 3-2)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 3-1) (-2 if 3-2)</p>
                      <p className="font-semibold">
                        (vi) LOSS v Lower section: -10
                      </p>
                      <p>(-8 if 3-1) (-6 if 3-2)</p>
                    </>
                  ) : (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 2-1)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 2-1)</p>
                      <p className="font-semibold">
                        (vi) LOSS v Lower section: -10
                      </p>
                      <p>(-8 if 2-1)</p>
                    </>
                  )}
                  <br/>
                  <br/>

                         <p className="sm:text-start text-center font-semibold text-sm  ">
                      Your points are totalled and divided by the total number
                      of games you played to give you your “average points per
                      game”
                      <br />
                      <span className="text-sm">
                        This helps to balance out points from players who play a
                        lot and those who don’t
                      </span>
                    </p>
                    <br />
                    <p className="text-red-600 italic flex gap-2 items-center">
                      Your “average points per match” is
                      your Playing Performance
                    </p>
                    <br />
                    <p className="underline text-center">
                      Your “Playing Performance” is then ranked
                    </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Section */}
        {playerData ? (
          <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <Table className="w-full text-xs sm:text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Games</TableHead>
                  <TableHead className="text-green-600">Wins</TableHead>
                  <TableHead className="text-red-600">Win%</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Avg</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-b"
                >
                  <TableCell>{playerData?.total_game}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {playerData?.total_win}
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
{((playerData?.total_win / playerData?.total_game) * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="font-semibold">
                    {playerData?.total_point}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {playerData?.total_game > 0
                      ? (
                          playerData?.total_point / playerData?.total_game
                        ).toFixed(2)
                      : 0}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {winRank ?? "-"}
                  </TableCell>
                </motion.tr>
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No stats found for this player.
          </p>
        )}

        {/* ✅ Footer Text */}
        <div className="text-center font-medium text-gray-600 text-sm mt-4">
          Need three results to get a ranking
        </div>
      </div>
    </motion.div>
  );
}
