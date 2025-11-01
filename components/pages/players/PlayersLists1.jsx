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
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useRouter, useSearchParams } from "next/navigation";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import {
//   fetchGradebars,
//   resetGradebar,
//   updatePrimaryGradebarName,
// } from "@/redux/slices/gradebarSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import purchase from "@/public/flash-sale.gif";
// import { Button } from "@/components/ui/button";
// import { paymentPage } from "@/helper/RouteName";

// const PlayersLists1 = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user); // ✅ Actual logged in user
//   const subscription = useSelector((state) => state.user?.subscription); // ✅ Subscription data

//   const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);


//   useEffect(() => {
//   const baseUsers = 10; // default

//   if (subscription) {
//     const expiry = new Date(subscription?.subscription_expired_date); // backend से आ रहा है
//     console.log("expire date : ", expiry)
//     const now = new Date(); // current date yaha mil rha hai

//     if (expiry > now) {
//       const extraUsers = subscription?.no_of_users
//         ? Number(subscription.no_of_users)
//         : 0;
//       setAllowedUsers(baseUsers + extraUsers);
//     } else {
//       setAllowedUsers(baseUsers);
//     }
//   } else {
//     // कोई subscription नहीं
//     setAllowedUsers(baseUsers);
//   }
// }, [subscription]);


//   // const ladderId = urlLadderId;
//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
//     (state) => state.gradebar
//   );

//   const playerList = players?.[ladderId]?.data || [];
//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [isProDialogOpen, setIsProDialogOpen] = useState(false);

//   // --- grade edit states ---
//   const [editingGradeId, setEditingGradeId] = useState(null);
//   const [tempGradeName, setTempGradeName] = useState("");
//   const [localGradebars, setLocalGradebars] = useState([]);
//   const [groupSize, setGroupSize] = useState(5);

//   useEffect(() => {
//     if (!ladderId) return;
//     setLoadingPlayers(true);
//     Promise.all([
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })),
//       dispatch(fetchGradebars(ladderId)),
//     ]).finally(() => setLoadingPlayers(false));
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
//     if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
//   }, [gradebarDetails, gradebar]);

//   useEffect(() => {
//     if (user?.id) dispatch(fetchUserProfile(user.id));
//   }, [dispatch, user?.id]);

//   const filteredPlayers = searchQuery
//     ? playerList.filter((p) =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;

//   const uniquePlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   useEffect(() => {
//     dispatch(setSelectedPlayer(null));
//   }, [ladderId, dispatch]);

//   const generateGrades = (playersArr, gradebars = []) => {
//     const size = Number(groupSize) || 5;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += size) {
//       const group = playersArr.slice(i, i + size);
//       const idx = Math.floor(i / size);
//       const gb = gradebars[idx];
//       out.push({
//         label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
//         players: group,
//         gradebarId: gb?.id ?? `fallback-${idx}`,
//         isFallback: !gb?.id,
//       });
//     }
//     return out;
//   };

//   const handleGradeEdit = (gradebarId, currentName) => {
//     setEditingGradeId(gradebarId);
//     setTempGradeName(currentName || "");
//   };

//   const saveGradeName = async (gradebarId, isFallback = false) => {
//     if (!tempGradeName.trim()) {
//       setEditingGradeId(null);
//       return;
//     }
//     setLocalGradebars((prev) => {
//       if (isFallback) {
//         return [
//           ...prev,
//           { id: gradebarId, gradebar_name: tempGradeName.trim() },
//         ];
//       }
//       return prev.map((g) =>
//         g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
//       );
//     });
//     setEditingGradeId(null);

//     try {
//       if (isFallback) {
//         const res = await fetch(
//           "https://ne-games.com/leaderBoard/api/user/creategradeBar",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               appkey:
//                 "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//             },
//             body: JSON.stringify({
//               user_id: user?.id,
//               ladder_id: ladderId,
//               preset: groupSize,
//               gradebar_name: tempGradeName.trim(),
//             }),
//           }
//         );
//         const data = await res.json();
//         if (data?.status === 200) {
//           const created = data.data?.gradebar_details?.[0];
//           if (created) {
//             setLocalGradebars((prev) =>
//               prev.map((g) =>
//                 g.id === gradebarId
//                   ? { id: created.id, gradebar_name: created.gradebar_name }
//                   : g
//               )
//             );
//             dispatch(updatePrimaryGradebarName(created.gradebar_name));
//           }
//           toast.success("Gradebar created successfully!");
//         } else toast.error(data?.message || "Failed to create gradebar");
//       } else {
//         const res = await fetch(
//           "https://ne-games.com/leaderBoard/api/user/updateGradebarName",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               appkey:
//                 "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//             },
//             body: JSON.stringify({
//               gradebar_details_id: Number(gradebarId),
//               name: tempGradeName.trim(),
//             }),
//           }
//         );
//         const data = await res.json();
//         if (data?.success || data?.status === "success") {
//           toast.success("Grade name updated!");
//           dispatch(updatePrimaryGradebarName(tempGradeName.trim()));
//         } else toast.error(data?.message || "Failed to update grade name");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong!");
//     }
//   };

//   const handlePresetChange = async (value) => {
//     setGroupSize(value);
//     if (!ladderId || !user?.id) return;
//     try {
//       await dispatch(
//         resetGradebar({
//           user_id: user.id,
//           ladder_id: ladderId,
//           gradebar_id: gradebar?.id,
//           preset: value,
//           gradebar_name: primaryGradebarName || "SECTION",
//         })
//       ).unwrap();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reset gradebar!");
//     }
//   };

//   const grades = generateGrades(uniquePlayers, localGradebars);

//   // handle purchase
//   const handlePurchase = () => {
//     router.push(paymentPage);
//   };

//   return (
//     <div id="print-section" className="p-4 space-y-6 relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Dialog for PRO */}
//       <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
//         <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
//           <div>
//             <Image src={purchase} alt="purchase" width={100} height={100} />
//           </div>
//           <DialogHeader>
//             <DialogTitle>Premium Feature</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Please purchase first to unlock the ladder
//           </p>

//           <div>
//             <Button
//               onClick={handlePurchase}
//               className="cursor-pointer bg-white border text-black hover:bg-red-200"
//             >
//               Purchase Ladder
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Section */}
//       <div className="mb-4 flex items-center gap-2">
//         <div htmlFor="groupSize" className="font-bold text-red-600">
//           Edit Sections:
//         </div>
//         <select
//           id="groupSize"
//           value={groupSize}
//           onChange={(e) => handlePresetChange(Number(e.target.value))}
//           className="border rounded px-2 py-1"
//         >
//           {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ladder link + search */}
//       <div className="flex flex-col gap-3 sm:flex-col md:flex-row md:items-center md:gap-2 md:justify-between">
//         <div>
//           {user?.user_type?.toLowerCase() === "admin" && ladderId && (
//             <LadderLinkPanel ladderId={ladderId} />
//           )}
//         </div>
//         <div className="w-full md:w-[40%]">
//           {playerList.length > 0 && (
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           )}
//         </div>
//       </div>

