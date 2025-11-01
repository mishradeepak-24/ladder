// "use client";
// import React, { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
// import { fetchGradebars } from "@/redux/slices/gradebarSlice";
// import EditPlayer from "@/components/shared/EditPlayer";
// import PlayerSearch from "./PlayerSearch";
// import { motion } from "framer-motion";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import { resetLeaderboard } from "@/redux/slices/resetLeaderboardSlice";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Chat from "./chat/Chat";
// import io from "socket.io-client";

// const socket = io("http://localhost:3000"); 

// export default function PlayersList({ ladderId }) {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPlayerId, setSelectedPlayerId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState("");
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   const [totalUnread, setTotalUnread] = useState(0); // ✅ total unread count

//   const lastUploadedFile = useSelector(
//     (state) => state.player?.lastUploadedFile || null
//   );

//   const subscription = useSelector(
//     (state) => state.player?.players[ladderId]?.ladderDetails
//   );
//   const [allowedUsers, setAllowedUsers] = useState(10);

//   const user = useSelector((state) => state.user.user);

//   const players = useSelector(
//     (state) => state.player?.players?.[ladderId]?.data || []
//   );
//   const preset = useSelector((state) => state.gradebar?.preset || 10);
//   const gradebarDetails = useSelector(
//     (state) => state.gradebar?.gradebarDetails || []
//   );

//   useEffect(() => {
//     if (ladderId) {
//       dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//       dispatch(fetchGradebars(ladderId));
//     }
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     const baseUsers = 10;
//     if (subscription) {
//       const expiry = new Date(subscription?.subscription_expired_date);
//       const now = new Date();
//       if (expiry > now) {
//         const extraUsers = subscription?.no_of_users
//           ? Number(subscription.no_of_users)
//           : 0;
//         setAllowedUsers(baseUsers + extraUsers);
//       } else setAllowedUsers(baseUsers);
//     } else setAllowedUsers(baseUsers);
//   }, [subscription]);

//   // 🟢 Fetch unread count when page loads
//   useEffect(() => {
//     if (!user?.id || !ladderId) return;

//     const fetchUnread = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/unread/${user.id}/${ladderId}`
//         );
//         const data = await res.json();
//         const total = data.reduce((sum, p) => sum + (p.unread_count || 0), 0);
//         setTotalUnread(total);
//       } catch (err) {
//         console.error("Error fetching unread count:", err);
//       }
//     };

//     fetchUnread();
//   }, [user?.id, ladderId]);

//   // 🟢 Socket setup for live updates
//   useEffect(() => {
//     if (!user?.id) return;

//     socket.emit("join", user.id);

//     socket.on("unread_count", ({ from, count }) => {
//       // When unread count changes for one sender, re-fetch total
//       fetch(`http://localhost:3000/unread/${user.id}/${ladderId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           const total = data.reduce((sum, p) => sum + (p.unread_count || 0), 0);
//           setTotalUnread(total);
//         })
//         .catch((err) => console.error("Error refreshing unread:", err));
//     });

//     return () => {
//       socket.off("unread_count");
//     };
//   }, [user?.id, ladderId]);

//   const handlePlayerClick = (player, globalIndex, isAllowed) => {
//     if (!user) {
//       setDialogMessage("Please login first");
//       setIsDialogOpen(true);
//       return;
//     }
//     if (!isAllowed) {
//       toast.warning("Upgrade your subscription to access more players.");
//       return;
//     }
//     if (
//       user?.user_type?.toLowerCase() === "admin" ||
//       String(user?.id) === String(player.id)
//     ) {
//       setSelectedPlayerId(player.id);
//       setIsModalOpen(true);
//     } else {
//       setDialogMessage("You can only edit your own profile");
//       setIsDialogOpen(true);
//     }
//   };

