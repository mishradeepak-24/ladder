
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { movePlayer1 } from "@/redux/slices/playerMovingSlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const MovePlayerBox = ({ onCancel }) => {
  const [fromRank, setFromRank] = useState("");
  const [toRank, setToRank] = useState("");
  const [activeInput, setActiveInput] = useState("from");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.playerMoving || {});
  const user = useSelector((state) => state.user?.user || {});
  const user_id = user?.user_id;
  // const ladder_id = user?.ladder_id;

  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");

  const handleDigit = (digit) => {
    if (activeInput === "from") setFromRank((prev) => prev + digit);
    else setToRank((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (activeInput === "from") setFromRank((prev) => prev.slice(0, -1));
    else setToRank((prev) => prev.slice(0, -1));
  };

  const handleMove = async () => {
    if (!fromRank || !toRank) {
      toast.error("Both ranks are required");
      return;
    }

    try {
      const resultAction = await dispatch(
        movePlayer1({
          user_id,
          move_from_user_id: fromRank,
          move_to_rank: toRank,
          move_from_rank: fromRank,
          ladder_id,
        })
      );

      if (movePlayer1.fulfilled.match(resultAction)) {

        // ✅ Immediately fetch updated leaderboard
        dispatch(fetchLeaderboard({ ladder_id }));

          // toast.success("Move Successful ");

        // ✅ Close modal & clear inputs
        setFromRank("");
        setToRank("");
        onCancel();
      } else {
        toast.error(resultAction.payload || "Move failed ");
      }
    } catch (err) {
      toast.error("Something went wrong ");
    }
  };

  return (
    <div className="w-full bg-white overflow-auto">
      <h2 className="text-center font-semibold mb-4 text-gray-700 text-base sm:text-lg">
        Enter ranks for the move
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          readOnly
          value={fromRank}
          placeholder="From Rank"
          onFocus={() => setActiveInput("from")}
          className={`flex-1 min-w-0 border rounded-md text-center py-2 text-sm sm:text-base focus:outline-none ${
            activeInput === "from" ? "border-blue-500" : "border-gray-300"
          }`}
        />
        <input
          type="text"
          readOnly
          value={toRank}
          placeholder="To Rank"
          onFocus={() => setActiveInput("to")}
          className={`flex-1 min-w-0 border rounded-md text-center py-2 text-sm sm:text-base focus:outline-none ${
            activeInput === "to" ? "border-blue-500" : "border-gray-300"
          }`}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            className="py-3 sm:py-4 bg-gray-100 rounded-md text-base sm:text-lg font-medium hover:bg-gray-200 transition w-full"
            onClick={() => handleDigit(num.toString())}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleBackspace}
          className="w-full sm:flex-1 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition text-sm sm:text-base"
        >
          ⬅ Backspace
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm sm:text-base"
        >
          ✖ Cancel
        </button>
        <button
          onClick={handleMove}
          disabled={loading}
          className="w-full sm:flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          {loading ? "Moving..." : "✔ Move"}
        </button>
      </div>
    </div>
  );
};

export default MovePlayerBox;
