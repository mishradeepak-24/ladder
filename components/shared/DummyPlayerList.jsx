
// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Badge } from "@/components/ui/badge";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import { fetchGradebars } from "@/redux/slices/gradebarSlice";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Skeleton } from "@/components/ui/skeleton";

// import DummyPlayerStats from "./DummyPlayerStats";

// const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// export default function DummyPlayerList({ ladderId }) {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 State for Player Statistics Modal
//   const [rankList, setRankList] = useState([]);
//   const [rankLoading, setRankLoading] = useState(true);
//   const [rankError, setRankError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // 🔹 Redux Data
//   const players = useSelector(
//     (state) => state.player?.players?.[ladderId]?.data || []
//   );
//   const preset = useSelector((state) => state.gradebar?.preset || 10);
//   const gradebarDetails = useSelector(
//     (state) => state.gradebar?.gradebarDetails || []
//   );
//   const ladderDetails = useSelector(
//     (state) => state.player?.players?.[ladderId]?.ladderDetails || null
//   );

//   // 🔹 Fetch Redux Data
//   useEffect(() => {
//     if (ladderId) {
//       dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//       dispatch(fetchGradebars(ladderId));
//     }
//   }, [ladderId, dispatch]);

//   // 🔹 Fetch Rank List (for Modal)
//   useEffect(() => {
//     const fetchRankList = async () => {
//       if (!ladderId) return setRankLoading(false);
//       try {
//         const res = await axios.get(
//           `https://ne-games.com/leaderBoard/api/user/rank/list?ladder_id=${ladderId}`,
//           { headers: { "Content-Type": "application/json", APPKEY } }
//         );
//         setRankList(res.data?.data || []);
//       } catch (err) {
//         setRankError(
//           err.response?.data?.message || "Failed to fetch rank list"
//         );
//       } finally {
//         setRankLoading(false);
//       }
//     };
//     fetchRankList();
//   }, [ladderId]);

//   // 🔹 Player Filter & Grade Generation
//   const filteredPlayers = players
//     .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => a.rank - b.rank);

//   const generateGrades = (playersArr, gradebarDetails, preset) => {
//     if (!playersArr || playersArr.length === 0) return [];

//     const out = [];
//     let startIndex = 0;
//     const groupSize = Number(preset) || 10;

//     while (startIndex < playersArr.length) {
//       const groupPlayers = playersArr.slice(startIndex, startIndex + groupSize);
//       const gradeIdx = Math.floor(startIndex / groupSize);
//       const gradeLabel =
//         gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
//       out.push({ label: gradeLabel, players: groupPlayers });
//       startIndex += groupSize;
//     }
//     return out;
//   };

//   const grades = generateGrades(filteredPlayers, gradebarDetails, preset);

//   return (
//     <div className="px-2">
//       {/* 🔹 Ladder Title (Members & Local Services section) */}
//       {ladderDetails && (
//         <div className="py-4 text-center sm:text-start px-4">
//           <h2 className="text-2xl font-bold text-blue-600">
//             {ladderDetails.name}
//           </h2>
//           <p className="text-blue-900 text-md border-b-2 border-amber-500 py-1 font-semibold">
//             Admin Details: {ladderDetails.admin_name} (
//             {ladderDetails.admin_phone})
//           </p>

//           {/* 🔹 See Player’s Statistics (Modal Trigger) */}
//           <p
//             onClick={() => setIsModalOpen(true)}
//             className=" bg-blue-600 text-white md:w-[250px] flex items-center justify-center mt-2 text-center cursor-pointer hover:underline  font-semibold"
//           >
//             See Player’s Stats Ranked
//           </p>
//         </div>
//       )}

//       {/* 🔹 Player Rank List Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
//             >
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
//               >
//                 ✕
//               </button>

//               <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
//                 🏅 Player Rank List
//               </h2>

//               <div className="flex justify-center items-center ">
//                 <button className="text-center">
//                   <DummyPlayerStats ladderId = {ladderId} />
//                 </button>
//               </div>

//               {rankLoading ? (
//                 <div className="space-y-4">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Skeleton key={i} className="h-8 w-full rounded-md" />
//                   ))}
//                 </div>
//               ) : rankError ? (
//                 <p className="text-center text-red-600">{rankError}</p>
//               ) : rankList.length === 0 ? (
//                 <p className="text-center text-gray-600">
//                   No ranking data available.
//                 </p>
//               ) : (
//                 <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-inner space-y-2 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
//                   {rankList.map((player, index) => (
//                     <div
//                       key={player.id}
//                       className="flex flex-wrap gap-2 text-sm sm:text-base text-gray-800 font-medium border-b border-gray-200 py-1"
//                     >
//                       <span className="w-6 font-semibold">{index + 1}.</span>
//                       <span className="font-semibold capitalize">
//                         {player.name || "Unknown"}
//                       </span>
//                       <span>Played {player.total_game ?? 0}</span>
//                       <span>Won {player.total_win ?? 0}</span>
//                       <span>
//                         Win %{" "}
//                         {/* {player.win_percentage
//                           ? Number(player.win_percentage).toFixed(2)
//                           : "0.00"} */}
//                           {((player?.total_win / player?.total_game) * 100).toFixed(0)}%

