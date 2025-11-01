
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import { ArrowLeft, Check, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Checkbox } from "@/components/ui/checkbox";
// import { movePlayer } from "@/redux/slices/playerMovingSlice";
// import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
// import { fetchUserActivity } from "@/redux/slices/activitySlice";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogFooter,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// const MoveNumberInput = ({
//   onClose = () => {},
//   currentId = null,
//   currentRank = null,
//   setLoading,
//   selectedPlayer = {},
// }) => {
//   const dispatch = useDispatch();

//   const [selectedNumber, setSelectedNumber] = useState("");
//   const [isCancelled, setIsCancelled] = useState(false);
//   const [localLoading, setLocalLoading] = useState(true);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [resultType, setResultType] = useState("");
//   const [score, setScore] = useState("");

//   const scoreOptions = ["3-0", "3-1", "3-2"];
//   const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

//   const user = useSelector((state) => state?.user?.user || {});
//   const user_id = user?.id;
//   const ladder_id =
//     user?.role === "admin" ? selectedPlayer?.ladder_id : user?.ladder_id;

//   const { loading } = useSelector((state) => state?.playerMoving || {});
//   const players =
//     useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

//   const loserPlayer =
//     players.find((p) => p.rank === Number(selectedNumber)) || null;

//   useEffect(() => {
//     const timer = setTimeout(() => setLocalLoading(false), 1200);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleNumberClick = (num) => {
//     setSelectedNumber((prev) => prev + num);
//     setIsCancelled(false);
//   };

//   const handleBackspace = () => setSelectedNumber((prev) => prev.slice(0, -1));
//   const handleCancel = () => onClose();

//   const handleEnter = () => {
//     if (!user_id || !ladder_id || !currentId)
//       return toast.error("Missing user ID, ladder ID, or player ID.");

//     if (!selectedNumber || isNaN(selectedNumber))
//       return toast.error("Please enter a valid rank.");

//     if (!resultType)
//       return toast.error("Please select whether you Beat or Lost to the player.");

//     if (resultType === "beat" && Number(currentRank) <= Number(selectedNumber))
//       return setShowError(true);

//     if (resultType === "lost" && Number(currentRank) <= Number(selectedNumber))
//       return setShowError(true);

//     setShowConfirm(true);
//   };

//   const confirmMove = async () => {
//     try {
//       onClose();
//       setLoading(true);

//       const res = await dispatch(
//         movePlayer({
//           user_id,
//           move_from_user_id: currentId,
//           move_to_rank: Number(selectedNumber),
//           ladder_id,
//           match_status: resultType,
//           score
//         })
//       ).unwrap();

//       if (resultType === "beat") {
//         await dispatch(fetchLeaderboard({ ladder_id }));
//       }
//       await dispatch(fetchUserActivity({ ladder_id }));

//       toast[resultType === "beat" ? "success" : "warn"](
//         `${resultType === "beat" ? "Beat" : "Lost"} recorded successfully!`,
//         { autoClose: 1200 }
//       );

//       setSelectedNumber("");
//       setResultType("");
//     } catch (err) {
//       toast.error(err?.message || "Failed to submit result.");
//     }
//   };

//   if (localLoading) {
//     return (
//       <div className="w-full max-w-md p-6 border rounded-2xl bg-white shadow-lg space-y-6 animate-in fade-in-50">
//         <Skeleton className="h-6 w-2/3 mx-auto rounded-lg" />
//         <Skeleton className="h-12 w-full rounded-lg" />
//         <div className="grid grid-cols-3 gap-3">
//           {Array.from({ length: 9 }).map((_, i) => (
//             <Skeleton key={i} className="h-12 w-full rounded-lg" />
//           ))}
//         </div>
//         <div className="grid grid-cols-3 gap-3">
//           <div />
//           <Skeleton className="h-12 w-full rounded-lg" />
//           <div />
//         </div>
//         <div className="flex gap-3">
//           <Skeleton className="h-10 flex-1 rounded-lg" />
//           <Skeleton className="h-10 flex-1 rounded-lg" />
//           <Skeleton className="h-10 flex-1 rounded-lg" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       layout
//       className="sm:px-8 sm:py-4 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto"
//     >
//       <h3 className="mb-3 text-sm font-semibold py-2 text-gray-800">
//         Enter the rank of the player you challenged
//       </h3>

