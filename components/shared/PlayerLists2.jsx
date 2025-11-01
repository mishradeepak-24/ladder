// =============================

// "use client";

// import { CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Logo from "@/public/logo.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLeaderboard,
//   setSelectedPlayer,
// } from "@/redux/slices/leaderboardSlice";
// import { EditPlayer } from "./EditPlayer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useSearchParams } from "next/navigation";

// const PlayersLists1 = () => {
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const urlLadderId = searchParams.get("ladder_id"); // ⬅️ Get ladder_id from URL

//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const user = useSelector((state) => state.user?.user);
//   const profile = useSelector((state) => state.profile?.data);
//   const gradebarDetails = useSelector(
//     (state) => state.player?.gradebarDetails?.[ladderId] || []
//   );
//   // const gradebarDetails = useSelector((state) => state.playersLadder.gradebarDetails);
//   console.log("Gradebar from Redux:", gradebarDetails);
//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const ladderId = urlLadderId || user?.ladder_id;

//   const playerList = players?.[ladderId]?.data || [];
//   const imagePath = players?.[ladderId]?.image_path || "";
//   console.log(playerList);

//   useEffect(() => {
//     if (ladderId) {
//       setLoadingPlayers(true);
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })).finally(() =>
//         setLoadingPlayers(false)
//       );
//     }
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchUserProfile(user.id));
//     }
//   }, [dispatch, user?.id]);

//   const filteredPlayers = searchQuery
//     ? playerList.filter((player) =>
//         player.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;

//   // const generateGrades = (players) => {
//   //   const gradeLabels = [
//   //     "GRADE A",
//   //     "GRADE B",
//   //     "GRADE C",
//   //     "GRADE D",
//   //     "GRADE E",
//   //     "GRADE F",
//   //     "GRADE G",
//   //     "GRADE H",
//   //   ];
//   //   return players.reduce((acc, _, i) => {
//   //     if (i % 10 === 0) {
//   //       acc.push({
//   //         label:
//   //           gradeLabels[Math.floor(i / 10)] ||
//   //           `GRADE ${String.fromCharCode(65 + Math.floor(i / 10))}`,
//   //         players: players.slice(i, i + 10),
//   //       });
//   //     }
//   //     return acc;
//   //   }, []);
//   // };

//   // const generateGrades = (players, gradebarDetails = []) => {
//   //   const chunkSize = 10;

//   //   return players.reduce((acc, _, i) => {
//   //     if (i % chunkSize === 0) {
//   //       const gradeIndex = Math.floor(i / chunkSize);

//   //       let label = `GRADE ${String.fromCharCode(65 + gradeIndex)}`; // GRADE A, B, C...
//   //       if (Array.isArray(gradebarDetails) && gradebarDetails[gradeIndex]?.gradebar_name) {
//   //         label = gradebarDetails[gradeIndex].gradebar_name;
//   //       }

//   //       acc.push({
//   //         label,
//   //         players: players.slice(i, i + chunkSize),
//   //       });
//   //     }
//   //     return acc;
//   //   }, []);
//   // };

//   const generateGrades = (players, gradebarDetails = []) => {
//     const chunkSize = 10;

//     return players.reduce((acc, _, i) => {
//       if (i % chunkSize === 0) {
//         const gradeIndex = Math.floor(i / chunkSize);

//         const label =
//           gradebarDetails[gradeIndex]?.gradebar_name ||
//           `GRADE ${String.fromCharCode(65 + gradeIndex)}`;

//         acc.push({
//           label,
//           players: players.slice(i, i + chunkSize),
//         });
//       }
//       return acc;
//     }, []);
//   };

//   const subscription = user?.subscription;
//   const isSubscribed = subscription !== null;

//   return (
//     <div className="p-4 space-y-6 relative">
//       {playerList.length > 0 && (
//         <div className="w-full">
//           <div className="flex">
//             <LadderLinkPanel />
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           </div>
//         </div>
//       )}

