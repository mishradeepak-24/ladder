

  


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

const EditPlayerDetails = ({ initialData = {}, onClose = () => {} }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
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

  useEffect(() => {
    if (initialData && user) {
      setForm({
        id: initialData?.id || "",
        user_id: user?.id?.toString() || "",
        name: initialData?.name || "",
        phone: initialData?.phone || "",
      });
    }
  }, [initialData, user]);

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
    dispatch(editUserDetails({ user_id: form.user_id, formData }));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setShowSkeleton(false);
        // toast.success(successMessage);
        dispatch(fetchLeaderboard({ ladder_id: user?.ladder_id }));
        dispatch(resetEditPlayerState());
        onClose();
      }, 3000); // ⏳ Show skeleton for 3s
    }

    if (error) {
      setShowSkeleton(false);
      toast.error(error);
      dispatch(resetEditPlayerState());
    }
  }, [successMessage, error, dispatch, user?.ladder_id, onClose]);

  return (
    <Card className="max-w-md mx-auto mt-6 shadow-xl rounded-2xl bg-white">
      <CardContent className="p-6 space-y-4">
        {/* <h2 className="text-xl font-semibold text-center ">
          Edit Player
        </h2> */}

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
              <Label htmlFor="name" className="text-blue-700 font-semibold py-2 text-lg">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-blue-700 font-semibold py-2 text-lg">Phone Number</Label>
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
              className="w-full rounded-none cursor-pointer bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default EditPlayerDetails;