//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {grades.map((grade, idx) => (
//             <div key={`${grade.gradebarId}-${idx}`} className="space-y-2">
//               <div className="flex items-center gap-4">
//                 <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
//                   {editingGradeId === grade.gradebarId ? (
//                     <>
//                       <input
//                         value={tempGradeName}
//                         onChange={(e) => setTempGradeName(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter")
//                             saveGradeName(grade.gradebarId, grade.isFallback);
//                           if (e.key === "Escape") setEditingGradeId(null);
//                         }}
//                         className="text-white px-1 rounded"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() =>
//                           saveGradeName(grade.gradebarId, grade.isFallback)
//                         }
//                         className="text-white bg-green-600 px-2 py-0.5 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {grade.label}
//                       {user?.user_type?.toLowerCase() === "admin" && (
//                         <button
//                           onClick={() =>
//                             handleGradeEdit(grade.gradebarId, grade.label)
//                           }
//                           title="Edit grade name"
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </h2>
//                 {idx === 0 && <AvailableLabel />}
//               </div>

//               <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, pidx) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type.toLowerCase() === "admin" ||
//                     user?.id === player.user_id;
//                   const globalIndex = idx * groupSize + pidx;
//                   const isAllowed = globalIndex < allowedUsers;

//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
//                         player.image
//                       }?t=${Date.now()}`
//                     : Logo;

//                   return (
//                     <motion.div
//                       key={player.id || pidx}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) {
//                             setIsProDialogOpen(true);
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
//                         className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-400"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && canEdit
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "cursor-not-allowed opacity-70 "
//                           }`}
//                       >
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-md font-bold ">
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
//                               className="text-md font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p className="text-sm" title={player.phone}>
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
//             if (user?.id) dispatch(fetchUserProfile(user.id));
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//               dispatch(fetchGradebars(ladderId));
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

















// ====================================================================================================






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

// import EditPlayer from "@/components/shared/EditPlayer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useRouter, useSearchParams } from "next/navigation";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import {
//   fetchGradebars,
//   resetGradebar,
//   updatePrimaryGradebarName,
// } from "@/redux/slices/gradebarSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import purchase from "@/public/flash-sale.gif";
// import { Button } from "@/components/ui/button";
// import { paymentPage } from "@/helper/RouteName";

// import Chat from "@/components/pages/chat/Chat";
// import { io } from "socket.io-client";

// // ✅ Initialize Socket.IO once
// const socket = io("http://localhost:3000", {
//   transports: ["websocket"],
// });

// const PlayersLists1 = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user);
//   const subscription = useSelector((state) => state.user?.subscription);

//   const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [receiverId, setReceiverId] = useState(""); // ✅ Chat receiver ID

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
//       } else {
//         setAllowedUsers(baseUsers);
//       }
//     } else {
//       setAllowedUsers(baseUsers);
//     }
//   }, [subscription]);

//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
//     (state) => state.gradebar
//   );

//   const playerList = players?.[ladderId]?.data || [];
//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [isProDialogOpen, setIsProDialogOpen] = useState(false);
//   const [editingGradeId, setEditingGradeId] = useState(null);
//   const [tempGradeName, setTempGradeName] = useState("");
//   const [localGradebars, setLocalGradebars] = useState([]);
//   const [groupSize, setGroupSize] = useState(5);

//   useEffect(() => {
//     if (!ladderId) return;
//     setLoadingPlayers(true);
//     Promise.all([
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })),
//       dispatch(fetchGradebars(ladderId)),
//     ]).finally(() => setLoadingPlayers(false));
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
//     if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
//   }, [gradebarDetails, gradebar]);

//   useEffect(() => {
//     if (user?.id) dispatch(fetchUserProfile(user.id));
//   }, [dispatch, user?.id]);

//   const filteredPlayers = searchQuery
//     ? playerList.filter((p) =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;

//   const uniquePlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   useEffect(() => {
//     dispatch(setSelectedPlayer(null));
//   }, [ladderId, dispatch]);

//   const generateGrades = (playersArr, gradebars = []) => {
//     const size = Number(groupSize) || 5;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += size) {
//       const group = playersArr.slice(i, i + size);
//       const idx = Math.floor(i / size);
//       const gb = gradebars[idx];
//       out.push({
//         label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
//         players: group,
//         gradebarId: gb?.id ?? `fallback-${idx}`,
//         isFallback: !gb?.id,
//       });
//     }
//     return out;
//   };

//   const grades = generateGrades(uniquePlayers, localGradebars);

//   const handleGradeEdit = (gradebarId, currentName) => {
//     setEditingGradeId(gradebarId);
//     setTempGradeName(currentName || "");
//   };

//   const saveGradeName = async (gradebarId, isFallback = false) => {
//     if (!tempGradeName.trim()) {
//       setEditingGradeId(null);
//       return;
//     }
//     setLocalGradebars((prev) => {
//       if (isFallback) {
//         return [
//           ...prev,
//           { id: gradebarId, gradebar_name: tempGradeName.trim() },
//         ];
//       }
//       return prev.map((g) =>
//         g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
//       );
//     });
//     setEditingGradeId(null);
//   };

//   const handlePresetChange = async (value) => {
//     setGroupSize(value);
//     if (!ladderId || !user?.id) return;
//     try {
//       await dispatch(
//         resetGradebar({
//           user_id: user.id,
//           ladder_id: ladderId,
//           gradebar_id: gradebar?.id,
//           preset: value,
//           gradebar_name: primaryGradebarName || "SECTION",
//         })
//       ).unwrap();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reset gradebar!");
//     }
//   };

//   const handlePurchase = () => {
//     router.push(paymentPage);
//   };

//   return (
//     <div id="print-section" className="p-4 space-y-6 relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Premium Dialog */}
//       <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
//         <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
//           <div>
//             <Image src={purchase} alt="purchase" width={100} height={100} />
//           </div>
//           <DialogHeader>
//             <DialogTitle>Premium Feature</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Please purchase first to unlock the ladder
//           </p>
//           <div>
//             <Button
//               onClick={handlePurchase}
//               className="cursor-pointer bg-white border text-black hover:bg-red-200"
//             >
//               Purchase Ladder
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Sections */}
//       <div className="mb-4 flex items-center gap-2">
//         <div className="font-bold text-red-600">Edit Sections:</div>
//         <select
//           id="groupSize"
//           value={groupSize}
//           onChange={(e) => handlePresetChange(Number(e.target.value))}
//           className="border rounded px-2 py-1"
//         >
//           {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Ladder Link + Search */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           {user?.user_type?.toLowerCase() === "admin" && ladderId && (
//             <LadderLinkPanel ladderId={ladderId} />
//           )}
//         </div>
//         <div className="w-full md:w-[40%]">
//           {playerList.length > 0 && (
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           )}
//         </div>
//       </div>