//       {moveLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4 }}
//             className="flex items-center gap-3 p-6 rounded-lg bg-white/80 shadow-md"
//           >
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-2/3" />
//               <Skeleton className="h-3 w-1/2" />
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {generateGrades(filteredPlayers).map((grade, gradeIndex) => (
//             <div key={gradeIndex} className="space-y-2">
//               <h2 className="text-md font-bold bg-orange-500 text-white px-4 py-1 rounded w-fit shadow-sm uppercase">
//                 {grade.label}
//               </h2>
//               <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, index) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type === "admin" || user?.id === player.id;

//                   const isAllowed = isSubscribed || index < 10;

//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
//                         player.image
//                       }?t=${Date.now()}`
//                     : Logo;

//                   return (
//                     <motion.div
//                       key={player.id || index}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) {
//                             toast.warning(
//                               "Upgrade your subscription to access more players."
//                             );
//                             return;
//                           }
//                           if (!canEdit) {
//                             toast.warning("You may only tap on your name");
//                             return;
//                           }
//                           dispatch(
//                             setSelectedPlayer({
//                               ...player,
//                               ladder_id: ladderId,
//                             })
//                           );
//                           setIsOpen(true);
//                         }}
//                         className={`flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-300"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && canEdit
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "cursor-not-allowed opacity-50"
//                           }`}
//                       >
//                         {/* <div className="flex items-center gap-3">
//                           <p className="font-bold">{player.rank}</p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-10 h-10 object-cover"
//                             width={40}
//                             height={40}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col">
//                             <p
//                               className="font-semibold capitalize max-w-[75px]"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p
//                               className="font-semibold capitalize max-w-[75px] "
//                               title={player.phone}
//                             >
//                               {player.phone}
//                             </p>
//                           </div>
//                         </div> */}
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-sm font-bold text-gray-700">
//                             {player.rank}
//                           </p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                             width={48}
//                             height={48}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col flex-1 min-w-0">
//                             <p
//                               className="text-sm font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p
//                               className="text-xs text-gray-600 truncate"
//                               title={player.phone}
//                             >
//                               {player.phone}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) {
//               dispatch(fetchUserProfile(user?.id));
//             }
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//             }
//           }}
//           currentId={selectedPlayer?.id}
//           setLoading={setMoveLoading}
//         />
//       )}
//     </div>
//   );
// };

// export default PlayersLists1;

// ============================= ==>

//   "use client";

// import { CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Logo from "@/public/logo.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLeaderboard,
//   setSelectedPlayer,
// } from "@/redux/slices/leaderboardSlice";
// import { EditPlayer } from "./EditPlayer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useSearchParams } from "next/navigation";

// const PlayersLists1 = () => {
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();

//   const urlLadderId = searchParams.get("ladder_id");
//   const user = useSelector((state) => state.user?.user);
//   const ladderId = urlLadderId || user?.ladder_id;

//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const gradebarDetails = useSelector(
//     (state) => state.player?.gradebarDetails?.[ladderId] || []
//   );
//   const profile = useSelector((state) => state.profile?.data);

//   const playerList = players?.[ladderId]?.data || [];
//   const imagePath = players?.[ladderId]?.image_path || "";

//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const subscription = user?.subscription;
//   const isSubscribed = subscription !== null;

//   useEffect(() => {
//     if (ladderId && !players?.[ladderId]) {
//       setLoadingPlayers(true);
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })).finally(() =>
//         setLoadingPlayers(false)
//       );
//     }
//   }, [dispatch, ladderId, players]);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchUserProfile(user.id));
//     }
//   }, [dispatch, user?.id]);

//   const filteredPlayers = searchQuery
//     ? playerList.filter((player) =>
//         player.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;

//   // Remove duplicate players based on ID
//   const uniqueFilteredPlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   const generateGrades = (players, gradebarDetails = []) => {
//     const chunkSize = 10;

//     return players.reduce((acc, _, i) => {
//       if (i % chunkSize === 0) {
//         const gradeIndex = Math.floor(i / chunkSize);
//         const label =
//           gradebarDetails[gradeIndex]?.gradebar_name ||
//           `GRADE ${String.fromCharCode(65 + gradeIndex)}`;

//         acc.push({
//           label,
//           players: players.slice(i, i + chunkSize),
//         });
//       }
//       return acc;
//     }, []);
//   };

//   return (
//     <div className="p-4 space-y-6 relative">
//       {playerList.length > 0 && (
//         <div className="w-full">
//           <div className="flex">
//             {user?.user_type === "admin" && <LadderLinkPanel />}
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           </div>
//         </div>
//       )}

//       {moveLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4 }}
//             className="flex items-center gap-3 p-6 rounded-lg bg-white/80 shadow-md"
//           >
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-2/3" />
//               <Skeleton className="h-3 w-1/2" />
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {generateGrades(uniqueFilteredPlayers, gradebarDetails).map(
//             (grade, gradeIndex) => (
//               <div key={gradeIndex} className="space-y-2">
//                 <h2 className="text-md font-bold bg-orange-500 text-white px-4 py-1 rounded w-fit shadow-sm uppercase">
//                   {grade.label}
//                 </h2>
//                 <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                   {grade.players.map((player, index) => {
//                     const isActive = selectedPlayer?.id === player.id;
//                     const canEdit =
//                       user?.user_type === "admin" || user?.id === player.id;
//                     const isAllowed = isSubscribed || index < 10;

//                     const playerImageUrl = player.image
//                       ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                       : Logo;

//                     return (
//                       <motion.div
//                         key={player.id || index}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.03 }}
//                       >
//                         <div
//                           onClick={() => {
//                             if (!isAllowed) {
//                               toast.warning(
//                                 "Upgrade your subscription to access more players."
//                               );
//                               return;
//                             }
//                             if (!canEdit) {
//                               toast.warning("You may only tap on your name");
//                               return;
//                             }
//                             dispatch(
//                               setSelectedPlayer({
//                                 ...player,
//                                 ladder_id: ladderId,
//                               })
//                             );
//                             setIsOpen(true);
//                           }}
//                           className={`flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                             ${
//                               player.player_status === 1
//                                 ? "bg-green-300"
//                                 : isActive
//                                 ? "bg-yellow-300"
//                                 : "bg-blue-100 dark:bg-gray-800"
//                             }
//                             ${
//                               isAllowed && canEdit
//                                 ? "cursor-pointer hover:scale-[1.01]"
//                                 : "cursor-not-allowed opacity-50"
//                             }`}
//                         >
//                           <div className="flex items-center w-full gap-3">
//                             <p className="text-sm font-bold text-gray-700">
//                               {player.rank}
//                             </p>
//                             <Image
//                               src={playerImageUrl}
//                               className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                               width={48}
//                               height={48}
//                               alt={`Player ${player.name}`}
//                             />
//                             <div className="flex flex-col flex-1 min-w-0">
//                               <p
//                                 className="text-sm font-semibold truncate text-gray-900"
//                                 title={player.name}
//                               >
//                                 {player.name}
//                               </p>
//                               <p
//                                 className="text-xs text-gray-600 truncate"
//                                 title={player.phone}
//                               >
//                                 {player.phone}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}

//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) {
//               dispatch(fetchUserProfile(user?.id));
//             }
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//             }
//           }}
//           currentId={selectedPlayer?.id}
//           setLoading={setMoveLoading}
//         />
//       )}
//     </div>
//   );
// };

// export default PlayersLists1;

// ==================

"use client";

import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "@/public/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaderboard,
  setSelectedPlayer,
} from "@/redux/slices/leaderboardSlice";
import { EditPlayer } from "./EditPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { fetchUserProfile } from "@/redux/slices/profileSlice";
import PlayerSearchInput from "./PlayerSearchInput";
import { useSearchParams } from "next/navigation";
import AvailableLabel from "@/components/shared/AvailableLabel";

const PlayerLists2 = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const urlLadderId = searchParams.get("ladder_id");
  const user = useSelector((state) => state.user?.user);
  const ladderId = urlLadderId || user?.ladder_id;

  const { players, selectedPlayer } = useSelector((state) => state.player);
  const gradebarDetails = useSelector(
    (state) => state.player?.gradebarDetails?.[ladderId] || []
  );
  const profile = useSelector((state) => state.profile?.data);

  const playerList = players?.[ladderId]?.data || [];
  const imagePath = players?.[ladderId]?.image_path || "";

  const [isOpen, setIsOpen] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const subscription = user?.subscription;
  const isSubscribed = subscription !== null;

  useEffect(() => {
    if (ladderId && !players?.[ladderId]) {
      setLoadingPlayers(true);
      dispatch(fetchLeaderboard({ ladder_id: ladderId })).finally(() =>
        setLoadingPlayers(false)
      );
    }
  }, [dispatch, ladderId, players]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const filteredPlayers = searchQuery
    ? playerList.filter((player) =>
        player.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playerList;

  const uniqueFilteredPlayers = Array.from(
    new Map(filteredPlayers.map((p) => [p.id, p])).values()
  );

  const generateGrades = (players, gradebarDetails = []) => {
    const chunkSize = 10;
    return players.reduce((acc, _, i) => {
      if (i % chunkSize === 0) {
        const gradeIndex = Math.floor(i / chunkSize);
        const label =
          gradebarDetails[gradeIndex]?.gradebar_name ||
          `GRADE ${String.fromCharCode(65 + gradeIndex)}`;
        acc.push({
          label,
          players: players.slice(i, i + chunkSize),
        });
      }
      return acc;
    }, []);
  };

  return (
    <div className="p-4 space-y-6 relative">
      {playerList.length > 0 && (
        <div className="w-full">
          <div className="flex">
            {/* {user?.user_type === "admin" && <LadderLinkPanel />} */}
            <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      )}

      {moveLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 p-6 rounded-lg bg-white/80 shadow-md"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {loadingPlayers ? (
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </CardContent>
      ) : (
        <div className="space-y-8">
          {generateGrades(uniqueFilteredPlayers, gradebarDetails).map(
            (grade, gradeIndex) => (
              <div key={gradeIndex} className="space-y-2">
                {/* <h2 className="text-md font-bold bg-orange-500 text-white px-4 py-1 rounded w-fit shadow-sm uppercase">
                  {grade.label}
                </h2>
                {gradeIndex === 0 && <AvailableLabel />} */}

                <div className="flex items-center gap-4">
                  <h2 className="text-md font-bold bg-orange-500 text-white px-4 py-1 rounded w-fit shadow-sm uppercase">
                    {grade.label}
                  </h2>
                  {gradeIndex === 0 && <AvailableLabel />}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
                  {grade.players.map((player, index) => {
                    const isActive = selectedPlayer?.id === player.id;
                    const canEdit =
                      user?.user_type === "admin" || user?.id === player.id;
                    const isAllowed = isSubscribed || index < 10;

                    const playerImageUrl = player.image
                      ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
                          player.image
                        }?t=${Date.now()}`
                      : Logo;

                    return (
                      <motion.div
                        key={player.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                      >
                        <div
                          onClick={() => {
                            if (!isAllowed) {
                              toast.warning(
                                "Upgrade your subscription to access more players."
                              );
                              return;
                            }
                            if (!canEdit) {
                              toast.warning("You may only tap on your name");
                              return;
                            }
                            dispatch(
                              setSelectedPlayer({
                                ...player,
                                ladder_id: ladderId,
                              })
                            );
                            setIsOpen(true);
                          }}
                          className={`flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
                            ${
                              player.player_status === 1
                                ? "bg-green-300"
                                : isActive
                                ? "bg-yellow-300"
                                : "bg-blue-100 dark:bg-gray-800"
                            }
                            ${
                              isAllowed && canEdit
                                ? "cursor-pointer hover:scale-[1.01]"
                                : "cursor-not-allowed opacity-40 grayscale"
                            }`}
                        >
                          <div className="flex items-center w-full gap-3">
                            <p className="text-sm font-bold text-gray-700">
                              {player.rank}
                            </p>
                            <Image
                              src={playerImageUrl}
                              className="rounded-full w-12 h-12 object-cover border border-gray-300"
                              width={48}
                              height={48}
                              alt={`Player ${player.name}`}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold truncate text-gray-900"
                                title={player.name}
                              >
                                {player.name}
                              </p>
                              <p
                                className="text-xs text-gray-600 truncate"
                                title={player.phone}
                              >
                                {player.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {selectedPlayer && (
        <EditPlayer
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            dispatch(setSelectedPlayer(null));
            if (user?.id) {
              dispatch(fetchUserProfile(user?.id));
            }
            if (ladderId) {
              dispatch(fetchLeaderboard({ ladder_id: ladderId }));
            }
          }}
          currentId={selectedPlayer?.id}
          setLoading={setMoveLoading}
        />
      )}
    </div>
  );
};

export default PlayerLists2;
