

// "use client";

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { LogOut, UserCircle2, Shield, UserPlus } from "lucide-react";
// import { IoIosArrowDown } from "react-icons/io";
// import Logo from "@/public/logo.jpg";
// import { persistor } from "@/redux/store";
// import Link from "next/link";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const UserDetails = ({ user: demoUser }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   // prop user first, fallback to Redux
//   const userFromState = useSelector((state) => state.user?.user);
//   const user = demoUser || userFromState;

//   const getEncodedLadderId = () => {
//     if (!user || !user.ladder_id) return null;
//     return btoa(String(user.ladder_id));
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     persistor.purge();
//     localStorage.clear();
//     sessionStorage.clear();

//     if (user?.user_type === "admin") {
//       router.push("/login-page");
//       return;
//     }

//     const encodedId = getEncodedLadderId();
//     const redirectUrl = encodedId ? `/login-user?id=${encodedId}` : "/login-user";
//     router.push(redirectUrl);
//   };

//   const handleAdminClick = () => {
//     router.push("/admin-page");
//   };

//   return (
//     <div className="w-full">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <div className="flex justify-end items-center space-x-3 cursor-pointer rounded-md px-3 py-2 transition dark:hover:bg-zinc-800">
//             <Image
//               src={Logo}
//               alt="User"
//               width={32}
//               height={32}
//               className="rounded-full border w-8 h-8 object-cover"
//             />
//             <div className="hidden sm:flex flex-col">
//               <span className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-200">
//                 {user?.name || "Guest"}
//               </span>
//               <span className="text-xs text-zinc-500">Profile</span>
//             </div>
//             <IoIosArrowDown size={18} className="text-zinc-600" />
//           </div>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="w-52 mt-2" align="end">
//           <DropdownMenuLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
//             <UserCircle2 className="w-4 h-4" />
//             {user?.name || "Guest"}
//           </DropdownMenuLabel>

//           <DropdownMenuSeparator />

//           {/* DEMO USER LOGIC */}
//           {demoUser ? (
//             <DropdownMenuItem
//               onClick={handleAdminClick}
//               className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
//             >
//               {/* Demo-specific logic if needed */}
//             </DropdownMenuItem>
//           ) : (
//             <>
//               {/* Admin User */}
//               {user?.user_type === "admin" && (
//                 <>
//                   <DropdownMenuItem
//                     onClick={handleAdminClick}
//                     className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                   >
//                     <Shield className="mr-2 h-4 w-4 text-blue-600" />
//                     Admin Panel
//                   </DropdownMenuItem>

//                   {getEncodedLadderId() && (
//                     <Link
//                       href={`/register-user/${getEncodedLadderId()}`}
//                       className="flex items-center gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 px-2 py-1"
//                     >
//                       <UserPlus className="mr-2 h-4 w-4 text-green-600" />
//                       Register Player
//                     </Link>
//                   )}

//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Logout
//                   </DropdownMenuItem>
//                 </>
//               )}

//               {/* Normal Player User (except joe@gmail.com) */}
//               {user && user?.user_type !== "admin" && user?.user_id !== "joebloggs@gmail.com" && (
//                 <DropdownMenuItem
//                   onClick={handleLogout}
//                   className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Logout
//                 </DropdownMenuItem>
//               )}

//               {/* Guest User */}
//               {!user && (
//                 <DropdownMenuItem
//                   onClick={() => router.push("/login-user")}
//                   className="text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Login
//                 </DropdownMenuItem>
//               )}
//             </>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

// export default UserDetails;























// ============================================== 


"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, UserCircle2, Shield, UserPlus, Key } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "@/public/logo.jpg";
import { persistor } from "@/redux/store";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ChangePassword from "@/components/pages/admin/ChangePassword"; // modal form component

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"; // assuming you have a dialog component

const UserDetails = ({ user: demoUser }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userFromState = useSelector((state) => state.user?.user);
  const user = demoUser || userFromState;

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const getEncodedLadderId = () => {
    if (!user || !user.ladder_id) return null;
    return btoa(String(user.ladder_id));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    persistor.purge();
    localStorage.clear();
    sessionStorage.clear();

    if (user?.user_type === "admin") {
      router.push("/login-page");
      return;
    }

    const encodedId = getEncodedLadderId();
    const redirectUrl = encodedId ? `/login-user?id=${encodedId}` : "/login-user";
    router.push(redirectUrl);
  };

  const handleAdminClick = () => {
    router.push("/admin-page");
  };

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end items-center space-x-3 cursor-pointer rounded-md px-3 py-2 transition dark:hover:bg-zinc-800">
            <Image
              src={Logo}
              alt="User"
              width={32}
              height={32}
              className="rounded-full border w-8 h-8 object-cover"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-200">
                {user?.name || "Guest"}
              </span>
              <span className="text-xs text-zinc-500">Profile</span>
            </div>
            <IoIosArrowDown size={18} className="text-zinc-600" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52 mt-2" align="end">
          <DropdownMenuLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
            <UserCircle2 className="w-4 h-4" />
            {user?.name || "Guest"}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {demoUser ? (
            <DropdownMenuItem
              onClick={handleAdminClick}
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              {/* Demo logic */}
            </DropdownMenuItem>
          ) : (
            <>
              {user?.user_type === "admin" && (
                <>
                  <DropdownMenuItem
                    onClick={handleAdminClick}
                    className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Shield className="mr-2 h-4 w-4 text-blue-600" />
                    Admin Panel
                  </DropdownMenuItem>

                  {/* Open Change Password Modal */}
                  <DropdownMenuItem
                    onClick={handleOpenChangePassword}
                    className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <Key className="mr-2 h-4 w-4 text-green-600" />
                    Change Password
                  </DropdownMenuItem>

                  {getEncodedLadderId() && (
                    <Link
                      href={`/register-user/${getEncodedLadderId()}`}
                      className="flex items-center gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 px-2 py-1"
                    >
                      <UserPlus className="mr-2 h-4 w-4 text-green-600" />
                      Register Player
                    </Link>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              )}

              {user && user?.user_type !== "admin" && user?.user_id !== "joebloggs@gmail.com" && (
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              )}

              {!user && (
                <DropdownMenuItem
                  onClick={() => router.push("/login-user")}
                  className="text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Login
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Modal */}
       {isChangePasswordOpen && (
  <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
    <DialogContent className="w-[400px] rounded-xl p-6">
      <DialogTitle className="text-lg font-semibold text-center mb-4">
        Change Password
      </DialogTitle>

      {/* Clean form without double card */}
      <ChangePassword userId={user.id} />

      <div className="mt-4 flex justify-center">
        <DialogClose className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90">
          Close
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
};

export default UserDetails;