//                       </span>
//                       {/* <span>Lost {player.total_lost ?? 0}</span> */}
//                       <span>Points {player.total_point ?? 0}</span>
                      
//                       <span>
//                         Avg Points{" "}
//                         {player.total_game > 0
//                           ? (player.total_point / player.total_game).toFixed(2)
//                           : "0.00"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🔹 Player List */}
//       {grades.length === 0 ? (
//         <p className="text-center text-gray-500">No players found</p>
//       ) : (
//         <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2 pr-3">
//           {grades.map((grade, index) => (
//             <div key={index} className="mb-4">
//               <div className="flex items-center gap-4 mb-3 sticky top-0 backdrop-blur-md z-10">
//                 <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
//                   {grade.label}
//                 </Badge>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
//                 {grade.players.map((player) => (
//                   <div
//                     key={player.id}
//                     className="relative flex flex-col gap-2 rounded-md shadow-md py-3 px-4 bg-green-400"
//                   >
//                     <div className="flex items-center gap-4">
//                       <span className="font-bold">{player.rank}</span>
//                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
//                         <img
//                           src={
//                             player.image
//                               ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}`
//                               : `./logo.jpg`
//                           }
//                           alt={player.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-900 truncate">
//                           {player.name}
//                         </p>
//                         <p className="font-semibold text-gray-700 truncate">
//                           {player.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }










// ==========================31-10-25==========================


// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Badge } from "@/components/ui/badge";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import { fetchGradebars } from "@/redux/slices/gradebarSlice";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Skeleton } from "@/components/ui/skeleton";

// import DummyPlayerStats from "./DummyPlayerStats";
// import DummyMessageBoard from "./DummyMessage/message";// ✅ Import added

// const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// export default function DummyPlayerList({ ladderId }) {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 State for Player Statistics Modal
//   const [rankList, setRankList] = useState([]);
//   const [rankLoading, setRankLoading] = useState(true);
//   const [rankError, setRankError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // 🔹 Redux Data
//   const players = useSelector(
//     (state) => state.player?.players?.[ladderId]?.data || []
//   );
//   const preset = useSelector((state) => state.gradebar?.preset || 10);
//   const gradebarDetails = useSelector(
//     (state) => state.gradebar?.gradebarDetails || []
//   );
//   const ladderDetails = useSelector(
//     (state) => state.player?.players?.[ladderId]?.ladderDetails || null
//   );

//   // 🔹 Fetch Redux Data
//   useEffect(() => {
//     if (ladderId) {
//       dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//       dispatch(fetchGradebars(ladderId));
//     }
//   }, [ladderId, dispatch]);

//   // 🔹 Fetch Rank List
//   useEffect(() => {
//     const fetchRankList = async () => {
//       if (!ladderId) return setRankLoading(false);
//       try {
//         const res = await axios.get(
//           `https://ne-games.com/leaderBoard/api/user/rank/list?ladder_id=${ladderId}`,
//           { headers: { "Content-Type": "application/json", APPKEY } }
//         );
//         setRankList(res.data?.data || []);
//       } catch (err) {
//         setRankError(
//           err.response?.data?.message || "Failed to fetch rank list"
//         );
//       } finally {
//         setRankLoading(false);
//       }
//     };
//     fetchRankList();
//   }, [ladderId]);

//   // 🔹 Filter & Grade grouping
//   const filteredPlayers = players
//     .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => a.rank - b.rank);

//   const generateGrades = (playersArr, gradebarDetails, preset) => {
//     if (!playersArr || playersArr.length === 0) return [];
//     const out = [];
//     let startIndex = 0;
//     const groupSize = Number(preset) || 10;

//     while (startIndex < playersArr.length) {
//       const groupPlayers = playersArr.slice(startIndex, startIndex + groupSize);
//       const gradeIdx = Math.floor(startIndex / groupSize);
//       const gradeLabel =
//         gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
//       out.push({ label: gradeLabel, players: groupPlayers });
//       startIndex += groupSize;
//     }
//     return out;
//   };

//   const grades = generateGrades(filteredPlayers, gradebarDetails, preset);

