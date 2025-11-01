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
 
//   const ladderId = useSelector((state)=> state.user?.user?.ladder_id)

//   const typeHere = useSelector((state)=> state.player?.players[ladderId].ladderDetails?.type)
  
//   const type = typeHere || "";


//   const userId = useSelector((state) => state.user?.user?.id);
  

//   const matchType = useMemo(() => normalizeMatchType(type), [type]);

//   if (!typeHere) {
//     return (
//       <div className="text-center text-gray-500 mt-6">
//         Loading ladder details...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 max-w-lg mx-auto">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">
//           Match Format:{" "}
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

//   if (loading) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle>Player Statistics</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
//           <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
//         <CardHeader>
//           <CardTitle className="text-red-600">Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-500">{error}</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   const playerData = data?.result;
//   const winRank = data?.win_rank;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="flex justify-center"
//     >
//       <div className="w-full sm:w-full lg:max-w-md sm:max-w-md md:max-w-md overflow-auto">
//         {/* Header and Dialog */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3">
//           <h1 className="text-base sm:text-lg font-semibold">
//             Player Stats • {matchType}
//           </h1>

//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
//                 Stats Explained
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-xl">
//               <DialogHeader>
//                 <DialogDescription className="space-y-2 text-sm sm:text-base">
//                   <div className="text-black">
//                     <DialogTitle className="text-lg sm:text-2xl font-semibold py-2 mb-4 text-blue-950 text-center border-b">
//                       Your score points on this basis
//                     </DialogTitle>

//                     <DialogDescription className="space-y-2 text-sm sm:text-base text-black">
//                       {matchType === "best of 3" ? (
//                         <>
//                           <span>(i) WIN v Higher-section: +8</span> <br />
//                           <span>(ii) WIN v Same section: +4</span> <br />
//                           <span>(iii) WIN v Lower section: +2</span> <br />
//                           <span>(iv) LOSS v Higher section: -4</span> <br />
//                           <span>(-2 if 2-1)</span><br />
//                           <span>(v) LOSS v Same section: -6</span> <br />
//                           <span>(-4 if 2-1)</span><br />
//                           <span className="font-semibold text-black">(vi) LOSS v Lower section: -10</span><br />
//                           <span>(-8 if 2-1)</span><br />
//                         </>
//                       ) : matchType === "best of 5" ? (
//                         <>
//                           <span>(i) WIN v Higher-section: +8</span> <br />
//                           <span>(ii) WIN v Same section: +4</span> <br />
//                           <span>(iii) WIN v Lower section: +2</span> <br />
//                           <span>(iv) LOSS v Higher section: -4</span> <br />
//                           <span>(-2 if 3-1) (-0 if 3-2)</span><br />
//                           <span>(v) LOSS v Same section: -6</span> <br />
//                           <span>(-4 if 3-1) (-2 if 3-2)</span><br />
//                           <span className="font-semibold text-black">(vi) LOSS v Lower section: -10</span><br />
//                           <span>(-8 if 3-1) (-6 if 3-2)</span><br />
//                         </>
//                       ) : (
//                         <span>No stats rules available for this match type.</span>
//                       )}
//                     </DialogDescription>
//                   </div>
//                 </DialogDescription>
//               </DialogHeader>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Table */}
//         <div>
//           {playerData ? (
//             <div className="w-full overflow-x-auto">
//               <Table className="w-full text-xs sm:text-sm md:text-base">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Games</TableHead>
//                     <TableHead className="text-green-600">Wins</TableHead>
//                     <TableHead className="text-red-600">Win%</TableHead>
//                     <TableHead>Points</TableHead>
//                     <TableHead>Avg.Points</TableHead>
//                     <TableHead>Rank</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <motion.tr
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="border-b"
//                   >
//                     <TableCell>{playerData?.total_game}</TableCell>
//                     <TableCell className="font-semibold text-green-600">
//                       {playerData?.total_win}
//                     </TableCell>
//                     <TableCell className="font-semibold text-red-600">
//                       {playerData?.total_game > 0
//                         ? (
//                             (playerData?.total_win / playerData?.total_game) *
//                             100
//                           ).toFixed(2) + "%"
//                         : "0%"}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {playerData?.total_point}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {playerData?.total_game > 0
//                         ? (
//                             playerData?.total_point / playerData?.total_game
//                           ).toFixed(2)
//                         : 0}
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {winRank ?? "-"}
//                     </TableCell>
//                   </motion.tr>
//                 </TableBody>
//               </Table>

//                           <div className="text-center font-semibold text-md mt-4">
//         <p>Need three results to get a ranking</p>
//       </div>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center">
//               No stats found for this player.
//             </p>
//           )}
//         </div>
//       </div>

   
//     </motion.div>
//   );
// }












// ======================

"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  const ladderId = useSelector((state) => state.user?.user?.ladder_id);
  const typeHere = useSelector(
    (state) => state.player?.players[ladderId]?.ladderDetails?.type
  );
  const type = typeHere || "";
  const userId = useSelector((state) => state.user?.user?.id);

  const matchType = useMemo(() => normalizeMatchType(type), [type]);

  if (!typeHere) {
    return (
      <div className="text-center text-gray-500 mt-6 text-sm sm:text-base">
        Loading ladder details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-center gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Match Format:{" "}
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

  if (loading) {
    return (
      <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Player Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const playerData = data?.result;
  const winRank = data?.win_rank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-center"
    >
      <div className="w-full overflow-hidden rounded-lg shadow-md border border-gray-100">
        {/* Header + Dialog */}
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-center gap-3 px-4 py-3 bg-gray-50 border-b">
          {/* <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            Player Stats • {matchType}
          </h1> */}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5"
              >
                Stats Explained
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-2xl font-semibold py-2 mb-3 text-blue-950 text-center border-b">
                  Your score points on this basis
                </DialogTitle>
                <DialogDescription className="space-y-2 text-sm sm:text-base text-black">
                  {matchType === "best of 3" ? (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 2-1)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 2-1)</p>
                      <p className="font-semibold">(vi) LOSS v Lower section: -10</p>
                      <p>(-8 if 2-1)</p>
                    </>
                  ) : matchType === "best of 5" ? (
                    <>
                      <p>(i) WIN v Higher-section: +8</p>
                      <p>(ii) WIN v Same section: +4</p>
                      <p>(iii) WIN v Lower section: +2</p>
                      <p>(iv) LOSS v Higher section: -4</p>
                      <p>(-2 if 3-1) (-0 if 3-2)</p>
                      <p>(v) LOSS v Same section: -6</p>
                      <p>(-4 if 3-1) (-2 if 3-2)</p>
                      <p className="font-semibold">(vi) LOSS v Lower section: -10</p>
                      <p>(-8 if 3-1) (-6 if 3-2)</p>
                    </>
                  ) : (
                    <p>No stats rules available for this match type.</p>
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

        {/* Table */}
        <div className="overflow-x-auto">
          {playerData ? (
            <div className="min-w-[300px] sm:min-w-full">
              <Table className="w-full text-xs sm:text-sm md:text-base">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Games</TableHead>
                    <TableHead className="text-green-600">Wins</TableHead>
                    <TableHead className="text-red-600">Win%</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Avg.Points</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell>{playerData?.total_game}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {playerData?.total_win}
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                    {/* {playerData?.win_percentage} */}
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

              <div className="text-center font-semibold text-gray-700 text-xs sm:text-sm mt-4 pb-3">
                <p>Need three results to get a ranking</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm py-4">
              No stats found for this player.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
