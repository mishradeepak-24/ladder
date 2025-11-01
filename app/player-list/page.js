

// "use client"

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { loginPage } from "@/helper/RouteName";
// import { PlayerLists } from "@/components/pages/players/PlayerLists";

// const APPKEY =
//   "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// export default function PlayerListPage() {
//   const router = useRouter();
//   // 👇 yahan se user_type Redux store se aa raha hai
//   const user_type = useSelector((state) => state.user?.user?.user_type);

//   const ladder_id = useSelector((state)=> state.user?.user?.ladder_id)
//   console.log("admin ladder id : ", ladder_id)

//   // user.user.ladder_id
//   // user.user.user_type

//   // Joi bhi auth check ho client pe karein
//   useEffect(() => {
//     // ⛔ Agar user_type "admin" nahi hai, toh login par redirect karo
//     if (user_type !== "admin" ) {
//       router.replace(loginPage); // .replace() to prevent back navigation
//     }

//        if (!ladder_id) {
//         router.replace(loginPage); // .replace() to prevent back navigation
//        }

//   }, [user_type, router, ladder_id]);

//   // ⚠️ Jab tak user_type undefined hai (initial load), aap null return karo ya loader dikha do
//   if (user_type !== "admin") {
//     return null;
//   }

//   if(!ladder_id)
//     return null

//   return (
//     <div>
//       <PlayerLists />
//     </div>
//   );
// }








// ====================

// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSelector } from "react-redux";
// import { loginPage } from "@/helper/RouteName";
// import { PlayerLists } from "@/components/pages/players/PlayerLists";
// import { notFound } from "next/navigation";


// export default function PlayerListPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // 🔹 Get ladder_id from URL
//   const urlLadderId = searchParams.get("ladder_id");

//   // 🔹 Get user data from Redux
//   const user = useSelector((state) => state.user?.user);
//   const userType = user?.user_type;
//   const userLadderId = user?.ladder_id;

//   // 🔹 Convert to number for comparison (if stored as number)
//   const parsedUrlLadderId = urlLadderId ? parseInt(urlLadderId, 10) : null;
//   const parsedUserLadderId = userLadderId ? parseInt(userLadderId, 10) : null;

//   // 🔹 Check if ladder_id in URL matches user's ladder_id
//   const isValidLadderId = parsedUrlLadderId === parsedUserLadderId;

//   // 🔹 Auth & Validation Effect
//   useEffect(() => {
//     if (!user) return;

//     if (userType !== "admin") {
//       router.replace(loginPage);
//       return;
//     }

//     if (!userLadderId || !isValidLadderId) {
//       router.replace(loginPage);

//     }
//   }, [user, userType, userLadderId, isValidLadderId, router]);

//   // Early return while checking
//   if (userType !== "admin") return null;
//   if (!userLadderId || !isValidLadderId) return null;

//   // ✅ All checks passed → render component
//   return <PlayerLists />;
// }







// =================


"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { loginPage } from "@/helper/RouteName";
import { PlayerLists } from "@/components/pages/players/PlayerLists";

export default function PlayerListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Get ladder_id from URL
  const urlLadderId = searchParams.get("ladder_id");
  const parsedUrlLadderId = urlLadderId ? parseInt(urlLadderId, 10) : null;

  // 🔹 Get all ladders from Redux (fetched in LadderList)
  const { allLadders } = useSelector((state) => state.fetchLadder);
  const user = useSelector((state) => state.user?.user);
  const userType = user?.user_type;

  // 🔹 Check if URL's ladder_id exists in the fetched ladders
  const ladderExists = allLadders?.some(
    (ladder) => parseInt(ladder.id, 10) === parsedUrlLadderId
  );

  // 🔹 Auth & Validation Effect
  useEffect(() => {
    if (!user || !allLadders) return; // Wait for data

    if (userType !== "admin") {
      router.replace(loginPage);
      return;
    }

    if (!parsedUrlLadderId || !ladderExists) {
      router.replace(loginPage); // or router.replace("/not-found")
    }
  }, [user, userType, allLadders, parsedUrlLadderId, ladderExists, router]);

  // Early return
  if (userType !== "admin") return null;
  if (!parsedUrlLadderId || !ladderExists) return null;

  // ✅ All checks passed
  return <PlayerLists />;
}
