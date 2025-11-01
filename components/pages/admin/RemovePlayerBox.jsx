
// ========================

'use client';

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { fetchUserActivity } from "@/redux/slices/activitySlice";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const RemovePlayerBox = ({ onClose }) => { // ✅ receive onClose from parent
  const [rank, setRank] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const ladder_id = searchParams.get("ladder_id");
  const APPKEY =
    "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

  const handleRemove = async () => {
    if (!ladder_id || rank <= 0) {
      toast.warning("Please enter valid rank and ladder_id.", {autoClose: 2000});
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Close dialog immediately
      onClose?.();

      await axios.post(
        `https://ne-games.com/leaderBoard/api/user/removeUser`,
        {},
        {
          params: { ladder_id, rank },
          headers: { APPKEY },
        }
      );

 

      // ✅ Refresh leaderboard and activity log immediately
      dispatch(fetchLeaderboard({ ladder_id }));
      dispatch(fetchUserActivity({ ladder_id }));

      

    } catch (error) {
      console.error("Error removing player:", error?.response?.data || error);
      toast.error("Failed to remove player.");
    } 
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
      className="border border-gray-300 py-4 px-4 rounded-md bg-white w-full text-center shadow-sm"
    >
      <p className="text-start font-semibold mb-2 text-black">
        Remove player ranked number
      </p>

      <Input
        type="number"
        value={rank}
        onChange={(e) => setRank(Number(e.target.value))}
        className="mb-4"
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="text-sm bg-blue-600 py-1 cursor-pointer text-white px-12">
            Yes
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              player from the ladder.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Removing...</span>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default RemovePlayerBox;