//       {/* ✅ Beat / Lost Selection */}
//       {/* <div className="flex flex-wrap items-center gap-4 mb-4">
//         <p className="text-sm font-medium text-gray-700">
//           Please Select First:
//         </p>
//         <div className="flex items-center gap-2">
//           <Checkbox
//             id="beat"
//             checked={resultType === "beat"}
//             onCheckedChange={(val) => setResultType(val ? "beat" : "")}
//           />
//           <label htmlFor="beat" className="cursor-pointer text-sm font-medium">
//             Beat
//           </label>
//         </div>
//         <div className="flex items-center gap-2">
//           <Checkbox
//             id="lost"
//             checked={resultType === "lost"}
//             onCheckedChange={(val) => setResultType(val ? "lost" : "")}
//           />
//           <label htmlFor="lost" className="cursor-pointer text-sm font-medium">
//             Lost to
//           </label>
//         </div>
//       </div> */}


//        <div className="mb-2">
//         <p className="text-sm font-medium text-black">Please Select First :</p>
//       </div>


//       {/* ✅ Beat / Lost To selection */}
//       <div className="flex items-center gap-4 flex-wrap mb-3">
//         <div className="flex items-center gap-2">
//           <Checkbox
//             id="beat"
//             checked={resultType === "beat"}
//             onCheckedChange={(val) => setResultType(val ? "beat" : "")}
//           />
//           <label
//             htmlFor="beat"
//             className="text-sm font-medium leading-none cursor-pointer"
//           >
//             Beat
//           </label>
//         </div>

//         <div className="flex items-center gap-2">
//           <Checkbox
//             id="lost"
//             checked={resultType === "lost"}
//             onCheckedChange={(val) => setResultType(val ? "lost" : "")}
//           />
//           <label
//             htmlFor="lost"
//             className="text-sm font-medium leading-none cursor-pointer"
//           >
//             Lost to
//           </label>
//         </div>

//         {/* ✅ Score options */}
//         {scoreOptions.map((s) => (
//           <div key={s} className="flex items-center gap-2">
//             <Checkbox
//               id={s}
//               checked={score === s}
//               onCheckedChange={(val) => setScore(val ? s : "")}
//             />
//             <label
//               htmlFor={s}
//               className="text-sm font-medium leading-none cursor-pointer"
//             >
//               {s}
//             </label>
//           </div>
//         ))}
//       </div>

//       <Input
//         value={selectedNumber}
//         readOnly
//         placeholder="Enter Rank"
//         className={`mb-4 text-center font-mono text-lg tracking-wide rounded-lg ${
//           isCancelled && !selectedNumber ? "line-through text-gray-400" : ""
//         }`}
//       />

//       <div className="grid grid-cols-3 gap-2 mb-4">
//         {numberButtons.map((num) => (
//           <Button
//             key={num}
//             variant="outline"
//             className="h-12 text-lg"
//             onClick={() => handleNumberClick(num)}
//           >
//             {num}
//           </Button>
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-2">
//         <Button variant="outline" onClick={handleBackspace} className="flex-1">
//           <ArrowLeft className="w-4 h-4 mr-2" /> Backspace
//         </Button>
//         <Button variant="destructive" onClick={handleCancel} className="flex-1">
//           <X className="w-4 h-4 mr-2" /> Cancel
//         </Button>
//         <Button
//           onClick={handleEnter}
//           disabled={loading}
//           className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
//         >
//           {loading ? "Processing..." : <><Check className="w-4 h-4 mr-2" />Post</>}
//         </Button>
//       </div>

//       {/* ✅ Confirm Dialog */}
//       {/* <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Result</AlertDialogTitle>
//             <AlertDialogDescription>
//               You selected{" "}
//               <span className="font-semibold text-purple-600">
//                 {resultType === "beat" ? "Beat" : "Lost to"}
//               </span>{" "}
//               player{" "}
//               <span className="font-semibold text-green-700">
//                 {loserPlayer?.name || "this player"}
//               </span>{" "}
//               at rank {selectedNumber}.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmMove}>Confirm</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog> */}