//       {/* Player List */}
//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {grades.map((grade, idx) => (
//             <div key={grade.gradebarId} className="space-y-2">
//               <div className="flex items-center gap-4">
//                 <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
//                   {editingGradeId === grade.gradebarId ? (
//                     <>
//                       <input
//                         value={tempGradeName}
//                         onChange={(e) => setTempGradeName(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter")
//                             saveGradeName(grade.gradebarId, grade.isFallback);
//                           if (e.key === "Escape") setEditingGradeId(null);
//                         }}
//                         className="text-white px-1 rounded"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() =>
//                           saveGradeName(grade.gradebarId, grade.isFallback)
//                         }
//                         className="text-white bg-green-600 px-2 py-0.5 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {grade.label}
//                       {user?.user_type?.toLowerCase() === "admin" && (
//                         <button
//                           onClick={() =>
//                             handleGradeEdit(grade.gradebarId, grade.label)
//                           }
//                           title="Edit grade name"
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </h2>
//                 {idx === 0 && <AvailableLabel />}
//               </div>

//               <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, pidx) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type?.toLowerCase() === "admin" ||
//                     user?.id === player.user_id;
//                   const globalIndex = idx * groupSize + pidx;
//                   const isAllowed = globalIndex < allowedUsers;
//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                     : Logo;

//                   return (
//                     <motion.div
//                       key={player.id || pidx}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) return setIsProDialogOpen(true);
//                           if (!canEdit)
//                             return toast.warning(
//                               "You may only tap on your name"
//                             );
//                           dispatch(
//                             setSelectedPlayer({
//                               ...player,
//                               ladder_id: ladderId,
//                             })
//                           );
//                           setIsOpen(true);
//                         }}
//                         className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-400"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && canEdit
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "cursor-not-allowed opacity-70"
//                           }`}
//                       >
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-md font-bold">{player.rank}</p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                             width={48}
//                             height={48}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col flex-1 min-w-0">
//                             <p
//                               className="text-md font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p className="text-sm" title={player.phone}>
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

//       {/* ✅ Floating Chat Button (only opens via button) */}
//       <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
//         {isChatOpen && (
//           <div className="w-80 h-96 mb-2 shadow-lg rounded-lg overflow-hidden">
//             <Chat
//               senderId={user?.id}
//               receiverId={receiverId || null}
//               players={uniquePlayers}
//               setReceiverId={setReceiverId}
//               socket={socket}
//               ladderId={ladderId}
//             />
//           </div>
//         )}
//         <button
//           onClick={() => setIsChatOpen((prev) => !prev)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
//         >
//           Chat
//         </button>
//       </div>

//       {/* Edit Modal */}
//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) dispatch(fetchUserProfile(user.id));
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//               dispatch(fetchGradebars(ladderId));
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



































// =========================================





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
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useRouter, useSearchParams } from "next/navigation";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import {
//   fetchGradebars,
//   resetGradebar,
//   updatePrimaryGradebarName,
// } from "@/redux/slices/gradebarSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import purchase from "@/public/flash-sale.gif";
// import { Button } from "@/components/ui/button";
// import { paymentPage } from "@/helper/RouteName";

// // ✅ Chat Imports
// import Chat from "@/components/pages/chat/Chat";
// import { io } from "socket.io-client";

// // ✅ Initialize socket once
// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const PlayersLists1 = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user);
//   const subscription = useSelector((state) => state.user?.subscription);

//   const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [receiverId, setReceiverId] = useState("");

//   useEffect(() => {
//     const baseUsers = 10; // default
//     if (subscription) {
//       const expiry = new Date(subscription?.subscription_expired_date);
//       const now = new Date();
//       if (expiry > now) {
//         const extraUsers = subscription?.no_of_users
//           ? Number(subscription.no_of_users)
//           : 0;
//         setAllowedUsers(baseUsers + extraUsers);
//       } else {
//         setAllowedUsers(baseUsers);
//       }
//     } else {
//       setAllowedUsers(baseUsers);
//     }
//   }, [subscription]);

//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
//     (state) => state.gradebar
//   );

//   const playerList = players?.[ladderId]?.data || [];
//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isProDialogOpen, setIsProDialogOpen] = useState(false);

//   // --- grade edit states ---
//   const [editingGradeId, setEditingGradeId] = useState(null);
//   const [tempGradeName, setTempGradeName] = useState("");
//   const [localGradebars, setLocalGradebars] = useState([]);
//   const [groupSize, setGroupSize] = useState(5);

//   useEffect(() => {
//     if (!ladderId) return;
//     setLoadingPlayers(true);
//     Promise.all([
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })),
//       dispatch(fetchGradebars(ladderId)),
//     ]).finally(() => setLoadingPlayers(false));
//   }, [dispatch, ladderId]);

//   useEffect(() => {
//     if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
//     if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
//   }, [gradebarDetails, gradebar]);

//   useEffect(() => {
//     if (user?.id) dispatch(fetchUserProfile(user.id));
//   }, [dispatch, user?.id]);

//   const filteredPlayers = searchQuery
//     ? playerList.filter((p) =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;

//   const uniquePlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   useEffect(() => {
//     dispatch(setSelectedPlayer(null));
//   }, [ladderId, dispatch]);

//   const generateGrades = (playersArr, gradebars = []) => {
//     const size = Number(groupSize) || 5;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += size) {
//       const group = playersArr.slice(i, i + size);
//       const idx = Math.floor(i / size);
//       const gb = gradebars[idx];
//       out.push({
//         label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
//         players: group,
//         gradebarId: gb?.id ?? `fallback-${idx}`,
//         isFallback: !gb?.id,
//       });
//     }
//     return out;
//   };

//   const handleGradeEdit = (gradebarId, currentName) => {
//     setEditingGradeId(gradebarId);
//     setTempGradeName(currentName || "");
//   };

//   const saveGradeName = async (gradebarId, isFallback = false) => {
//     if (!tempGradeName.trim()) {
//       setEditingGradeId(null);
//       return;
//     }
//     setLocalGradebars((prev) => {
//       if (isFallback) {
//         return [
//           ...prev,
//           { id: gradebarId, gradebar_name: tempGradeName.trim() },
//         ];
//       }
//       return prev.map((g) =>
//         g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
//       );
//     });
//     setEditingGradeId(null);