//   const handleReset = async () => {
//     try {
//       const resetPayload = { ladder_id: ladderId };
//       await dispatch(resetLeaderboard(resetPayload)).unwrap();
//       let fileToUpload = lastUploadedFile;
//       if (!fileToUpload) {
//         const response = await fetch("/leaderboard1.csv");
//         const fileBlob = await response.blob();
//         fileToUpload = new File([fileBlob], "leaderboard1.csv", {
//           type: "text/csv",
//         });
//       }
//       await dispatch(uploadCSV({ file: fileToUpload, ladder_id: ladderId })).unwrap();
//       await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const generateGrades = (playersArr, gradebarDetails, preset) => {
//     if (!playersArr || playersArr.length === 0) return [];
//     const groupSize = Number(preset) || 10;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += groupSize) {
//       const groupPlayers = playersArr.slice(i, i + groupSize);
//       const gradeIdx = Math.floor(i / groupSize);
//       const gradeLabel =
//         gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
//       out.push({ label: gradeLabel, players: groupPlayers });
//     }
//     return out;
//   };

//   const grades = generateGrades(players, gradebarDetails, preset);

//   return (
//     <div className="w-full relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* 🟢 Chat Floating Button with Unread Badge */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <Button
//           onClick={() => setIsChatOpen(true)}
//           className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-5 py-3"
//         >
//           Chat
//           {totalUnread > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
//               {totalUnread}
//             </span>
//           )}
//         </Button>
//       </div>

//       {/* ✅ Chat Modal */}
//       {isChatOpen && (
//         <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
//           <DialogContent className="sm:max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
//             <Chat
//               userId={user?.id}
//               ladderId={ladderId}
//               onClose={() => setIsChatOpen(false)}
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* 🔍 Search and Reset */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
//         <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         {user?.name === "Joe Bloggs" && (
//           <Button
//             onClick={handleReset}
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             Reset
//           </Button>
//         )}
//       </div>

//       {/* 🧍 Player Cards */}
//       {grades.map((grade, gradeIndex) => (
//         <div key={gradeIndex} className="mb-8">
//           <div className="flex items-center gap-8">
//             <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
//               {grade.label}
//             </Badge>
//             {gradeIndex === 0 && <AvailableLabel />}
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mt-4">
//             {grade.players.map((player, pidx) => {
//               const globalIndex = gradeIndex * (Number(preset) || 10) + pidx;
//               const isCurrentUser = String(user?.id) === String(player.id);
//               const isAdmin = user?.user_type?.toLowerCase() === "admin";
//               const isAllowed = globalIndex < allowedUsers || isAdmin;
//               const canEdit =
//                 user?.user_type?.toLowerCase() === "admin" || isCurrentUser;
//               const playerImageUrl = player.image
//                 ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                 : "/logo.jpg";

//               let bgColor = "bg-blue-100 dark:bg-gray-800";
//               if (isCurrentUser && globalIndex < allowedUsers)
//                 bgColor = "bg-yellow-300";
//               else if (String(player.player_status) === "1" && isAllowed)
//                 bgColor = "bg-green-400";

//               return (
//                 <motion.div
//                   key={player.id || pidx}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                 >
//                   <div
//                     onClick={() =>
//                       handlePlayerClick(player, globalIndex, isAllowed)
//                     }
//                     className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                       ${bgColor}
//                       ${
//                         isAllowed && canEdit
//                           ? "cursor-pointer hover:scale-[1.01]"
//                           : "cursor-not-allowed opacity-70"
//                       }`}
//                   >
//                     <div className="flex items-center w-full gap-3">
//                       <p className="text-sm font-bold text-gray-700">
//                         {player.rank}
//                       </p>
//                       <img
//                         src={playerImageUrl}
//                         className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                         alt={`Player ${player.name}`}
//                       />
//                       <div className="flex flex-col flex-1 min-w-0">
//                         <p
//                           className="text-md font-semibold truncate text-gray-900"
//                           title={player.name}
//                         >
//                           {player.name}
//                         </p>
//                         <p className="text-sm" title={player.phone}>
//                           {player.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       ))}

//       {/* ⚙️ Edit Player Modal */}
//       {isModalOpen && (
//         <EditPlayer
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           currentId={selectedPlayerId}
//         />
//       )}

//       {/* ⚠️ Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md w-full">
//           <DialogHeader>
//             <DialogTitle>Notice</DialogTitle>
//           </DialogHeader>
//           <p className="py-2">{dialogMessage}</p>
//           <DialogFooter>
//             <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }





// ===============31/10/25==============================