//         {/* ✅ Confirm Dialog */}
//       <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Result 🎉</AlertDialogTitle>
//             <AlertDialogDescription>
//   {resultType === "beat" ? (
//     <>
//       Congratulations to{" "}
//       <span className="font-semibold text-green-700">
//         {selectedPlayer?.name || "You"}
//       </span>{" "}
//       who beat{" "}
//       <span className="font-semibold text-purple-600">
//         {loserPlayer?.name || "opponent"}
//       </span>{" "}
//       {score && (
//         <>
//           by <span className="font-semibold">{score}</span>{" "}
//         </>
//       )}
//       {/* to become club ranked number{" "}
//       <span className="font-semibold">{currentRank || "?"}</span>{" "} */}
//     </>
//   ) : (
//     <>
//       Congratulations to{" "}
//       <span className="font-semibold text-green-700">
//         {loserPlayer?.name || "opponent"}
//       </span>{" "}
//       who resisted the challenge of{" "}
//       <span className="font-semibold text-purple-600">
//         {selectedPlayer?.name || "You"}
//       </span>{" "}
//       {score && (
//         <>
//           by <span className="font-semibold">{score}</span>{" "}
//         </>
//       )}
//       {/* to remain club ranked number{" "}
//       <span className="font-semibold">{currentRank || "?"}</span>{" "} */}
//     </>
//   )}
// </AlertDialogDescription>

//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-red-100 hover:bg-red-200">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmMove}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               Confirm
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/*  Error Dialog */}
//       <AlertDialog open={showError} onOpenChange={setShowError}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Not Allowed</AlertDialogTitle>
//             <AlertDialogDescription>
//               You cannot mark this result as{" "}
//               <b>{resultType === "beat" ? "Beat" : "Lost"}</b>. <br />
//               A lower-ranked player cannot claim result against a higher-ranked player.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={() => setShowError(false)}>
//               Okay
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </motion.div>
//   );
// };

// export default MoveNumberInput;



