//   return (
//     <div className="px-2">
//       {/* 🔹 Ladder Title */}
//       {ladderDetails && (
//         <div className="py-4 text-center sm:text-start px-4">
//           <h2 className="text-2xl font-bold text-blue-600">
//             {ladderDetails.name}
//           </h2>
//           <p className="text-blue-900 text-md border-b-2 border-amber-500 py-1 font-semibold">
//             Admin Details: {ladderDetails.admin_name} (
//             {ladderDetails.admin_phone})
//           </p>

//           {/* 🔹 Modal Trigger */}
//           <p
//             onClick={() => setIsModalOpen(true)}
//             className=" bg-blue-600 text-white md:w-[250px] flex items-center justify-center mt-2 text-center cursor-pointer hover:underline  font-semibold"
//           >
//             See Player’s Stats Ranked
//           </p>
//         </div>
//       )}

//       {/* 🔹 Player Rank List Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]"
//             >
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
//               >
//                 ✕
//               </button>

//               <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
//                 🏅 Player Rank List
//               </h2>

//               {/* 🔹 Stats Component */}
//               <div className="flex justify-center mb-6">
//                 <DummyPlayerStats ladderId={ladderId} />
//               </div>

//               {/* 🔹 Rank List */}
//               {rankLoading ? (
//                 <div className="space-y-4">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Skeleton key={i} className="h-8 w-full rounded-md" />
//                   ))}
//                 </div>
//               ) : rankError ? (
//                 <p className="text-center text-red-600">{rankError}</p>
//               ) : rankList.length === 0 ? (
//                 <p className="text-center text-gray-600">
//                   No ranking data available.
//                 </p>
//               ) : (
//                 <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-inner space-y-2 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
//                   {rankList.map((player, index) => (
//                     <div
//                       key={player.id}
//                       className="flex flex-wrap gap-2 text-sm sm:text-base text-gray-800 font-medium border-b border-gray-200 py-1"
//                     >
//                       <span className="w-6 font-semibold">{index + 1}.</span>
//                       <span className="font-semibold capitalize">
//                         {player.name || "Unknown"}
//                       </span>
//                       <span>Played {player.total_game ?? 0}</span>
//                       <span>Won {player.total_win ?? 0}</span>
//                       <span>
//                         Win %{" "}
//                         {((player?.total_win / player?.total_game) * 100).toFixed(0)}%
//                       </span>
//                       <span>Points {player.total_point ?? 0}</span>
//                       <span>
//                         Avg Points{" "}
//                         {player.total_game > 0
//                           ? (player.total_point / player.total_game).toFixed(2)
//                           : "0.00"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* 🔹 Integrated Read-only Message Board */}
//               <div className="mt-8 border-t pt-6">
//                 <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">
//                   💬 Public Message Board (Read Only)
//                 </h3>
//                 <div className="h-[60vh] overflow-hidden rounded-xl border border-gray-200">
//                   <DummyMessageBoard ladderId={ladderId} readOnly={true} />
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🔹 Player List */}
//       {grades.length === 0 ? (
//         <p className="text-center text-gray-500">No players found</p>
//       ) : (
//         <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2 pr-3">
//           {grades.map((grade, index) => (
//             <div key={index} className="mb-4">
//               <div className="flex items-center gap-4 mb-3 sticky top-0 backdrop-blur-md z-10">
//                 <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
//                   {grade.label}
//                 </Badge>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
//                 {grade.players.map((player) => (
//                   <div
//                     key={player.id}
//                     className="relative flex flex-col gap-2 rounded-md shadow-md py-3 px-4 bg-green-400"
//                   >
//                     <div className="flex items-center gap-4">
//                       <span className="font-bold">{player.rank}</span>
//                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
//                         <img
//                           src={
//                             player.image
//                               ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}`
//                               : `./logo.jpg`
//                           }
//                           alt={player.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-900 truncate">
//                           {player.name}
//                         </p>
//                         <p className="font-semibold text-gray-700 truncate">
//                           {player.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { fetchGradebars } from "@/redux/slices/gradebarSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import DummyPlayerStats from "./DummyPlayerStats";
import DummyMessageBoard from "./DummyMessage/message";

const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

