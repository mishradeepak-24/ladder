"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchLadders } from "@/redux/slices/fetchLadderSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const LadderList = ({ userId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const printRef = useRef();

  const [deleteLadderId, setDeleteLadderId] = useState(null);
  const [deleteLadderName, setDeleteLadderName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // ✅ show 3 ladders per page

  const { allLadders, loading, error } = useSelector(
    (state) => state.fetchLadder
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchLadders(userId));
    }
  }, [userId, dispatch]);

  const handleEditClick = (ladderId) => {
    router.push(`/player-list?ladder_id=${ladderId}`);
  };

  const handleDelete = async (ladderId) => {
    try {
      const response = await axios.get(
        "https://ne-games.com/leaderBoard/api/user/Deleteleaderboard",
        {
          params: {
            ladder_id: ladderId,
          },
          headers: {
            APPKEY:
              "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Deleted successfully:", response.data);
      dispatch(fetchLadders(userId)); // Refresh the ladder list
    } catch (error) {
      console.error("Delete failed:", error?.response?.data || error.message);
    } finally {
      setDeleteLadderId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ Pagination calculations
  const totalPages = Math.ceil(allLadders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLadders = allLadders?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full">
      <Card className="rounded-none shadow-md w-full max-w-none print:border-none print:shadow-none">
        <CardContent className="p-6 space-y-4 w-full" ref={printRef}>
          <h2 className="text-2xl font-semibold text-gray-800 print:text-black">
            Ladders Created
          </h2>
          <Separator />

          {loading && (
            <p className="text-sm text-zinc-500">Loading ladders...</p>
          )}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
          {!loading && allLadders?.length === 0 && (
            <p className="text-sm text-zinc-500">No ladders found.</p>
          )}

          {currentLadders?.map((ladder) => (
            <div
              key={ladder.id}
              className="flex items-center justify-between border-b py-2 print:justify-start print:gap-4"
            >
              <span className="font-bold text-base text-black">
                {ladder.name}
              </span>

              <div className="flex items-center gap-4 print:hidden">
                <Button
                  variant="link"
                  className="text-blue-600 p-0 h-auto text-sm cursor-pointer"
                  onClick={() => handleEditClick(ladder.id)}
                >
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-red-600 p-0 h-auto text-sm cursor-pointer"
                      onClick={() => {
                        setDeleteLadderId(ladder.id);
                        setDeleteLadderName(ladder.name);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure delete{" "}
                        <span className="text-red-600 font-semibold">
                          {deleteLadderName} ?
                        </span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to delete the ladder called{" "}
                        <span className="text-red-600 font-semibold">
                          {deleteLadderName}
                        </span>
                        . This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeleteLadderId(null)}
                        className="cursor-pointer"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(deleteLadderId)}
                        className="bg-green-700 hover:bg-green-800 cursor-pointer"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LadderList;