//     try {
//       if (isFallback) {
//         const res = await fetch(
//           "https://ne-games.com/leaderBoard/api/user/creategradeBar",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               appkey:
//                 "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//             },
//             body: JSON.stringify({
//               user_id: user?.id,
//               ladder_id: ladderId,
//               preset: groupSize,
//               gradebar_name: tempGradeName.trim(),
//             }),
//           }
//         );
//         const data = await res.json();
//         if (data?.status === 200) {
//           const created = data.data?.gradebar_details?.[0];
//           if (created) {
//             setLocalGradebars((prev) =>
//               prev.map((g) =>
//                 g.id === gradebarId
//                   ? { id: created.id, gradebar_name: created.gradebar_name }
//                   : g
//               )
//             );
//             dispatch(updatePrimaryGradebarName(created.gradebar_name));
//           }
//           toast.success("Gradebar created successfully!");
//         } else toast.error(data?.message || "Failed to create gradebar");
//       } else {
//         const res = await fetch(
//           "https://ne-games.com/leaderBoard/api/user/updateGradebarName",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               appkey:
//                 "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//             },
//             body: JSON.stringify({
//               gradebar_details_id: Number(gradebarId),
//               name: tempGradeName.trim(),
//             }),
//           }
//         );
//         const data = await res.json();
//         if (data?.success || data?.status === "success") {
//           toast.success("Grade name updated!");
//           dispatch(updatePrimaryGradebarName(tempGradeName.trim()));
//         } else toast.error(data?.message || "Failed to update grade name");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong!");
//     }
//   };

//   const handlePresetChange = async (value) => {
//     setGroupSize(value);
//     if (!ladderId || !user?.id) return;
//     try {
//       await dispatch(
//         resetGradebar({
//           user_id: user.id,
//           ladder_id: ladderId,
//           gradebar_id: gradebar?.id,
//           preset: value,
//           gradebar_name: primaryGradebarName || "SECTION",
//         })
//       ).unwrap();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reset gradebar!");
//     }
//   };

//   const grades = generateGrades(uniquePlayers, localGradebars);

//   // handle purchase
//   const handlePurchase = () => {
//     router.push(paymentPage);
//   };

//   return (
//     <div id="print-section" className="p-4 space-y-6 relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Dialog for PRO */}
//       <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
//         <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
//           <div>
//             <Image src={purchase} alt="purchase" width={100} height={100} />
//           </div>
//           <DialogHeader>
//             <DialogTitle>Premium Feature</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Please purchase first to unlock the ladder
//           </p>

//           <div>
//             <Button
//               onClick={handlePurchase}
//               className="cursor-pointer bg-white border text-black hover:bg-red-200"
//             >
//               Purchase Ladder
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Section */}
//       <div className="mb-4 flex items-center gap-2">
//         <div htmlFor="groupSize" className="font-bold text-red-600">
//           Edit Sections:
//         </div>
//         <select
//           id="groupSize"
//           value={groupSize}
//           onChange={(e) => handlePresetChange(Number(e.target.value))}
//           className="border rounded px-2 py-1"
//         >
//           {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ladder link + search */}
//       <div className="flex flex-col gap-3 sm:flex-col md:flex-row md:items-center md:gap-2 md:justify-between">
//         <div>
//           {user?.user_type?.toLowerCase() === "admin" && ladderId && (
//             <LadderLinkPanel ladderId={ladderId} />
//           )}
//         </div>
//         <div className="w-full md:w-[40%]">
//           {playerList.length > 0 && (
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           )}
//         </div>
//       </div>

//       {/* PLAYER LIST */}
//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {grades.map((grade, idx) => (
//             <div key={`${grade.gradebarId}-${idx}`} className="space-y-2">
//               <div className="flex items-center gap-4">
//                 <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
//                   {editingGradeId === grade.gradebarId ? (
//                     <>
//                       <input
//                         value={tempGradeName}
//                         onChange={(e) => setTempGradeName(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter")
//                             saveGradeName(grade.gradebarId, grade.isFallback);
//                           if (e.key === "Escape") setEditingGradeId(null);
//                         }}
//                         className="text-white px-1 rounded"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() =>
//                           saveGradeName(grade.gradebarId, grade.isFallback)
//                         }
//                         className="text-white bg-green-600 px-2 py-0.5 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {grade.label}
//                       {user?.user_type?.toLowerCase() === "admin" && (
//                         <button
//                           onClick={() =>
//                             handleGradeEdit(grade.gradebarId, grade.label)
//                           }
//                           title="Edit grade name"
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </h2>
//                 {idx === 0 && <AvailableLabel />}
//               </div>

//               <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, pidx) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type.toLowerCase() === "admin" ||
//                     user?.id === player.user_id;
//                   const globalIndex = idx * groupSize + pidx;
//                   const isAllowed = globalIndex < allowedUsers;

//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${
//                         player.image
//                       }?t=${Date.now()}`
//                     : Logo;

//                   return (
//                     <motion.div
//                       key={player.id || pidx}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) {
//                             setIsProDialogOpen(true);
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
//                         className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-400"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && canEdit
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "cursor-not-allowed opacity-70 "
//                           }`}
//                       >
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-md font-bold ">{player.rank}</p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                             width={48}
//                             height={48}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col flex-1 min-w-0">
//                             <p
//                               className="text-md font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p className="text-sm" title={player.phone}>
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

//       {/* ✅ Floating Chat Button */}
//       <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
//         {isChatOpen && (
//           <div className="w-80 h-96 mb-2 shadow-lg rounded-lg overflow-hidden">
//             <Chat
//               senderId={user?.id}
//               receiverId={receiverId || null}
//               players={uniquePlayers}
//               setReceiverId={setReceiverId}
//               socket={socket}
//               ladderId={ladderId}
//             />
//           </div>
//         )}
//         <button
//           onClick={() => setIsChatOpen((prev) => !prev)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
//         >
//           Chat
//         </button>
//       </div>

//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) dispatch(fetchUserProfile(user.id));
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//               dispatch(fetchGradebars(ladderId));
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
















// ======================sham ka code========================



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
// import EditPlayer from "@/components/shared/EditPlayer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useRouter, useSearchParams } from "next/navigation";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import {
//   fetchGradebars,
//   resetGradebar,
//   updatePrimaryGradebarName,
// } from "@/redux/slices/gradebarSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import purchase from "@/public/flash-sale.gif";
// import { Button } from "@/components/ui/button";
// import { paymentPage } from "@/helper/RouteName";

// import Chat from "@/components/pages/chat/Chat";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const PlayersLists1 = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user);
//   const subscription = useSelector((state) => state.user?.subscription);
//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
//     (state) => state.gradebar
//   );

//   const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [receiverId, setReceiverId] = useState("");

//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isProDialogOpen, setIsProDialogOpen] = useState(false);

//   const [editingGradeId, setEditingGradeId] = useState(null);
//   const [tempGradeName, setTempGradeName] = useState("");
//   const [localGradebars, setLocalGradebars] = useState([]);
//   const [groupSize, setGroupSize] = useState(5);

//   // ✅ Allowed users calculation
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

//   // ✅ Fetch leaderboard + gradebars
//   useEffect(() => {
//     if (!ladderId) return;
//     setLoadingPlayers(true);
//     Promise.all([
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })),
//       dispatch(fetchGradebars(ladderId)),
//     ]).finally(() => setLoadingPlayers(false));
//   }, [dispatch, ladderId]);