// "use client";
// import React, { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
// import { fetchGradebars } from "@/redux/slices/gradebarSlice";
// import EditPlayer from "@/components/shared/EditPlayer";
// import PlayerSearch from "./PlayerSearch";
// import { motion } from "framer-motion";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import { resetLeaderboard } from "@/redux/slices/resetLeaderboardSlice";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import MessageBoard from "../message/message"; // ✅ Imported the new message board
// import io from "socket.io-client";

// const socket = io("http://localhost:3000");

// export default function PlayersList({ ladderId }) {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPlayerId, setSelectedPlayerId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState("");
//   const [isBoardOpen, setIsBoardOpen] = useState(false); // ✅ replaces chat open state

//   const [totalUnread, setTotalUnread] = useState(0); // (can be reused later if needed)

//   const lastUploadedFile = useSelector(
//     (state) => state.player?.lastUploadedFile || null
//   );

//   const subscription = useSelector(
//     (state) => state.player?.players[ladderId]?.ladderDetails
//   );
//   const [allowedUsers, setAllowedUsers] = useState(10);

//   const user = useSelector((state) => state.user.user);

//   const players = useSelector(
//     (state) => state.player?.players?.[ladderId]?.data || []
//   );
//   const preset = useSelector((state) => state.gradebar?.preset || 10);
//   const gradebarDetails = useSelector(
//     (state) => state.gradebar?.gradebarDetails || []
//   );

//   useEffect(() => {
//     if (ladderId) {
//       dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//       dispatch(fetchGradebars(ladderId));
//     }
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     const baseUsers = 10;
//     if (subscription) {
//       const expiry = new Date(subscription?.subscription_expired_date);
//       const now = new Date();
//       if (expiry > now) {
//         const extraUsers = subscription?.no_of_users
//           ? Number(subscription.no_of_users)
//           : 0;
//         setAllowedUsers(baseUsers + extraUsers);
//       } else setAllowedUsers(baseUsers);
//     } else setAllowedUsers(baseUsers);
//   }, [subscription]);

//   const handlePlayerClick = (player, globalIndex, isAllowed) => {
//     if (!user) {
//       setDialogMessage("Please login first");
//       setIsDialogOpen(true);
//       return;
//     }
//     if (!isAllowed) {
//       toast.warning("Upgrade your subscription to access more players.");
//       return;
//     }
//     if (
//       user?.user_type?.toLowerCase() === "admin" ||
//       String(user?.id) === String(player.id)
//     ) {
//       setSelectedPlayerId(player.id);
//       setIsModalOpen(true);
//     } else {
//       setDialogMessage("You can only edit your own profile");
//       setIsDialogOpen(true);
//     }
//   };

//   const handleReset = async () => {
//     try {
//       const resetPayload = { ladder_id: ladderId };
//       await dispatch(resetLeaderboard(resetPayload)).unwrap();
//       let fileToUpload = lastUploadedFile;
//       if (!fileToUpload) {
//         const response = await fetch("/leaderboard1.csv");
//         const fileBlob = await response.blob();
//         fileToUpload = new File([fileBlob], "leaderboard1.csv", {
//           type: "text/csv",
//         });
//       }
//       await dispatch(uploadCSV({ file: fileToUpload, ladder_id: ladderId })).unwrap();
//       await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const generateGrades = (playersArr, gradebarDetails, preset) => {
//     if (!playersArr || playersArr.length === 0) return [];
//     const groupSize = Number(preset) || 10;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += groupSize) {
//       const groupPlayers = playersArr.slice(i, i + groupSize);
//       const gradeIdx = Math.floor(i / groupSize);
//       const gradeLabel =
//         gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
//       out.push({ label: gradeLabel, players: groupPlayers });
//     }
//     return out;
//   };

//   const grades = generateGrades(players, gradebarDetails, preset);

//   return (
//     <div className="w-full relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* 🟢 Floating Button to open Message Board */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <Button
//           onClick={() => setIsBoardOpen(true)}
//           className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-5 py-3"
//         >
//           ChatBoard
//         </Button>
//       </div>

//       {/* ✅ Message Board Modal */}
//       {isBoardOpen && (
//         <Dialog open={isBoardOpen} onOpenChange={setIsBoardOpen}>
//           <DialogContent className="sm:max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
//             <MessageBoard senderId={user?.id} ladderId={ladderId} />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* 🔍 Search and Reset */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
//         <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         {user?.name === "Joe Bloggs" && (
//           <Button
//             onClick={handleReset}
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             Reset
//           </Button>
//         )}
//       </div>

