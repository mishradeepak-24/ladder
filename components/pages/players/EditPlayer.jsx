

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { movePlayer, clearMoveResult } from "@/redux/slices/playerMovingSlice";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import ChallengeNumberInput from "./ChallengeNumberInput";
import MoveNumberInput from "./MoveNumberInput";
import EditPlayerDetails from "./EditPlayerDetails";
import PlayerImage from "./PlayerImage";
import StatusPlayer from "./StatusPlayer";
import PlayerStatsBox from "./PlayerStatsBox";
import { ChevronDown } from "lucide-react";

// import Chat from "@/components/pages/chat/Chat"


export const EditPlayer = ({
  open = true,
  onClose = () => { },
  currentId = null, // ✅ always pass player.id here
  setLoading = () => { },
}) => {
  const dispatch = useDispatch();

  const playerId = currentId ? Number(currentId) : null;

  const user = useSelector((state) => state?.user?.user || {});
  const ladder_id = user?.ladder_id;

  const players =
    useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];


  const selectedPlayer =
    players.length > 0 && playerId
      ? players.find((p) => Number(p.id) === playerId)
      : null;

  useEffect(() => {
    if (open && ladder_id) {
      dispatch(fetchLeaderboard({ ladder_id }));
    }
  }, [dispatch, ladder_id, open]);

  const { loading, error: moveError, result } =
    useSelector((state) => state?.playerMoving) || {};

  useEffect(() => {
    if (result?.success_message) {
      dispatch(clearMoveResult());
    }
    if (moveError) {
      toast.error(moveError);
      dispatch(clearMoveResult());
    }
  }, [result, moveError, dispatch]);

  const [selectedTab, setSelectedTab] = useState("result");

  const tabs = [
    { value: "result", label: "Result" },
    { value: "status", label: "Status" },
    { value: "edit", label: "Edit" },
    { value: "load", label: "Upload" },
    { value: "stats", label: "Stats" },
    { value: "challenge", label: "Challenge" },
    // { value: "chat", label: "Chat" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl">
        <DialogTitle>
          <VisuallyHidden>Edit Player Modal</VisuallyHidden>
        </DialogTitle>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

            {/* ✅ Desktop / Tablet Tabs */}
            <div className="">
              <TabsList className="lg:w-full sm:w-full md:w-full w-80 flex items-center justify-center bg-white ">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all text-sm sm:text-base"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* ✅ Tab Content */}
            <TabsContent value="result">
              <MoveNumberInput
                onClose={onClose}
                currentId={playerId}
                currentRank={selectedPlayer?.rank}
                setLoading={setLoading}
                selectedPlayer={selectedPlayer}
              />
            </TabsContent>

            <TabsContent value="challenge">
              <ChallengeNumberInput
                selectedPlayer={selectedPlayer}
                challengedPlayer={""}
                setChallengedPlayer={() => { }}
                userId={user?.id}
              />
            </TabsContent>

            <TabsContent value="edit">
              <EditPlayerDetails userId={playerId} onClose={onClose} />
            </TabsContent>

            <TabsContent value="load">
              <PlayerImage userId={playerId} onClose={onClose} />
            </TabsContent>

            <TabsContent value="status">
              <StatusPlayer playerId={playerId} onClose={onClose} />
            </TabsContent>

            <TabsContent value="stats">
              <PlayerStatsBox userId={playerId} ladderId={ladder_id} />
            </TabsContent>

{/* 
            <TabsContent value="chat">
              {selectedPlayer ? (
                <Chat
                  senderId={user?.id}
                  receiverId={selectedPlayer?.id}
                />
              ) : (
                <p className="text-sm text-muted">Select a player to start chat.</p>
              )}
            </TabsContent> */}

          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};


