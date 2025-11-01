// ======================== ==> 20-08-2025

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddPlayer({ onClose }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");

  const ladderIdFromRedux = useSelector(
    (state) => state.leaderboard?.selectedLadderId
  );

  // const ladder_id = ladderIdFromUrl || ladderIdFromRedux;

  const [profileImage, setProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const APPKEY =
    "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !ladder_id) {
      setWelcomeMsg("Please fill all required fields including ladder ID.");
      setShowDialog(true);
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("ladder_id", ladder_id);
    if (rank) formData.append("rank", rank);
    if (phone) formData.append("phone", phone);
    if (profileFile) formData.append("file", profileFile);

    try {
      const response = await axios.post(
        "https://ne-games.com/leaderBoard/api/user/addbyadmin",
        formData,
        {
          headers: { APPKEY },
        }
      );

      if (response.data.status === 200) {
        setWelcomeMsg(`Welcome ${name}! ${response.data.success_message}`);
        setShowDialog(true);

        // Refresh leaderboard
        setLoading(true);
        await dispatch(fetchLeaderboard({ ladder_id }));
        setLoading(false);
      } else {
        setWelcomeMsg("Something went wrong.");
        setShowDialog(true);
      }
    } catch (error) {
      setWelcomeMsg(
        "Error: " + (error.response?.data?.message || error.message)
      );
      setShowDialog(true);
    } finally {
      setSubmitting(false);
    }
  };

  return loading ? (
    <div className="space-y-4 p-4 w-[300px]">
      <Skeleton className="h-24 w-full rounded-md" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-[40%]" />
    </div>
  ) : (
    <>
      <div className="max-w-sm border p-4 rounded-md shadow-md space-y-4 bg-white">
        {/* Profile Upload */}
        <div className="relative h-24 bg-green-200 rounded-md flex items-center justify-center">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <Image
              src="/logo.jpg"
              alt="Default Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <span className="text-red-500">*</span> Name:
          </Label>
          <Input
            required
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Label className="flex items-center gap-1">
            <span className="text-red-500">*</span> Email:
          </Label>
          <Input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label className="flex items-center gap-1">
            Phone: (Optional, can be added later)
          </Label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <span className="text-red-500">*</span> Place Number in the ladder
          <Input
            type="number"
            placeholder="Enter number"
            required
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 rounded-none font-semibold hover:bg-blue-700"
          >
            {submitting ? "Adding..." : "Add Player"}
          </Button>
          <div className="flex mt-2 gap-1">
            <span className="text-red-500 text-3xl"> *</span> = Mandatory
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Player Added</DialogTitle>
          </DialogHeader>
          <p className="font-semibold text-md text-center py-2">{welcomeMsg}</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowDialog(false);
                onClose(); // close modal after confirmation
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