//       {/* 🧍 Player Cards */}
//       {grades.map((grade, gradeIndex) => (
//         <div key={gradeIndex} className="mb-8">
//           <div className="flex items-center gap-8">
//             <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
//               {grade.label}
//             </Badge>
//             {gradeIndex === 0 && <AvailableLabel />}
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mt-4">
//             {grade.players.map((player, pidx) => {
//               const globalIndex = gradeIndex * (Number(preset) || 10) + pidx;
//               const isCurrentUser = String(user?.id) === String(player.id);
//               const isAdmin = user?.user_type?.toLowerCase() === "admin";
//               const isAllowed = globalIndex < allowedUsers || isAdmin;
//               const canEdit =
//                 user?.user_type?.toLowerCase() === "admin" || isCurrentUser;
//               const playerImageUrl = player.image
//                 ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                 : "/logo.jpg";

//               let bgColor = "bg-blue-100 dark:bg-gray-800";
//               if (isCurrentUser && globalIndex < allowedUsers)
//                 bgColor = "bg-yellow-300";
//               else if (String(player.player_status) === "1" && isAllowed)
//                 bgColor = "bg-green-400";

//               return (
//                 <motion.div
//                   key={player.id || pidx}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                 >
//                   <div
//                     onClick={() =>
//                       handlePlayerClick(player, globalIndex, isAllowed)
//                     }
//                     className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                       ${bgColor}
//                       ${
//                         isAllowed && canEdit
//                           ? "cursor-pointer hover:scale-[1.01]"
//                           : "cursor-not-allowed opacity-70"
//                       }`}
//                   >
//                     <div className="flex items-center w-full gap-3">
//                       <p className="text-sm font-bold text-gray-700">
//                         {player.rank}
//                       </p>
//                       <img
//                         src={playerImageUrl}
//                         className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                         alt={`Player ${player.name}`}
//                       />
//                       <div className="flex flex-col flex-1 min-w-0">
//                         <p
//                           className="text-md font-semibold truncate text-gray-900"
//                           title={player.name}
//                         >
//                           {player.name}
//                         </p>
//                         <p className="text-sm" title={player.phone}>
//                           {player.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       ))}

//       {/* ⚙️ Edit Player Modal */}
//       {isModalOpen && (
//         <EditPlayer
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           currentId={selectedPlayerId}
//         />
//       )}

//       {/* ⚠️ Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md w-full">
//           <DialogHeader>
//             <DialogTitle>Notice</DialogTitle>
//           </DialogHeader>
//           <p className="py-2">{dialogMessage}</p>
//           <DialogFooter>
//             <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




















// =========================lat code=========================





// "use client";
// import React, { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
// import { fetchGradebars } from "@/redux/slices/gradebarSlice";
// import EditPlayer from "@/components/shared/EditPlayer";
// import PlayerSearch from "./PlayerSearch";
// import { motion } from "framer-motion";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import { resetLeaderboard } from "@/redux/slices/resetLeaderboardSlice";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import MessageBoard from "../message/message"; // ✅ Chatboard component
// import io from "socket.io-client";

// const socket = io("http://localhost:3000");

// export default function PlayersList({ ladderId }) {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPlayerId, setSelectedPlayerId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState("");
//   const [isBoardOpen, setIsBoardOpen] = useState(false); // ✅ Chatboard open/close state

//   const [totalUnread, setTotalUnread] = useState(0);
//   const lastUploadedFile = useSelector(
//     (state) => state.player?.lastUploadedFile || null
//   );
//   const subscription = useSelector(
//     (state) => state.player?.players[ladderId]?.ladderDetails
//   );
//   const [allowedUsers, setAllowedUsers] = useState(10);
//   const user = useSelector((state) => state.user.user);

//   const players = useSelector(
//     (state) => state.player?.players?.[ladderId]?.data || []
//   );
//   const preset = useSelector((state) => state.gradebar?.preset || 10);
//   const gradebarDetails = useSelector(
//     (state) => state.gradebar?.gradebarDetails || []
//   );