//   // ✅ Store gradebars locally
//   useEffect(() => {
//     if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
//     if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
//   }, [gradebarDetails, gradebar]);

//   // ✅ Fetch profile
//   useEffect(() => {
//     if (user?.id) dispatch(fetchUserProfile(user.id));
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     dispatch(setSelectedPlayer(null));
//   }, [ladderId, dispatch]);

//   // ✅ Filtered list
//   const playerList = players?.[ladderId]?.data || [];
//   const filteredPlayers = searchQuery
//     ? playerList.filter((p) =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;
//   const uniquePlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   // ✅ Group by grade
//   const generateGrades = (playersArr, gradebars = []) => {
//     const size = Number(groupSize) || 5;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += size) {
//       const group = playersArr.slice(i, i + size);
//       const idx = Math.floor(i / size);
//       const gb = gradebars[idx];
//       out.push({
//         label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
//         players: group,
//         gradebarId: gb?.id ?? `fallback-${idx}`,
//         isFallback: !gb?.id,
//       });
//     }
//     return out;
//   };
//   const grades = generateGrades(uniquePlayers, localGradebars);

//   // ✅ Edit grade name
//   const handleGradeEdit = (gradebarId, currentName) => {
//     setEditingGradeId(gradebarId);
//     setTempGradeName(currentName || "");
//   };

//   const saveGradeName = async (gradebarId, isFallback = false) => {
//     if (!tempGradeName.trim()) {
//       setEditingGradeId(null);
//       return;
//     }
//     setLocalGradebars((prev) => {
//       if (isFallback)
//         return [...prev, { id: gradebarId, gradebar_name: tempGradeName.trim() }];
//       return prev.map((g) =>
//         g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
//       );
//     });
//     setEditingGradeId(null);
//   };

//   const handlePresetChange = async (value) => {
//     setGroupSize(value);
//     if (!ladderId || !user?.id) return;
//     try {
//       await dispatch(
//         resetGradebar({
//           user_id: user.id,
//           ladder_id: ladderId,
//           gradebar_id: gradebar?.id,
//           preset: value,
//           gradebar_name: primaryGradebarName || "SECTION",
//         })
//       ).unwrap();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reset gradebar!");
//     }
//   };

//   // ✅ Purchase
//   const handlePurchase = () => router.push(paymentPage);

//   return (
//     <div id="print-section" className="p-4 space-y-6 relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* PREMIUM DIALOG */}
//       <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
//         <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
//           <div>
//             <Image src={purchase} alt="purchase" width={100} height={100} />
//           </div>
//           <DialogHeader>
//             <DialogTitle>Premium Feature</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">Please purchase first to unlock the ladder</p>
//           <div>
//             <Button
//               onClick={handlePurchase}
//               className="cursor-pointer bg-white border text-black hover:bg-red-200"
//             >
//               Purchase Ladder
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* EDIT SECTIONS */}
//       <div className="mb-4 flex items-center gap-2">
//         <div className="font-bold text-red-600">Edit Sections:</div>
//         <select
//           id="groupSize"
//           value={groupSize}
//           onChange={(e) => handlePresetChange(Number(e.target.value))}
//           className="border rounded px-2 py-1"
//         >
//           {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* LADDER LINK + SEARCH */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         {user?.user_type?.toLowerCase() === "admin" && ladderId && (
//           <LadderLinkPanel ladderId={ladderId} />
//         )}
//         <div className="w-full md:w-[40%]">
//           {playerList.length > 0 && (
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           )}
//         </div>
//       </div>

//       {/* PLAYER LIST */}
//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {grades.map((grade, idx) => (
//             <div key={grade.gradebarId} className="space-y-2">
//               <div className="flex items-center gap-4">
//                 <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
//                   {editingGradeId === grade.gradebarId ? (
//                     <>
//                       <input
//                         value={tempGradeName}
//                         onChange={(e) => setTempGradeName(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter")
//                             saveGradeName(grade.gradebarId, grade.isFallback);
//                           if (e.key === "Escape") setEditingGradeId(null);
//                         }}
//                         className="text-white px-1 rounded"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() =>
//                           saveGradeName(grade.gradebarId, grade.isFallback)
//                         }
//                         className="text-white bg-green-600 px-2 py-0.5 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {grade.label}
//                       {user?.user_type?.toLowerCase() === "admin" && (
//                         <button
//                           onClick={() =>
//                             handleGradeEdit(grade.gradebarId, grade.label)
//                           }
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </h2>
//                 {idx === 0 && <AvailableLabel />}
//               </div>

//               {/* ✅ Player grid */}
//               <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, pidx) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type?.toLowerCase() === "admin" ||
//                     user?.id === player.user_id;
//                   const globalIndex = idx * groupSize + pidx;
//                   const isAllowed = globalIndex < allowedUsers;
//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                     : Logo;

//                   return (
//                     <motion.div
//                       key={player.id || pidx}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) return setIsProDialogOpen(true);
//                           if (!canEdit)
//                             return toast.warning("You may only tap on your name");

//                           // ✅ Restrict higher-ranked players
//                           const loggedInPlayer = uniquePlayers.find(
//                             (p) => p.user_id === user?.id
//                           );
//                           if (
//                             loggedInPlayer &&
//                             loggedInPlayer.rank < player.rank
//                           ) {
//                             toast.warning(
//                               "Higher-ranked players cannot challenge lower-ranked players!"
//                             );
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
//                         className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-400"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && canEdit
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "cursor-not-allowed opacity-70"
//                           }`}
//                       >
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-md font-bold">{player.rank}</p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                             width={48}
//                             height={48}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col flex-1 min-w-0">
//                             <p
//                               className="text-md font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p className="text-sm" title={player.phone}>
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

//       {/* ✅ Floating Chat */}
//       <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
//         {isChatOpen && (
//           <div className="w-80 h-96 mb-2 shadow-lg rounded-lg overflow-hidden">
//             <Chat
//               senderId={user?.id}
//               receiverId={receiverId || null}
//               players={uniquePlayers}
//               setReceiverId={setReceiverId}
//               socket={socket}
//               ladderId={ladderId}
//             />
//           </div>
//         )}
//         <button
//           onClick={() => setIsChatOpen((prev) => !prev)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
//         >
//           Chat
//         </button>
//       </div>

//       {/* ✅ Edit Modal */}
//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) dispatch(fetchUserProfile(user.id));
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//               dispatch(fetchGradebars(ladderId));
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














// ===========================================






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
// import EditPlayer from "@/components/shared/EditPlayer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchUserProfile } from "@/redux/slices/profileSlice";
// import PlayerSearchInput from "./PlayerSearchInput";
// import LadderLinkPanel from "./LadderLinkPanel";
// import { useRouter, useSearchParams } from "next/navigation";
// import AvailableLabel from "@/components/shared/AvailableLabel";
// import {
//   fetchGradebars,
//   resetGradebar,
// } from "@/redux/slices/gradebarSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import purchase from "@/public/flash-sale.gif";
// import { Button } from "@/components/ui/button";
// import { paymentPage } from "@/helper/RouteName";
// import Chat from "@/components/pages/chat/Chat";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const PlayersLists1 = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const ladderId = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user);
//   const subscription = useSelector((state) => state.user?.subscription);
//   const { players, selectedPlayer } = useSelector((state) => state.player);
//   const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
//     (state) => state.gradebar
//   );

