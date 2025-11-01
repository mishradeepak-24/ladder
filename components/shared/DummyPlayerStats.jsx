"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerResult } from "@/redux/slices/PlayerResultSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// ✅ Normalize type
function normalizeMatchType(raw) {
  if (!raw) return "best of 3";
  const str = String(raw).toLowerCase().trim();
  const compact = str.replace(/[\s_-]/g, "");
  if (
    str.includes("5") ||
    compact.includes("bo5") ||
    compact.includes("bestof5") ||
    compact.includes("bestoffive")
  ) {
    return "best of 5";
  }
  return "best of 3";
}

export default function DummyPlayerStats({ladderId}) {
 

  const typeHere = useSelector((state)=> state.player?.players[ladderId]?.ladderDetails?.type)

  
  const type = typeHere || "";


  const userId = useSelector((state) => state.user?.user?.id);
  

  const matchType = useMemo(() => normalizeMatchType(type), [type]);

  if (!typeHere) {
    return (
      <div className="text-center text-gray-500 mt-6">
        Loading ladder details...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Match Format:{" "}
          <span className="text-blue-600 capitalize">{matchType}</span>
        </h2>
      </div>

      <PlayerStatsUser
        userId={userId}
        ladderId={ladderId}
        matchType={matchType}
      />
    </div>
  );
}

function PlayerStatsUser({ userId, ladderId, matchType }) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.playerResult);

  useEffect(() => {
    if (userId && ladderId) {
      dispatch(fetchPlayerResult({ user_id: userId, ladder_id: ladderId }));
    }
  }, [userId, ladderId, dispatch]);

  if (loading) {
    return (
      <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Player Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-full sm:max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const playerData = data?.result;
  const winRank = data?.win_rank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center"
    >
      <div className="w-full sm:w-full lg:max-w-md sm:max-w-md md:max-w-md overflow-auto">
        {/* Header and Dialog */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3">
          {/* <h1 className="text-base sm:text-lg font-semibold">
            Player Stats • {matchType}
          </h1> */}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                Stats Explained
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogDescription className="space-y-2 text-sm sm:text-base">
                  <div className="text-black">
                    <DialogTitle className="text-lg sm:text-2xl font-semibold py-2 mb-4 text-blue-950 text-center border-b">
                      Your score points on this basis
                    </DialogTitle>

                    <DialogDescription className="space-y-2 text-sm sm:text-base text-black">
                      {matchType === "best of 3" ? (
                        <>
                          <span>(i) WIN v Higher-section: +8</span> <br />
                          <span>(ii) WIN v Same section: +4</span> <br />
                          <span>(iii) WIN v Lower section: +2</span> <br />
                          <span>(iv) LOSS v Higher section: -4</span> <br />
                          <span>(-2 if 2-1)</span><br />
                          <span>(v) LOSS v Same section: -6</span> <br />
                          <span>(-4 if 2-1)</span><br />
                          <span className="font-semibold text-black">(vi) LOSS v Lower section: -10</span><br />
                          <span>(-8 if 2-1)</span><br />
                        </>
                      ) : matchType === "best of 5" ? (
                        <>
                          <span>(i) WIN v Higher-section: +8</span> <br />
                          <span>(ii) WIN v Same section: +4</span> <br />
                          <span>(iii) WIN v Lower section: +2</span> <br />
                          <span>(iv) LOSS v Higher section: -4</span> <br />
                          <span>(-2 if 3-1) (-0 if 3-2)</span><br />
                          <span>(v) LOSS v Same section: -6</span> <br />
                          <span>(-4 if 3-1) (-2 if 3-2)</span><br />
                          <span className="font-semibold text-black">(vi) LOSS v Lower section: -10</span><br />
                          <span>(-8 if 3-1) (-6 if 3-2)</span><br />
                        </>
                      ) : (
                        <span>No stats rules available for this match type.</span>
                      )}
                    </DialogDescription>
                    <br/>
                    <br/>

                           <p className="sm:text-start text-center font-semibold text-sm  ">
                      Your points are totalled and divided by the total number
                      of games you played to give you your “average points per
                      game”
                      <br />
                      <span className="text-sm">
                        This helps to balance out points from players who play a
                        lot and those who don’t
                      </span>
                    </p>
                    <br />
                    <p className="text-red-600 italic flex gap-2 items-center">
                      Your “average points per match” is
                      your Playing Performance
                    </p>
                    <br />
                    <p className="underline text-center">
                      Your “Playing Performance” is then ranked
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>


      </div>
    </motion.div>
  );
}