export default function DummyPlayerList({ ladderId }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Modal state
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // 🔹 Rank data
  const [rankList, setRankList] = useState([]);
  const [rankLoading, setRankLoading] = useState(true);
  const [rankError, setRankError] = useState("");

  // 🔹 Redux data
  const players = useSelector(
    (state) => state.player?.players?.[ladderId]?.data || []
  );
  const preset = useSelector((state) => state.gradebar?.preset || 10);
  const gradebarDetails = useSelector(
    (state) => state.gradebar?.gradebarDetails || []
  );
  const ladderDetails = useSelector(
    (state) => state.player?.players?.[ladderId]?.ladderDetails || null
  );

  // 🔹 Fetch data
  useEffect(() => {
    if (ladderId) {
      dispatch(fetchLeaderboard({ ladder_id: ladderId }));
      dispatch(fetchGradebars(ladderId));
    }
  }, [ladderId, dispatch]);

  useEffect(() => {
    const fetchRankList = async () => {
      if (!ladderId) return setRankLoading(false);
      try {
        const res = await axios.get(
          `https://ne-games.com/leaderBoard/api/user/rank/list?ladder_id=${ladderId}`,
          { headers: { "Content-Type": "application/json", APPKEY } }
        );
        setRankList(res.data?.data || []);
      } catch (err) {
        setRankError(
          err.response?.data?.message || "Failed to fetch rank list"
        );
      } finally {
        setRankLoading(false);
      }
    };
    fetchRankList();
  }, [ladderId]);

  // 🔹 Grades generator
  const filteredPlayers = players
    .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.rank - b.rank);

  const generateGrades = (playersArr, gradebarDetails, preset) => {
    if (!playersArr || playersArr.length === 0) return [];
    const out = [];
    let startIndex = 0;
    const groupSize = Number(preset) || 10;

    while (startIndex < playersArr.length) {
      const groupPlayers = playersArr.slice(startIndex, startIndex + groupSize);
      const gradeIdx = Math.floor(startIndex / groupSize);
      const gradeLabel =
        gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
      out.push({ label: gradeLabel, players: groupPlayers });
      startIndex += groupSize;
    }
    return out;
  };

  const grades = generateGrades(filteredPlayers, gradebarDetails, preset);

  return (
    <div className="px-2">
      {/* 🔹 Ladder Title & Admin Info */}
      {ladderDetails && (
        <div className="py-4 text-center sm:text-start px-4">
          <h2 className="text-2xl font-bold text-blue-600">
            {ladderDetails.name}
          </h2>
          <p className="text-blue-900 text-md border-b-2 border-amber-500 py-1 font-semibold">
            Admin Details: {ladderDetails.admin_name} (
            {ladderDetails.admin_phone})
          </p>

          {/* 🔹 Buttons side by side */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 justify-center sm:justify-start">
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-semibold"
            >
              🏅 See Player’s Stats Ranked
            </button>

            <button
              onClick={() => setIsMessageModalOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-semibold"
            >
                Chat Board
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Stats Modal */}
      <AnimatePresence>
        {isStatsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                🏅 Player Rank List
              </h2>

              <div className="flex justify-center mb-6">
                <DummyPlayerStats ladderId={ladderId} />
              </div>

              {rankLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-md" />
                  ))}
                </div>
              ) : rankError ? (
                <p className="text-center text-red-600">{rankError}</p>
              ) : rankList.length === 0 ? (
                <p className="text-center text-gray-600">
                  No ranking data available.
                </p>
              ) : (
                <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-inner space-y-2 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  {rankList.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex flex-wrap gap-2 text-sm sm:text-base text-gray-800 font-medium border-b border-gray-200 py-1"
                    >
                      <span className="w-6 font-semibold">{index + 1}.</span>
                      <span className="font-semibold capitalize">
                        {player.name || "Unknown"}
                      </span>
                      <span>Played {player.total_game ?? 0}</span>
                      <span>Won {player.total_win ?? 0}</span>
                      <span>
                        Win %{" "}
                        {((player?.total_win / player?.total_game) * 100).toFixed(0)}%
                      </span>
                      <span>Points {player.total_point ?? 0}</span>
                      <span>
                        Avg Points{" "}
                        {player.total_game > 0
                          ? (player.total_point / player.total_game).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Message Board Modal */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 relative overflow-hidden"
            >
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="absolute top-2 right-2 cursor-pointer text-xl text-red-600 hover:text-red-900 font-bold"
              >
                ✕
              </button>
{/* 
              <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                💬 Public Message Board
              </h2> */}

              <div className="h-[70vh]">
                <DummyMessageBoard ladderId={ladderId} readOnly={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Player List */}
      {grades.length === 0 ? (
        <p className="text-center text-gray-500">No players found</p>
      ) : (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-2 pr-3">
          {grades.map((grade, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-4 mb-3 sticky top-0 backdrop-blur-md z-10">
                <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
                  {grade.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {grade.players.map((player) => (
                  <div
                    key={player.id}
                    className="relative flex flex-col gap-2 rounded-md shadow-md py-3 px-4 bg-green-400"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{player.rank}</span>
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            player.image
                              ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}`
                              : `./logo.jpg`
                          }
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {player.name}
                        </p>
                        <p className="font-semibold text-gray-700 truncate">
                          {player.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