//   const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [receiverId, setReceiverId] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [moveLoading, setMoveLoading] = useState(false);
//   const [loadingPlayers, setLoadingPlayers] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isProDialogOpen, setIsProDialogOpen] = useState(false);
//   const [editingGradeId, setEditingGradeId] = useState(null);
//   const [tempGradeName, setTempGradeName] = useState("");
//   const [localGradebars, setLocalGradebars] = useState([]);
//   const [groupSize, setGroupSize] = useState(5);

//   // ✅ Allowed users calculation
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

//   // ✅ Fetch leaderboard + gradebars
//   useEffect(() => {
//     if (!ladderId) return;
//     setLoadingPlayers(true);
//     Promise.all([
//       dispatch(fetchLeaderboard({ ladder_id: ladderId })),
//       dispatch(fetchGradebars(ladderId)),
//     ]).finally(() => setLoadingPlayers(false));
//   }, [dispatch, ladderId]);

//   // ✅ Store gradebars locally
//   useEffect(() => {
//     if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
//     if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
//   }, [gradebarDetails, gradebar]);

//   // ✅ Fetch profile
//   useEffect(() => {
//     if (user?.id) dispatch(fetchUserProfile(user.id));
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     dispatch(setSelectedPlayer(null));
//   }, [ladderId, dispatch]);

//   // ✅ Filtered list
//   const playerList = players?.[ladderId]?.data || [];
//   const filteredPlayers = searchQuery
//     ? playerList.filter((p) =>
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : playerList;
//   const uniquePlayers = Array.from(
//     new Map(filteredPlayers.map((p) => [p.id, p])).values()
//   );

//   // ✅ Group by grade
//   const generateGrades = (playersArr, gradebars = []) => {
//     const size = Number(groupSize) || 5;
//     const out = [];
//     for (let i = 0; i < playersArr.length; i += size) {
//       const group = playersArr.slice(i, i + size);
//       const idx = Math.floor(i / size);
//       const gb = gradebars[idx];
//       out.push({
//         label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
//         players: group,
//         gradebarId: gb?.id ?? `fallback-${idx}`,
//         isFallback: !gb?.id,
//       });
//     }
//     return out;
//   };
//   const grades = generateGrades(uniquePlayers, localGradebars);

//   // ✅ Edit grade name
//   const handleGradeEdit = (gradebarId, currentName) => {
//     setEditingGradeId(gradebarId);
//     setTempGradeName(currentName || "");
//   };

//   const saveGradeName = async (gradebarId, isFallback = false) => {
//     if (!tempGradeName.trim()) {
//       setEditingGradeId(null);
//       return;
//     }
//     setLocalGradebars((prev) => {
//       if (isFallback)
//         return [
//           ...prev,
//           { id: gradebarId, gradebar_name: tempGradeName.trim() },
//         ];
//       return prev.map((g) =>
//         g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
//       );
//     });
//     setEditingGradeId(null);
//   };

//   const handlePresetChange = async (value) => {
//     setGroupSize(value);
//     if (!ladderId || !user?.id) return;
//     try {
//       await dispatch(
//         resetGradebar({
//           user_id: user.id,
//           ladder_id: ladderId,
//           gradebar_id: gradebar?.id,
//           preset: value,
//           gradebar_name: primaryGradebarName || "SECTION",
//         })
//       ).unwrap();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reset gradebar!");
//     }
//   };

//   // ✅ Purchase
//   const handlePurchase = () => router.push(paymentPage);

//   return (
//     <div id="print-section" className="p-4 space-y-6 relative">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* PREMIUM DIALOG */}
//       <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
//         <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
//           <div>
//             <Image src={purchase} alt="purchase" width={100} height={100} />
//           </div>
//           <DialogHeader>
//             <DialogTitle>Premium Feature</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Please purchase first to unlock the ladder
//           </p>
//           <div>
//             <Button
//               onClick={handlePurchase}
//               className="cursor-pointer bg-white border text-black hover:bg-red-200"
//             >
//               Purchase Ladder
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* EDIT SECTIONS */}
//       <div className="mb-4 flex items-center gap-2">
//         <div className="font-bold text-red-600">Edit Sections:</div>
//         <select
//           id="groupSize"
//           value={groupSize}
//           onChange={(e) => handlePresetChange(Number(e.target.value))}
//           className="border rounded px-2 py-1"
//         >
//           {[2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* LADDER LINK + SEARCH */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         {user?.user_type?.toLowerCase() === "admin" && ladderId && (
//           <LadderLinkPanel ladderId={ladderId} />
//         )}
//         <div className="w-full md:w-[40%]">
//           {playerList.length > 0 && (
//             <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
//           )}
//         </div>
//       </div>

//       {/* PLAYER LIST */}
//       {loadingPlayers ? (
//         <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-24 w-full rounded-md" />
//           ))}
//         </CardContent>
//       ) : (
//         <div className="space-y-8">
//           {grades.map((grade, idx) => (
//             <div key={grade.gradebarId} className="space-y-2">
//               <div className="flex items-center gap-4">
//                 <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
//                   {editingGradeId === grade.gradebarId ? (
//                     <>
//                       <input
//                         value={tempGradeName}
//                         onChange={(e) => setTempGradeName(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter")
//                             saveGradeName(grade.gradebarId, grade.isFallback);
//                           if (e.key === "Escape") setEditingGradeId(null);
//                         }}
//                         className="text-white px-1 rounded"
//                         autoFocus
//                       />
//                       <button
//                         onClick={() =>
//                           saveGradeName(grade.gradebarId, grade.isFallback)
//                         }
//                         className="text-white bg-green-600 px-2 py-0.5 rounded"
//                       >
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {grade.label}
//                       {user?.user_type?.toLowerCase() === "admin" && (
//                         <button
//                           onClick={() =>
//                             handleGradeEdit(grade.gradebarId, grade.label)
//                           }
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </h2>
//                 {idx === 0 && <AvailableLabel />}
//               </div>

//               {/* ✅ Player grid */}
//               <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
//                 {grade.players.map((player, pidx) => {
//                   const isActive = selectedPlayer?.id === player.id;
//                   const canEdit =
//                     user?.user_type?.toLowerCase() === "admin" ||
//                     user?.id === player.user_id;
//                   const globalIndex = idx * groupSize + pidx;
//                   const isAllowed = globalIndex < allowedUsers;

//                   const playerImageUrl = player.image
//                     ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
//                     : Logo;

//                   const loggedInPlayer = uniquePlayers.find(
//                     (p) => p.user_id === user?.id
//                   );