//   useEffect(() => {
//     if (ladderId) {
//       dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//       dispatch(fetchGradebars(ladderId));
//     }
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     const baseUsers = 10;
//     if (subscription) {
//       const expiry = new Date(subscription?.subscription_expired_date);
//       const now = new Date();
//       if (expiry > now) {
//         const extraUsers = subscription?.no_of_users
//           ? Number(subscription.no_of_users)
//           : 0;
//         setAllowedUsers(baseUsers + extraUsers);
//       } else setAllowedUsers(baseUsers);
//     } else setAllowedUsers(baseUsers);
//   }, [subscription]);

//   const handlePlayerClick = (player, globalIndex, isAllowed) => {
//     if (!user) {
//       setDialogMessage("Please login first");
//       setIsDialogOpen(true);
//       return;
//     }
//     if (!isAllowed) {
//       toast.warning("Upgrade your subscription to access more players.");
//       return;
//     }
//     if (
//       user?.user_type?.toLowerCase() === "admin" ||
//       String(user?.id) === String(player.id)
//     ) {
//       setSelectedPlayerId(player.id);
//       setIsModalOpen(true);
//     } else {
//       setDialogMessage("You can only edit your own profile");
//       setIsDialogOpen(true);
//     }
//   };

//   const handleReset = async () => {
//     try {
//       const resetPayload = { ladder_id: ladderId };
//       await dispatch(resetLeaderboard(resetPayload)).unwrap();
//       let fileToUpload = lastUploadedFile;
//       if (!fileToUpload) {
//         const response = await fetch("/leaderboard1.csv");
//         const fileBlob = await response.blob();
//         fileToUpload = new File([fileBlob], "leaderboard1.csv", {
//           type: "text/csv",
//         });
//       }
//       await dispatch(
//         uploadCSV({ file: fileToUpload, ladder_id: ladderId })
//       ).unwrap();
//       await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const generateGrades = (playersArr, gradebarDetails, preset) => {
//     if (!playersArr || playersArr.length === 0) return [];
//     const groupSize = Number(preset) || 10;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += groupSize) {
//       const groupPlayers = playersArr.slice(i, i + groupSize);
//       const gradeIdx = Math.floor(i / groupSize);
//       const gradeLabel =
//         gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
//       out.push({ label: gradeLabel, players: groupPlayers });
//     }
//     return out;
//   };

//   const grades = generateGrades(players, gradebarDetails, preset);

//   return (
//     <div className="w-full relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* 🟢 Floating Chat Button */}
//       <div className="fixed bottom-6 right-6 ">
//         <Button
//           onClick={() => setIsBoardOpen(true)}
//           className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-5 py-3"
//         >
//           ChatBoard
//         </Button>
//       </div>

//       {/* ✅ Message Board Modal */}
//       {isBoardOpen && (
//         <Dialog open={isBoardOpen} onOpenChange={setIsBoardOpen}>
//           <DialogContent className="sm:max-w-4xl w-full h-[80vh] p-0 overflow-hidden">
//             <MessageBoard
//               senderId={user?.id}
//               ladderId={ladderId}
//               onClose={() => setIsBoardOpen(false)} // ✅ Cross button closes board
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* 🔍 Search + Reset */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
//         <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         {user?.name === "Joe Bloggs" && (
//           <Button
//             onClick={handleReset}
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             Reset
//           </Button>
//         )}
//       </div>

//       {/* 🧍 Player Cards */}
//       {grades.map((grade, gradeIndex) => (
//         <div key={gradeIndex} className="mb-8">
//           <div className="flex items-center gap-8">
//             <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
//               {grade.label}
//             </Badge>
//             {gradeIndex === 0 && <AvailableLabel />}
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mt-4">
//             {grade.players.map((player, pidx) => {
//               const globalIndex = gradeIndex * (Number(preset) || 10) + pidx;
//               const isCurrentUser = String(user?.id) === String(player.id);
//               const isAdmin = user?.user_type?.toLowerCase() === "admin";
//               const isAllowed = globalIndex < allowedUsers || isAdmin;
//               const canEdit =
//                 user?.user_type?.toLowerCase() === "admin" || isCurrentUser;
//               const playerImageUrl = player.image
//                 ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                 : "/logo.jpg";

