"use client";

import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

// import ActivityLog from "@/components/pages/players/ActivityList";
import UserRules from "@/components/pages/players/UserRules";
import UserHeading from "@/components/pages/users/UserHeading";
import UserDetails from "@/components/shared/UserDetails";
import ContactAdmin from "@/components/shared/ContactAdmin";
import PlayersList from "@/components/pages/users/PlayersList";
import Info from "@/components/shared/Info";
import InfoBar from "@/components/pages/users/InfoBar";
import { Button } from "@/components/ui/button";
// import InfoNotesUser from "@/components/pages/users/InfoNotesUser";
import ActivityLogUser from "@/components/shared/ActivityLogUser";

function UserPageRedirectRouter() {
  const ladderId = useSelector((state) => state.user?.user?.ladder_id);
  const [isLadderView, setIsLadderView] = useState(true);

  const user = useSelector((state) => state.user?.user);
  // ✅ check email
  const isJoeBloggs = user?.user_id?.toLowerCase() === "joebloggs@gmail.com";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-400">
      {/* 🔹 Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md ">
        <div className="px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left → UserHeading */}
          <div className="w-full md:w-auto">
            <UserHeading />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <Info />

            <Toggle
              pressed={isLadderView}
              onPressedChange={() => setIsLadderView(!isLadderView)}
              aria-label="Ladder View"
              className="data-[state=on]:bg-red-600 data-[state=on]:text-white
               data-[state=off]:bg-green-600 data-[state=off]:text-white
               border-none px-3 py-6"
            >
              {isLadderView ? (
                <div className="flex flex-col items-center justify-center">
                  <span className="hidden md:inline">Ladder ON/OFF</span>
                  <ToggleRight className="w-16 h-16 " />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="hidden md:inline">Ladder ON/OFF</span>
                  <ToggleLeft className="h-12 w-12" />
                  
                </div>
              )}
            </Toggle>

            <div className="md:w-auto flex justify-end">
              <UserDetails />
            </div>
          </div>
        </div>
      </header>

      {/* InfoBar */}
      <div className="px-4 py-2">
        <InfoBar />
      </div>

      {/* 🔹 Main Content */}
      <main className="flex items-start mx-2 sm:mx-2">
        {/* ✅ Players List */}
        <div className="flex-1 w-full">
          {/* Desktop/Laptop → always show */}
          <div className="hidden lg:block">
            {ladderId ? (
              <PlayersList ladderId={ladderId} />
            ) : (
              <p className="text-red-600 font-medium">
                No Ladder ID found. Please contact admin.
              </p>
            )}
          </div>

          {/* Mobile/Tablet → only if LadderView ON */}
          {isLadderView && (
            <div className="block lg:hidden">
              {ladderId ? (
                <PlayersList ladderId={ladderId} />
              ) : (
                <p className="text-red-600 font-medium">
                  No Ladder ID found. Please contact admin.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ✅ Sidebar */}
        {!isLadderView && (
          <>
            {/* Laptop/Desktop Sidebar → right side */}
            <aside className="hidden lg:flex flex-col w-full max-w-[380px] xl:max-w-[550px] gap-6">
              <ContactAdmin />
              <UserRules />
              <ActivityLogUser />
            </aside>

            {/* Mobile/Tablet Sidebar → below PlayersList */}
            <aside className="flex flex-col gap-6 lg:hidden mt-4">
              <ContactAdmin />
              <UserRules />
              <ActivityLogUser />
            </aside>
          </>
        )}
      </main>

      <ToastContainer />
    </div>
  );
}

export default UserPageRedirectRouter;