//                   // ✅ Determine if current player can be challenged
//                   const isChallengable =
//                     loggedInPlayer &&
//                     loggedInPlayer.rank > player.rank &&
//                     loggedInPlayer.rank !== player.rank;

//                   return (
//                     <motion.div
//                       key={player.id || pidx}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: pidx * 0.03 }}
//                     >
//                       <div
//                         onClick={() => {
//                           if (!isAllowed) return setIsProDialogOpen(true);
//                           if (!canEdit)
//                             return toast.warning("You may only tap on your name");
//                           if (loggedInPlayer.rank === player.rank)
//                             return toast.info("You cannot challenge yourself!");
//                           if (!isChallengable)
//                             return toast.warning(
//                               "You can only challenge players ranked above you!"
//                             );

//                           dispatch(
//                             setSelectedPlayer({
//                               ...player,
//                               ladder_id: ladderId,
//                             })
//                           );
//                           setIsOpen(true);
//                         }}
//                         className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
//                           ${
//                             player.player_status === 1
//                               ? "bg-green-400"
//                               : isActive
//                               ? "bg-yellow-300"
//                               : "bg-blue-100 dark:bg-gray-800"
//                           }
//                           ${
//                             isAllowed && isChallengable
//                               ? "cursor-pointer hover:scale-[1.01]"
//                               : "opacity-60 cursor-not-allowed"
//                           }`}
//                       >
//                         <div className="flex items-center w-full gap-3">
//                           <p className="text-md font-bold">{player.rank}</p>
//                           <Image
//                             src={playerImageUrl}
//                             className="rounded-full w-12 h-12 object-cover border border-gray-300"
//                             width={48}
//                             height={48}
//                             alt={`Player ${player.name}`}
//                           />
//                           <div className="flex flex-col flex-1 min-w-0">
//                             <p
//                               className="text-md font-semibold truncate text-gray-900"
//                               title={player.name}
//                             >
//                               {player.name}
//                             </p>
//                             <p className="text-sm" title={player.phone}>
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

//       {/* ✅ Floating Chat */}
//       <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
//         {isChatOpen && (
//           <div className="w-80 h-96 mb-2 shadow-lg rounded-lg overflow-hidden">
//             <Chat
//               senderId={user?.id}
//               receiverId={receiverId || null}
//               players={uniquePlayers}
//               setReceiverId={setReceiverId}
//               socket={socket}
//               ladderId={ladderId}
//             />
//           </div>
//         )}
//         <button
//           onClick={() => setIsChatOpen((prev) => !prev)}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
//         >
//           Chat
//         </button>
//       </div>

//       {/* ✅ Edit Modal */}
//       {selectedPlayer && (
//         <EditPlayer
//           open={isOpen}
//           onClose={() => {
//             setIsOpen(false);
//             dispatch(setSelectedPlayer(null));
//             if (user?.id) dispatch(fetchUserProfile(user.id));
//             if (ladderId) {
//               dispatch(fetchLeaderboard({ ladder_id: ladderId }));
//               dispatch(fetchGradebars(ladderId));
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





// ====================================31/10/25================================





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
import EditPlayer from "@/components/shared/EditPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserProfile } from "@/redux/slices/profileSlice";
import PlayerSearchInput from "./PlayerSearchInput";
import LadderLinkPanel from "./LadderLinkPanel";
import { useRouter, useSearchParams } from "next/navigation";
import AvailableLabel from "@/components/shared/AvailableLabel";
import {
  fetchGradebars,
  resetGradebar,
  updatePrimaryGradebarName,
} from "@/redux/slices/gradebarSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import purchase from "@/public/flash-sale.gif";
import { Button } from "@/components/ui/button";
import { paymentPage } from "@/helper/RouteName";

// import MessageBoard from "@/components/pages/chat/MessageBoard";// ✅ import message board

