


"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserDetails,
  resetEditPlayerState,
} from "@/redux/slices/editdetailSlice";
import { fetchLeaderboard } from "@/redux/slices/leaderboardSlice";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

const EditPlayerDetails = ({ userId, onClose = () => {} }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");



  const players =
    useSelector((state) => state.player?.players?.[ladder_id]?.data) || [];

  const numericUserId = Number(userId);

  const selectedPlayer = players.length > 0
  ? players.find((player) => Number(player.id) === numericUserId)
      : null;

  const { loading, successMessage, error } = useSelector(
    (state) => state.editdetail
  );

  const [form, setForm] = useState({
    id: "",
    user_id: "",
    name: "",
    phone: "",
  });

  const [showSkeleton, setShowSkeleton] = useState(false);

  // ✅ Prefill form safely
  useEffect(() => {
    if (selectedPlayer) {
      setForm({
        id: selectedPlayer.id || "",
        user_id:
          selectedPlayer.user_id?.toString() ||
          selectedPlayer.id?.toString() ||
          "",
        name: selectedPlayer.name || "",
        phone: selectedPlayer.phone || "",
      });
    }
  }, [selectedPlayer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.user_id || !form.id) {
      toast.error("User ID or Player ID is missing.");
      return;
    }

    const formData = {
      id: form.id,
      name: form.name,
      phone: form.phone,
    };

    setShowSkeleton(true);
    dispatch(fetchLeaderboard({ladder_id}))
    dispatch(editUserDetails({ user_id: form.user_id, formData }));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setShowSkeleton(false);
        dispatch(fetchLeaderboard({ ladder_id }));
        dispatch(resetEditPlayerState());
        onClose();
      }, 1000);
    }

     toast.success({autoClose: 2000});

    if (error) {
      setShowSkeleton(false);
      toast.error(error);
      dispatch(resetEditPlayerState());
    }
  }, [successMessage, error, dispatch, ladder_id, onClose]);

  if (!players.length) {
    return (
      <Card className="max-w-md mx-auto mt-6 shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading players...</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedPlayer) {
    return (
      <Card className="max-w-md mx-auto mt-6 shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Could not find player with ID {numericUserId}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="py-2 space-y-4">
        {showSkeleton ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-blue-700 font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-blue-700 font-semibold">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPlayerDetails;