"use client"

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { movePlayer } from "@/redux/slices/playerMovingSlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
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
  onClose = () => { },
  currentId = null,
  currentRank = null,
  setLoading,
  selectedPlayer = {},
}) => {
  const dispatch = useDispatch();

  const [selectedNumber, setSelectedNumber] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resultType, setResultType] = useState("");
  const [score, setScore] = useState("");

  const user = useSelector((state) => state?.user?.user || {});

  const ladder_id = user?.role === "admin" ? selectedPlayer?.ladder_id : user?.ladder_id;

  const ladderDetails = useSelector(
    (state) => state.player?.players?.[ladder_id]?.ladderDetails
  ) || {};

  const ladderType = ladderDetails?.type || "winlose";

  const scoreOptions =
    ladderType === "best3"
      ? ["2-0", "2-1"]
      : ladderType === "best5"
        ? ["3-0", "3-1", "3-2"]
        : [];

  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const user_id = user?.id;

  const { loading } = useSelector((state) => state?.playerMoving || {});
  const players =
    useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

  const loserPlayer =
    players.find((p) => p.rank === Number(selectedNumber)) || null;

  useEffect(() => {
    const timer = setTimeout(() => setLocalLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (num) => {
    setSelectedNumber((prev) => prev + num);
    setIsCancelled(false);
  };

  const handleBackspace = () => setSelectedNumber((prev) => prev.slice(0, -1));
  const handleCancel = () => onClose();

  // const handleEnter = () => {
  //   if (!user_id || !ladder_id || !currentId)
  //     return toast.error("Missing user ID, ladder ID, or player ID.");

  //   if (!selectedNumber || isNaN(selectedNumber))
  //     return toast.error("Please enter a valid rank.");

  //   if (!resultType)
  //     return toast.error("Please select whether you Beat or Lost to the player.");

  //   if (resultType === "beat" && Number(currentRank) <= Number(selectedNumber))
  //     return setShowError(true);

  //   if (resultType === "lost" && Number(currentRank) <= Number(selectedNumber))
  //     return setShowError(true);

  //   setShowConfirm(true);
  // };

  // const confirmMove = async () => {
  //   try {
  //     onClose();
  //     setLoading(true);

  //     const res = await dispatch(
  //       movePlayer({
  //         user_id,
  //         move_from_user_id: currentId,
  //         move_to_rank: Number(selectedNumber),
  //         ladder_id,
  //         match_status: resultType,
  //         score
  //       })
  //     ).unwrap();

  //     if (resultType === "beat") {
  //       await dispatch(fetchLeaderboard({ ladder_id }));
  //     }
  //     await dispatch(fetchUserActivity({ ladder_id }));

  //     toast[resultType === "beat" ? "success" : "warn"](
  //       `${resultType === "beat" ? "Beat" : "Lost"} recorded successfully!`,
  //       { autoClose: 1200 }
  //     );

  //     setSelectedNumber("");
  //     setResultType("");
  //   } catch (err) {
  //     toast.error(err?.message || "Failed to submit result.");
  //   }
  // };



  const handleEnter = () => {
    if (!user_id || !ladder_id || !currentId) {
      toast.error("Missing user ID, ladder ID, or current player ID.");
      return;
    }
    if (!selectedNumber || isNaN(selectedNumber))
      return toast.error("Please enter a valid rank.");

    if (!resultType)
      return toast.error("Please select whether you Beat or Lost to the player.");

    if (resultType === "beat" && Number(currentRank) <= Number(selectedNumber))
      return setShowError(true);

    if (resultType === "lost" && Number(currentRank) <= Number(selectedNumber))
      return setShowError(true);
 
    if ((ladderType === "best3" || ladderType === "best5") && !score) {
      toast.error("Please select the match score.");
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
      <div className="w-full max-w-md p-6 border rounded-2xl bg-white shadow-lg space-y-6 animate-in fade-in-50">
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

  return (
    <motion.div
      layout
      className="sm:px-8 sm:py-4 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto"
    >
      <h3 className="mb-3 text-sm font-semibold py-2 text-gray-800">
        Enter the rank of the player you challenged
      </h3>

      {/* ✅ Beat / Lost Selection */}
      <div className="mb-2">
        <p className="text-sm font-medium text-black">Please Select First :</p>
      </div>


      {/* ✅ Beat / Lost To selection */}
      <div className="flex items-center gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="beat"
            checked={resultType === "beat"}
            onCheckedChange={(val) => setResultType(val ? "beat" : "")}
          />
          <label
            htmlFor="beat"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Beat
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="lost"
            checked={resultType === "lost"}
            onCheckedChange={(val) => setResultType(val ? "lost" : "")}
          />
          <label
            htmlFor="lost"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Lost to
          </label>
        </div>
      </div>

      {/* ✅ Score options */}
      {/* {scoreOptions.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <Checkbox
              id={s}
              checked={score === s}
              onCheckedChange={(val) => setScore(val ? s : "")}
            />
            <label
              htmlFor={s}
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {s}
            </label>
          </div>
        ))} */}


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
        className={`mb-4 text-center font-mono text-lg tracking-wide rounded-lg ${isCancelled && !selectedNumber ? "line-through text-gray-400" : ""
          }`}
      />

      <div className="grid grid-cols-3 gap-2 mb-4">
        {numberButtons.map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-12 text-lg"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleBackspace} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Backspace
        </Button>
        <Button variant="destructive" onClick={handleCancel} className="flex-1">
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button
          onClick={handleEnter}
          disabled={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? "Processing..." : <><Check className="w-4 h-4 mr-2" />Post</>}
        </Button>
      </div>

      {/* ✅ Confirm Dialog */}
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

      {/*  Error Dialog */}
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Not Allowed</AlertDialogTitle>
            <AlertDialogDescription>
               Higher Ranked Players May not Post Results against Lower-ranked Players 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowError(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MoveNumberInput;