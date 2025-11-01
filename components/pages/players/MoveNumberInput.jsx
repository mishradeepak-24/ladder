



















"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { movePlayer } from "@/redux/slices/playerMovingSlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { fetchUserActivity } from "@/redux/slices/activitySlice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const MoveNumberInput = ({
  onClose = () => {},
  currentId = null,
  currentRank = null,
  setLoading,
  selectedPlayer = {},
 
}) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");
  console.log("deepak",ladder_id)

  const [selectedNumber, setSelectedNumber] = useState("");
  const [localLoading, setLocalLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultType, setResultType] = useState(""); // Beat / Lost
  const [score, setScore] = useState(""); // Best 3 / 5 scores
 

  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  // User info
  const user = useSelector((state) => state?.user?.user || {});
  const user_id = user?.id;

  const players =
    useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];
  const ladderDetails =
    useSelector((state) => state.player?.players?.[ladder_id]?.ladderDetails) || {};
  const ladderType = ladderDetails?.type || "winlose";

  const loserPlayer =
    players.find((p) => p.rank === Number(selectedNumber)) || null;

  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (num) => setSelectedNumber((prev) => prev + num);
  const handleBackspace = () => setSelectedNumber((prev) => prev.slice(0, -1));
  const handleCancel = () => onClose();

  // const handleEnter = () => {
  //   if (!user_id || !ladder_id || !currentId) {
  //     toast.error("Missing user ID, ladder ID, or current player ID.");
  //     return;
  //   }
  //   if (!selectedNumber || isNaN(selectedNumber)) {
  //     toast.error("Please enter a valid numeric rank.");
  //     return;
  //   }
  //   if (!resultType) {
  //     toast.error("Please select Beat or Lost to.");
  //     return;
  //   }
  //   if ((ladderType === "best3" || ladderType === "best5") && !score) {
  //     toast.error("Please select the match score.");
  //     return;
  //   }
  //   setShowConfirm(true);
  // };



  const handleEnter = () => {
  if (!user_id || !ladder_id || !currentId) {
    toast.error("Missing user ID, ladder ID, or current player ID.");
    return;
  }
  if (!selectedNumber || isNaN(selectedNumber)) {
    toast.error("Please enter a valid numeric rank.");
    return;
  }
  if (!resultType) {
    toast.error("Please select Beat or Lost to.");
    return;
  }
  if ((ladderType === "best3" || ladderType === "best5") && !score) {
    toast.error("Please select the match score.");
    return;
  }

  const opponentRank = Number(selectedNumber);
  const currentRankNum = Number(currentRank);

  // 🧠 RULE: smaller number = higher rank
  // A higher-ranked player cannot challenge or lose to a lower-ranked one
  if (currentRankNum < opponentRank) {
    toast.error("Higher-ranked players cannot challenge or lose to lower-ranked players.");
    return;
  }

  setShowConfirm(true);
};



  const confirmMove = async () => {
    try {
      onClose();
      setLoading(true);

      const payload = {
        user_id,
        move_from_user_id: currentId,
        move_to_rank: Number(selectedNumber),
        ladder_id,
        match_status: resultType,
      };

      if (ladderType === "best3" || ladderType === "best5") payload.score = score;

      await dispatch(movePlayer(payload)).unwrap();
      await dispatch(fetchLeaderboard({ ladder_id }));
      await dispatch(fetchUserActivity({ ladder_id }));

      toast.success(
        ladderType === "winlose"
          ? resultType === "beat"
            ? "Beat success!"
            : "Lost success!"
          : "Result submitted successfully!",
        { autoClose: 1000 }
      );

      setSelectedNumber("");
      setResultType("");
      setScore("");
    } catch (err) {
      toast.error(err?.message || "Failed to submit result.");
    }
  };

  if (localLoading) {
    return (
      <div className="w-full max-w-md p-6 border rounded-xl bg-white dark:bg-gray-900 shadow-lg space-y-6 animate-in fade-in-50">
        <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div />
          <Skeleton className="h-12 w-full rounded-lg" />
          <div />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    );
  }

  // Score options for best3 / best5
  const scoreOptions = ladderType === "best3" ? ["2-0", "2-1"] : ["3-0", "3-1", "3-2"];

  return (
    <motion.div layout className="sm:px-8 sm:py-4 overflow-hidden">
      <h3 className="mb-3">Enter the rank of the player you challenged</h3>

      <div className="mb-2">
        <p className="text-sm font-medium text-black">Please Select First :</p>
      </div>

      {/* Beat / Lost selection */}
      <div className="flex items-center gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="beat"
            checked={resultType === "beat"}
            onCheckedChange={(val) => setResultType(val ? "beat" : "")}
          />
          <label htmlFor="beat" className="text-sm font-medium cursor-pointer">
            Beat
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="lost"
            checked={resultType === "lost"}
            onCheckedChange={(val) => setResultType(val ? "lost" : "")}
          />
          <label htmlFor="lost" className="text-sm font-medium cursor-pointer">
            Lost to
          </label>
        </div>
      </div>

      {/* Score selection for Best 3 / Best 5 */}
      {(ladderType === "best3" || ladderType === "best5") && (
        <div className="flex items-center gap-4 flex-wrap mb-3">
          {scoreOptions.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox
                id={s}
                checked={score === s}
                onCheckedChange={(val) => setScore(val ? s : "")}
              />
              <label htmlFor={s} className="text-sm font-medium cursor-pointer">
                {s}
              </label>
            </div>
          ))}
        </div>
      )}

      <Input
        value={selectedNumber}
        readOnly
        placeholder="Enter Rank"
        className="mb-4 text-center font-mono w-80"
      />

      <div className="grid grid-cols-3 gap-1 mb-4 w-80">
        {numberButtons.map((num) => (
          <Button key={num} variant="outline" onClick={() => handleNumberClick(num)}>
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-1 w-80">
        <Button variant="outline" onClick={handleBackspace}>
          <ArrowLeft /> Backspace
        </Button>
        <Button variant="destructive" onClick={handleCancel} className="cursor-pointer">
          <X className="w-4 h-4" /> Cancel
        </Button>
        <Button
          onClick={handleEnter}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          Post Result
        </Button>
      </div>

      {/* Confirm Dialog */}
         <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Result 🎉</AlertDialogTitle>
      <AlertDialogDescription>
        {resultType === "beat" ? (
          <>
            Congratulations to{" "}
            <span className="font-semibold text-green-700">
              {selectedPlayer?.name || "You"}
              {/* {selectedPlayer?.name ? selectedPlayer.name : "You"} */}
            </span>{" "}
            who beat{" "}
            <span className="font-semibold text-purple-600">
              {loserPlayer?.name || "opponent"}
            </span>{" "}
            {score && (
              <>
                by <span className="font-semibold">{score}</span>{" "}
              </>
            )}
            {/* to become club ranked number{" "}
            <span className="font-semibold">{currentRank || "?"}</span>{" "} */}
          </>
        ) : (
          <>
            Congratulations to{" "}
            <span className="font-semibold text-green-700">
              {loserPlayer?.name || "opponent"}
            </span>{" "}
            who resisted the challenge of{" "}
            <span className="font-semibold text-purple-600">
              {selectedPlayer?.name || "You"}
            </span>{" "}
            {score && (
              <>
                by <span className="font-semibold">{score}</span>{" "}
              </>
            )}
            
          </>
        )}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="bg-red-100 hover:bg-red-200">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={confirmMove}
        className="bg-green-600 hover:bg-green-700"
      >
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
          </AlertDialog>


    </motion.div>
  );
};

export default MoveNumberInput;