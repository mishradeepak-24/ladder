
"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { uploadLadderLogo } from "@/redux/slices/leaderboardSlice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const UserHeading = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [alertOpen, setAlertOpen] = React.useState(false);

  const searchParams = useSearchParams();
  const ladderIdFromUrl = searchParams.get("ladder_id");

  const user = useSelector((state) => state.user?.user);
  const playersState = useSelector((state) => state || {});

  const ladderId = ladderIdFromUrl || user?.ladder_id;
  const ladderDetails =
    playersState?.player?.players[ladderId]?.ladderDetails;

  const logo = ladderDetails?.logo;
  const name = ladderDetails?.name || "Adel Ranketball Ladders";

  const handleLogoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file && ladderId) {
      try {
        await dispatch(uploadLadderLogo({ file, ladder_id: ladderId })).unwrap();
        setAlertOpen(true);
      } catch (error) {
        console.error("Logo upload failed:", error);
        setAlertOpen(true);
      }
    }
  };

  const imagePath =
    logo && logo !== "null"
      ? logo?.startsWith("http")
        ? logo
        : `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${logo}`
      : "/game.png";

  return (
    <div className="w-full">
      <div className="">
        {/* Hidden file input */}
        {user?.user_type === "admin" && (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            style={{ display: "none" }}
          />
        )}

      <div className="flex justify-between items-center sm:gap-2 md:gap-2 gap-0">
            {/* Logo */}
        <div
          onClick={user?.user_type === "admin" ? handleLogoClick : undefined}
          className={`cursor-pointer ${
            user?.user_type !== "admin" && "pointer-events-none"
          }`}
        >
          <Image
            src={imagePath}
            alt="Ladder Logo"
            width={100}
            height={100}
            className="rounded-full border shadow-md object-cover 
                       w-20 h-16 sm:w-24 sm:h-28 md:w-28 md:h-20"
          />
        </div>

        {/* Title + Subtitle */}
        <div className="w-full flex flex-col items-center md:items-start">
          <h1
            className="uppercase font-bold pb-1
                       text-lg sm:text-2xl md:text-4xl lg:text-4xl 
                       break-words whitespace-normal text-center md:text-left"
          >
            {name}
          </h1>
          {/* <p
            className="mt-1 text-xs sm:text-sm md:text-base lg:text-lg 
                        font-semibold leading-snug 
                       text-center md:text-left !break-words !whitespace-normal"
          >
            Tap on your name to move, edit details, update status or upload avatar ★★★
          </p> */}
        </div>
      </div>
        
      </div>

      {/* Success Alert */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logo Uploaded Successfully!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setAlertOpen(false)}>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserHeading;