import MessageBoard from "../message/message";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const PlayersLists1 = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladder_id");

  const user = useSelector((state) => state.user?.user);
  const subscription = useSelector((state) => state.user?.subscription);
  const { players, selectedPlayer } = useSelector((state) => state.player);
  const { gradebarDetails, gradebar, primaryGradebarName } = useSelector(
    (state) => state.gradebar
  );

  const [allowedUsers, setAllowedUsers] = useState(subscription?.no_of_users);
  const [isBoardOpen, setIsBoardOpen] = useState(false); // ✅ toggle for message board

  const [isOpen, setIsOpen] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProDialogOpen, setIsProDialogOpen] = useState(false);

  const [editingGradeId, setEditingGradeId] = useState(null);
  const [tempGradeName, setTempGradeName] = useState("");
  const [localGradebars, setLocalGradebars] = useState([]);
  const [groupSize, setGroupSize] = useState(5);

  // ✅ Allowed users calculation
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

  // ✅ Fetch leaderboard + gradebars
  useEffect(() => {
    if (!ladderId) return;
    setLoadingPlayers(true);
    Promise.all([
      dispatch(fetchLeaderboard({ ladder_id: ladderId })),
      dispatch(fetchGradebars(ladderId)),
    ]).finally(() => setLoadingPlayers(false));
  }, [dispatch, ladderId]);

  // ✅ Store gradebars locally
  useEffect(() => {
    if (Array.isArray(gradebarDetails)) setLocalGradebars(gradebarDetails);
    if (gradebar?.preset) setGroupSize(Number(gradebar.preset));
  }, [gradebarDetails, gradebar]);

  // ✅ Fetch profile
  useEffect(() => {
    if (user?.id) dispatch(fetchUserProfile(user.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(setSelectedPlayer(null));
  }, [ladderId, dispatch]);

  // ✅ Filtered list
  const playerList = players?.[ladderId]?.data || [];
  const filteredPlayers = searchQuery
    ? playerList.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playerList;
  const uniquePlayers = Array.from(
    new Map(filteredPlayers.map((p) => [p.id, p])).values()
  );

  // ✅ Group by grade
  const generateGrades = (playersArr, gradebars = []) => {
    const size = Number(groupSize) || 5;
    const out = [];
    for (let i = 0; i < playersArr.length; i += size) {
      const group = playersArr.slice(i, i + size);
      const idx = Math.floor(i / size);
      const gb = gradebars[idx];
      out.push({
        label: gb?.gradebar_name || `SECTION ${String.fromCharCode(65 + idx)}`,
        players: group,
        gradebarId: gb?.id ?? `fallback-${idx}`,
        isFallback: !gb?.id,
      });
    }
    return out;
  };
  const grades = generateGrades(uniquePlayers, localGradebars);

  // ✅ Edit grade name
  const handleGradeEdit = (gradebarId, currentName) => {
    setEditingGradeId(gradebarId);
    setTempGradeName(currentName || "");
  };

  const saveGradeName = async (gradebarId, isFallback = false) => {
    if (!tempGradeName.trim()) {
      setEditingGradeId(null);
      return;
    }
    setLocalGradebars((prev) => {
      if (isFallback)
        return [...prev, { id: gradebarId, gradebar_name: tempGradeName.trim() }];
      return prev.map((g) =>
        g.id === gradebarId ? { ...g, gradebar_name: tempGradeName.trim() } : g
      );
    });
    setEditingGradeId(null);
  };

  const handlePresetChange = async (value) => {
    setGroupSize(value);
    if (!ladderId || !user?.id) return;
    try {
      await dispatch(
        resetGradebar({
          user_id: user.id,
          ladder_id: ladderId,
          gradebar_id: gradebar?.id,
          preset: value,
          gradebar_name: primaryGradebarName || "SECTION",
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset gradebar!");
    }
  };

  const handlePurchase = () => router.push(paymentPage);

  return (
    <div id="print-section" className="p-4 space-y-6 relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* PREMIUM DIALOG */}
      <Dialog open={isProDialogOpen} onOpenChange={setIsProDialogOpen}>
        <DialogContent className="sm:max-w-md flex items-center justify-center flex-col">
          <div>
            <Image src={purchase} alt="purchase" width={100} height={100} />
          </div>
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Please purchase first to unlock the ladder</p>
          <div>
            <Button
              onClick={handlePurchase}
              className="cursor-pointer bg-white border text-black hover:bg-red-200"
            >
              Purchase Ladder
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT SECTIONS */}
      <div className="mb-4 flex items-center gap-2">
        <div className="font-bold text-red-600">Edit Sections:</div>
        <select
          id="groupSize"
          value={groupSize}
          onChange={(e) => handlePresetChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1,2, 3, 4, 5, 6, 7, 8, 10,11, 12,13,14, 15,16,17,18,19, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* LADDER LINK + SEARCH */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {user?.user_type?.toLowerCase() === "admin" && ladderId && (
          <LadderLinkPanel ladderId={ladderId} />
        )}
        <div className="w-full md:w-[40%]">
          {playerList.length > 0 && (
            <PlayerSearchInput value={searchQuery} onChange={setSearchQuery} />
          )}
        </div>
      </div>

      {/* PLAYER LIST */}
      {loadingPlayers ? (
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </CardContent>
      ) : (
        <div className="space-y-8">
          {grades.map((grade, idx) => (
            <div key={grade.gradebarId} className="space-y-2">
              <div className="flex items-center gap-4">
                <h2 className="flex items-center gap-2 font-bold bg-white text-black border border-black px-4 py-1 rounded shadow-sm uppercase">
                  {editingGradeId === grade.gradebarId ? (
  <>
    <input
      value={tempGradeName}
      onChange={(e) => setTempGradeName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter")
          saveGradeName(grade.gradebarId, grade.isFallback);
        if (e.key === "Escape") setEditingGradeId(null);
      }}
      // fixed background and text color to match h2
      className="bg-white text-black px-1 rounded border outline-none"
      autoFocus
    />
    <button
      onClick={() =>
        saveGradeName(grade.gradebarId, grade.isFallback)
      }
      className="text-white bg-green-600 px-2 py-0.5 rounded"
    >
      Save
    </button>
  </>
) : (
  <>
    {grade.label}
    {user?.user_type?.toLowerCase() === "admin" && (
      <button
        onClick={() =>
          handleGradeEdit(grade.gradebarId, grade.label)
        }
      >
        ✏️
      </button>
    )}
  </>
)}

                </h2>
                {idx === 0 && <AvailableLabel />}
              </div>

              {/* Player grid */}
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
                {grade.players.map((player, pidx) => {
                  const isActive = selectedPlayer?.id === player.id;
                  const canEdit =
                    user?.user_type?.toLowerCase() === "admin" ||
                    user?.id === player.user_id;
                  const globalIndex = idx * groupSize + pidx;
                  const isAllowed = globalIndex < allowedUsers;
                  const playerImageUrl = player.image
                    ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${player.image}?t=${Date.now()}`
                    : Logo;

                  return (
                    <motion.div
                      key={player.id || pidx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: pidx * 0.03 }}
                    >
                      <div
                        onClick={() => {
                          if (!isAllowed) return setIsProDialogOpen(true);
                          if (!canEdit)
                            return toast.warning("You may only tap on your name");

                          const loggedInPlayer = uniquePlayers.find(
                            (p) => p.user_id === user?.id
                          );
                          if (
                            loggedInPlayer &&
                            loggedInPlayer.rank < player.rank
                          ) {
                            toast.warning(
                              "Higher-ranked players cannot challenge lower-ranked players!"
                            );
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
                        className={`relative flex flex-col gap-2 items-center rounded-md shadow-md py-3 px-4 transition-all
                          ${
                            player.player_status === 1
                              ? "bg-green-400"
                              : isActive
                              ? "bg-yellow-300"
                              : "bg-blue-100 dark:bg-gray-800"
                          }
                          ${
                            isAllowed && canEdit
                              ? "cursor-pointer hover:scale-[1.01]"
                              : "cursor-not-allowed opacity-70"
                          }`}

                      >
                        <div className="flex items-center w-full gap-3">
                          <p className="text-md font-bold">{player.rank}</p>
                          <Image
                            src={playerImageUrl}
                            className="rounded-full w-12 h-12 object-cover border border-gray-300"
                            width={48}
                            height={48}
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
        </div>
      )}

      {/* ✅ Floating Message Board */}
      {/* <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {isBoardOpen && (
          <div className="w-80 h-[28rem] mb-2 shadow-lg rounded-lg overflow-hidden bg-white">
            <MessageBoard senderId={user?.id} ladderId={ladderId} onClose={() => setShowChat(false)} />
          </div>
        )}
        <button
          onClick={() => setIsBoardOpen((prev) => !prev)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
        >
          {isBoardOpen ? "Close Board" : "Message Board"}
        </button>
      </div> */}



      {/* ✅ Floating Message Board */}
<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
  {isBoardOpen && (
    <div className="w-80 h-[28rem] mb-2 shadow-lg rounded-lg overflow-hidden">
      <MessageBoard
        senderId={user?.id}
        ladderId={ladderId}
        onClose={() => setIsBoardOpen(false)} // ✅ correct handler
      />
    </div>
  )}

  <button
    onClick={() => setIsBoardOpen((prev) => !prev)}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg"
  >
    {isBoardOpen ? "Close Board" : "ChatBoard"}
  </button>
</div>


      {/* Edit Player Modal */}
      {selectedPlayer && (
        <EditPlayer
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            dispatch(setSelectedPlayer(null));
            if (user?.id) dispatch(fetchUserProfile(user.id));
            if (ladderId) {
              dispatch(fetchLeaderboard({ ladder_id: ladderId }));
              dispatch(fetchGradebars(ladderId));
            }
          }}
          currentId={selectedPlayer?.id}
          setLoading={setMoveLoading}
        />
      )}
    </div>
  );
};

export default PlayersLists1;
