// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Image from "next/image";
// import Logo from "@/public/logo.jpg";
// import Link from "next/link";
// import { loginPage, registerPage } from "@/helper/RouteName";
// import { FaUserFriends } from "react-icons/fa";
// import { FaUserCheck } from "react-icons/fa";

// const players = [
// //   { name: "mark ambler", id: 4 },
//   { name: "steve collinson", id: 40 },
//   { name: "steve glynn", id: 12 },
//   { name: "sean fleming", id: 16 },
//   { name: "adrian leach", id: 20 },
//   { name: "geoff leigh", id: 24 },
//   { name: "mark hilyard", id: 28 },
//   { name: "lawrence brophy", id: 32 },
//   { name: "naomi partridge", id: 36 },
// ];

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-200 py-10 px-4 flex flex-col gap-8">
//       <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left: Player List */}
//         <Card className="col-span-1 bg-pink-100">
//           <CardHeader>
//             <CardTitle className="text-2xl text-center border-b-2 font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Club Ladder</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[500px]">
//               <div className="space-y-2">
                
//                 {players.map((player, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between px-4 py-2 rounded-md bg-white shadow-sm hover:bg-pink-50"
//                   >
                    
//                     <div className="flex items-center justify-center gap-3">
//                         <span className="font-semibold text-sm">{player.id}</span>
//                       <Image
//                         src={Logo}
//                         alt="player"
//                         width={30}
//                         height={30}
//                         className="rounded-full"
//                       />
                      
//                       <p className="capitalize font-medium text-sm">{player.name}</p>
//                     </div>
                    
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* Center: Info and Rules */}
//         <Card className="col-span-1 md:col-span-2 bg-white/80">
//             <CardContent>
//                 <div className="flex gap-4 justify-end">
//                     {/* <Link href={registerPage}>
//                         <Button className="w-full rounded-none bg-gradient-to-r from-blue-700 to-purple-500 text-white hover:opacity-90 cursor-pointer font-semibold flex justify-center items-center gap-2">
//                            <FaUserFriends /> Register
//                         </Button>
//                     </Link>
//                      <Link href={loginPage}>
//                         <Button className="w-full rounded-none bg-gradient-to-r from-blue-700 to-blue-700 text-white hover:opacity-90 cursor-pointer font-semibold flex justify-center items-center gap-2">
//                            <FaUserCheck /> Login
//                         </Button>
//                     </Link> */}
//                 </div>
//             </CardContent>
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
//               Welcome to Your Club Ladder
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-sm text-gray-700 space-y-4">
//               <p className="font-semibold text-xl text-justify">
//                 It is designed to be run by the players for the players who can
//                 move their rankings after a win to a player above them, get
//                 challenge info and edit their details.
//               </p>
//               <p className="font-semibold italic text-lg">Look after it and enjoy!</p>
//               <div className="mt-4 p-4 rounded-md bg-pink-100 border border-pink-300">
//                 <h3 className="font-bold text-pink-700 mb-2 text-xl">LADDER RULES</h3>
//                 <p className="text-lg">
//                   Players from any one grade may only challenge players within the same grade or the one above.
//                 </p>
//                 <p className="text-lg mt-2">
//                   After a win, click on your icon and use the <span className="text-red-600 font-medium">"MOVE"</span> facility to
//                   move your name up the ladder by entering the number of the
//                   player you have beaten and then press <span className="text-red-600 font-medium">"MOVE"</span>.
//                 </p>
//                 <p className="mt-2 font-semibold text-xl text-end italic">Good Luck!</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Activity Feed */}
//       {/* <div className="max-w-6xl flex items-center justify-end">
//         <Card className="bg-white/80">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold text-purple-600">Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 🎉 Congratulations - chris derham beat john plowman to become club ranked 14
//               </li>
//               <li>
//                 🎉 Congratulations - chris derham beat chris igoe to become club ranked 1
//               </li>
//             </ul>
//           </CardContent>
//         </Card>
//       </div> */}
//     </div>
//   );
// }


import React from 'react'

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage