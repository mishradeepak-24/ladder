

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import PlayersLists1 from "./PlayersLists1";
import ActivityLog from "./ActivityList";
import PlayerHeading from "./PlayerHeading";
import LeaderBoard from "./LeaderBoard";
import UserDetails from "@/components/shared/UserDetails";
import { fetchUserActivity } from "@/redux/slices/activitySlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import LadderRulesCard from "./LadderRulesCard";
import AdminButton from "../admin/AdminButton";
import Info from "@/components/shared/Info";
import AdminEditPhone from "@/components/shared/AdminEditPhone";
import { useSearchParams } from "next/navigation";
import { loginPage } from "@/helper/RouteName";

export const PlayerLists = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ladderId = searchParams.get("ladder_id");
  const shouldPrint = searchParams.get("print");

    const user = useSelector((state)=> state.user?.user) // assuming user data is here

  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const globalLoading = loadingPlayers || loadingActivity;

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push(loginPage);
      return;
    }
  }, [user, router]);

  // 🔹 Trigger print if query param is present
  useEffect(() => {
    if (shouldPrint === "true") {
      const timer = setTimeout(() => {
        window.print();

        // Remove print param after printing
        const params = new URLSearchParams(window.location.search);
        params.delete("print");
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        router.replace(newUrl);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldPrint, router]);

  // 🔹 Fetch Ladder + Activity
  useEffect(() => {
    const fetchData = async () => {
      if (!ladderId) return;

      setLoadingPlayers(true);
      await dispatch(fetchLeaderboard({ ladder_id: ladderId }));
      setLoadingPlayers(false);

      setLoadingActivity(true);
      await dispatch(fetchUserActivity({ ladder_id: ladderId }));
      setLoadingActivity(false);
    };

    fetchData();
  }, [dispatch, ladderId]);

  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const hasSeenInfo = localStorage.getItem("adminInfoShown");
    if (!hasSeenInfo) {
      setShowInfo(true);
      localStorage.setItem("adminInfoShown", "true");
    }
  }, []);

  const handlePrintClick = () => {
    window.print();
  };

  // 🔹 Don't render anything if redirecting
  if (!user) {
    return null; // router.push will handle navigation
  }

  return (
    <div className="bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-400 min-h-screen">
      {/* Sticky Header */}
      <div className="sm:flex justify-between top-0 z-50 backdrop-blur-md px-4 py-4">
        <div className="">
          <div className="flex-1 min-w-0">
            <PlayerHeading />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintClick}
            className="px-8 py-1 border border-gray-400 rounded-sm cursor-pointer hover:bg-gray-50 text-lg transition"
          >
            Print
          </button>
          <UserDetails />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-4 lg:hidden">
            <AdminEditPhone />
            <AdminButton />
            <LadderRulesCard />
          </div>
          <div>
            <PlayersLists1 />
          </div>
          <div className="lg:hidden">
            <ActivityLog ladderId={ladderId} />
          </div>
        </div>

        <div className="hidden lg:flex lg:w-[600px] flex-col gap-4 flex-shrink-0">
          <AdminEditPhone />
          <AdminButton />
          <LadderRulesCard />
          <ActivityLog ladderId={ladderId} />
        </div>
      </div>

      <div className="px-4 mt-6 w-full overflow-x-auto">
        <LeaderBoard />
      </div>

      {globalLoading && (
        <div className="px-4 py-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid" />
        </div>
      )}
    </div>
  );
};