//               let bgColor = "bg-blue-100 dark:bg-gray-800";
//               if (isCurrentUser && globalIndex < allowedUsers)
//                 bgColor = "bg-yellow-300";
//               else if (String(player.player_status) === "1" && isAllowed)
//                 bgColor = "bg-green-400";

//               return (
//                 <motion.div
//                   key={player.id || pidx}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                 >
//                   <div
//                     onClick={() =>
//                       handlePlayerClick(player, globalIndex, isAllowed)
//                     }
//                     className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                       ${bgColor}
//                       ${
//                         isAllowed && canEdit
//                           ? "cursor-pointer hover:scale-[1.01]"
//                           : "cursor-not-allowed opacity-70"
//                       }`}
//                   >
//                     <div className="flex items-center w-full gap-3">
//                       <p className="text-sm font-bold text-gray-700">
//                         {player.rank}
//                       </p>
//                       <img
//                         src={playerImageUrl}
//                         className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                         alt={`Player ${player.name}`}
//                       />
//                       <div className="flex flex-col flex-1 min-w-0">
//                         <p
//                           className="text-md font-semibold truncate text-gray-900"
//                           title={player.name}
//                         >
//                           {player.name}
//                         </p>
//                         <p className="text-sm" title={player.phone}>
//                           {player.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       ))}

//       {/* ⚙️ Edit Player Modal */}
//       {isModalOpen && (
//         <EditPlayer
//           open={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           currentId={selectedPlayerId}
//         />
//       )}

//       {/* ⚠️ Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md w-full">
//           <DialogHeader>
//             <DialogTitle>Notice</DialogTitle>
//           </DialogHeader>
//           <p className="py-2">{dialogMessage}</p>
//           <DialogFooter>
//             <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }













// ===============================================last code shaam ka










"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
import { fetchGradebars } from "@/redux/slices/gradebarSlice";
import EditPlayer from "@/components/shared/EditPlayer";
import PlayerSearch from "./PlayerSearch";
import { motion } from "framer-motion";
import AvailableLabel from "@/components/shared/AvailableLabel";
import { resetLeaderboard } from "@/redux/slices/resetLeaderboardSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageBoard from "../message/message"; // ✅ Chatboard component
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function PlayersList({ ladderId }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isBoardOpen, setIsBoardOpen] = useState(false); // ✅ Chatboard open/close state

  const [totalUnread, setTotalUnread] = useState(0);
  const lastUploadedFile = useSelector(
    (state) => state.player?.lastUploadedFile || null
  );
  const subscription = useSelector(
    (state) => state.player?.players[ladderId]?.ladderDetails
  );
  const [allowedUsers, setAllowedUsers] = useState(10);
  const user = useSelector((state) => state.user.user);

  const players = useSelector(
    (state) => state.player?.players?.[ladderId]?.data || []
  );
  const preset = useSelector((state) => state.gradebar?.preset || 10);
  const gradebarDetails = useSelector(
    (state) => state.gradebar?.gradebarDetails || []
  );

  useEffect(() => {
    if (ladderId) {
      dispatch(fetchLeaderboard({ ladder_id: ladderId }));
      dispatch(fetchGradebars(ladderId));
    }
  }, [dispatch, ladderId]);

  useEffect(() => {
    const baseUsers = 10;
    if (subscription) {
      const expiry = new Date(subscription?.subscription_expired_date);
      const now = new Date();
      if (expiry > now) {
        const extraUsers = subscription?.no_of_users
          ? Number(subscription.no_of_users)
          : 0;
        setAllowedUsers(baseUsers + extraUsers);
      } else setAllowedUsers(baseUsers);
    } else setAllowedUsers(baseUsers);
  }, [subscription]);

  const handlePlayerClick = (player, globalIndex, isAllowed) => {
    if (!user) {
      setDialogMessage("Please login first");
      setIsDialogOpen(true);
      return;
    }
    if (!isAllowed) {
      toast.warning("Upgrade your subscription to access more players.");
      return;
    }
    if (
      user?.user_type?.toLowerCase() === "admin" ||
      String(user?.id) === String(player.id)
    ) {
      setSelectedPlayerId(player.id);
      setIsModalOpen(true);
    } else {
      setDialogMessage("You can only edit your own profile");
      setIsDialogOpen(true);
    }
  };

  const handleReset = async () => {
    try {
      const resetPayload = { ladder_id: ladderId };
      await dispatch(resetLeaderboard(resetPayload)).unwrap();
      let fileToUpload = lastUploadedFile;
      if (!fileToUpload) {
        const response = await fetch("/leaderboard1.csv");
        const fileBlob = await response.blob();
        fileToUpload = new File([fileBlob], "leaderboard1.csv", {
          type: "text/csv",
        });
      }
      await dispatch(
        uploadCSV({ file: fileToUpload, ladder_id: ladderId })
      ).unwrap();
      await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
    } catch (err) {
      console.log(err);
    }
  };

  const generateGrades = (playersArr, gradebarDetails, preset) => {
    if (!playersArr || playersArr.length === 0) return [];
    const groupSize = Number(preset) || 10;
    const out = [];
    for (let i = 0; i < playersArr.length; i += groupSize) {
      const groupPlayers = playersArr.slice(i, i + groupSize);
      const gradeIdx = Math.floor(i / groupSize);
      const gradeLabel =
        gradebarDetails?.[gradeIdx]?.gradebar_name || `SECTION ${gradeIdx + 1}`;
      out.push({ label: gradeLabel, players: groupPlayers });
    }
    return out;
  };

  const grades = generateGrades(players, gradebarDetails, preset);

  return (
    <div className="w-full relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* 🟢 Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-[9998]">
        <Button
          onClick={() => setIsBoardOpen(true)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-5 py-3"
        >
          ChatBoard
        </Button>
      </div>

      {/* ✅ Message Board Overlay (No Background Container) */}
      {isBoardOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <MessageBoard
            senderId={user?.id}
            ladderId={ladderId}
            onClose={() => setIsBoardOpen(false)} // ✅ Closes board
          />
        </div>
      )}

      {/* 🔍 Search + Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-4">
        <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {user?.name === "Joe Bloggs" && (
          <Button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Reset
          </Button>
        )}
      </div>

      {/* 🧍 Player Cards */}
      {grades.map((grade, gradeIndex) => (
        <div key={gradeIndex} className="mb-8">
          <div className="flex items-center gap-8">
            <Badge className="bg-red-600 rounded-md py-2 px-6 text-md font-semibold uppercase">
              {grade.label}
            </Badge>
            {gradeIndex === 0 && <AvailableLabel />}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 mt-4">
            {grade.players.map((player, pidx) => {
              const globalIndex = gradeIndex * (Number(preset) || 10) + pidx;
              const isCurrentUser = String(user?.id) === String(player.id);
              const isAdmin = user?.user_type?.toLowerCase() === "admin";
              const isAllowed = globalIndex < allowedUsers || isAdmin;
              const canEdit =
                user?.user_type?.toLowerCase() === "admin" || isCurrentUser;
              const playerImageUrl = player.image
                ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
                : "/logo.jpg";

              let bgColor = "bg-blue-100 dark:bg-gray-800";
              if (isCurrentUser && globalIndex < allowedUsers)
                bgColor = "bg-yellow-300";
              else if (String(player.player_status) === "1" && isAllowed)
                bgColor = "bg-green-400";

              return (
                <motion.div
                  key={player.id || pidx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: pidx * 0.03 }}
                >
                  <div
                    onClick={() =>
                      handlePlayerClick(player, globalIndex, isAllowed)
                    }
                    className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
                      ${bgColor}
                      ${
                        isAllowed && canEdit
                          ? "cursor-pointer hover:scale-[1.01]"
                          : "cursor-not-allowed opacity-70"
                      }`}
                  >
                    <div className="flex items-center w-full gap-3">
                      <p className="text-sm font-bold text-gray-700">
                        {player.rank}
                      </p>
                      <img
                        src={playerImageUrl}
                        className="rounded-full w-12 h-12 object-cover border border-gray-300"
                        alt={`Player ${player.name}`}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <p
                          className="text-md font-semibold truncate text-gray-900"
                          title={player.name}
                        >
                          {player.name}
                        </p>
                        <p className="text-sm" title={player.phone}>
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
      ))}

      {/* ⚙️ Edit Player Modal */}
      {isModalOpen && (
        <EditPlayer
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentId={selectedPlayerId}
        />
      )}

      {/* ⚠️ Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          <p className="py-2">{dialogMessage}</p>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
