"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createLadder } from "@/redux/slices/ladderSlice";
import { uploadCSV } from "@/redux/slices/leaderboardSlice";
import { setLadderId } from "@/redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchLadders } from "@/redux/slices/fetchLadderSlice";
import { clearCreateLadderState } from "@/redux/slices/ladderSlice";
import Link from "next/link";

import UserDetails from "@/components/shared/UserDetails";
import LadderList from "./LadderList";

import LadderInfo from "./LadderInfo";

export default function AdminPage() {
  const [ladderName, setLadderName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [ladderType, setLadderType] = useState("winlose"); // ✅ default ladder type

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.createLadder?.loading);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setCsvFile(e.target.files[0]);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    const fileUrl = "/samplePlayerLists.pdf";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "samplePlayerLists.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCreateLadder = async () => {
    if (!user?.id || !ladderName.trim() || !csvFile) {
      toast.warn(
        "Please enter ladder name, upload CSV, and ensure user is logged in."
      );
      return;
    }

    try {
      const ladderResult = await dispatch(
        createLadder({
          user_id: user.id,
          name: ladderName.trim(),
          type: ladderType,
        })
      ).unwrap();

      dispatch(clearCreateLadderState());
      toast.success(
        ladderResult?.success_message || "Ladder created successfully."
      );

      const createdLadderId =
        ladderResult?.data?.ladder_id || ladderResult?.data?.id;
      if (createdLadderId) {
        dispatch(setLadderId(createdLadderId));

        // Update ladder in redux for type info
        dispatch(
          createLadder.fulfilled({
            data: {
              ladder_id: createdLadderId,
              name: ladderName,
              type: ladderType,
            },
          })
        );
      }

      // Upload CSV for created ladder
      await dispatch(
        uploadCSV({ file: csvFile, ladder_id: createdLadderId })
      ).unwrap();
      toast.success("Users imported successfully!");

      // Refresh ladder list
      dispatch(fetchLadders(user.id));

      // Reset form
      setLadderName("");
      setCsvFile(null);
      setLadderType("winlose");

      // Redirect to player list
      setTimeout(() => {
        router.push(`/player-list?ladder_id=${createdLadderId}`);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#FFFFCC] min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <UserDetails />

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-5xl shadow-lg border-2 rounded-lg mb-8 border-purple-300 border-dotted">
          <CardContent className="flex items-center justify-center px-2 py-4">
            <div className="w-full text-center">
              <div className="flex items-center justify-center my-4 w-full max-w-md mx-auto">
                <div className="flex-grow border-t border-black"></div>
                <span className="mx-4 text-blue-700 font-bold text-sm sm:text-base">
                  Welcome to
                </span>
                <div className="flex-grow border-t border-black"></div>
              </div>
              <h1 className="uppercase text-blue-700 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
                Your Admin Centre
              </h1>
            </div>
          </CardContent>

          <CardContent className="space-y-6 px-4 sm:px-8">
            <p className="text-gray-700 text-base sm:text-lg text-center font-semibold">
              Here you can create new ladders and access current ones
            </p>

            {/* Ladder Type Info */}
            <div className="my-6">
              <Card className="px-4">
                <LadderInfo />

                <div className="space-y-3 sm:space-y-2 sm:text-start md:text-start lg:text-start text-center ">
                  <p className="py-2 text-sm sm:text-base">
                    Test a 'win/lose' demo Ladder (Login) -{" "}
                    <Link
                      href="/demo-login?autoLogin=true&demoType=winlose"
                      target="_blank"
                      className="text-blue-700 underline"
                    >
                      Click here
                    </Link>{" "}
                    - You will be logged in as the player ‘Joe Bloggs’
                  </p>

                  <p className="py-2 text-sm sm:text-base">
                    Test a 'Best of 3' demo Ladder (Login) -{" "}
                    <Link
                      href="/demo-login?autoLogin=true&demoType=best3"
                      target="_blank"
                      className="text-blue-700 underline"
                    >
                      Click here
                    </Link>{" "}
                    - You will be logged in as the player ‘Joe Bloggs’
                  </p>

                  <p className="py-2 text-sm sm:text-base">
                    Test a 'Best of 5' demo Ladder (Login) -{" "}
                    <Link
                      href="/demo-login?autoLogin=true&demoType=best5"
                      target="_blank"
                      className="text-blue-700 underline"
                    >
                      Click here
                    </Link>{" "}
                    - You will be logged in as the player ‘Joe Bloggs’
                  </p>

                  <p className="text-sm py-2 sm:text-base font-semibold sm:text-start md:text-start lg:text-start text-center">
                    <span className="font-semibold text-yellow-700">Note:</span>{" "}
                    as in a 'live ladder, you will only be able to 'work with'
                    Joe Bloggs' icon
                  </p>
                </div>
              </Card>
            </div>

            {/* Create Ladder Form */}
            <CardContent className="shadow-lg py-4 px-3 sm:px-6 border rounded-lg bg-white">
              <Label className="text-xl sm:text-2xl border-b text-blue-600 font-semibold text-center sm:text-start mb-4">
                Create a new ladder or test 'demo' ladder for your members
              </Label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
                <Input
                  placeholder="Enter ladder name"
                  value={ladderName}
                  onChange={(e) => setLadderName(e.target.value)}
                  className="flex-1 rounded-md"
                />

                <select
                  className="border rounded-md px-3 py-2 text-sm sm:text-base"
                  value={ladderType}
                  onChange={(e) => setLadderType(e.target.value)}
                >
                  <option value="winlose">Win/Lose</option>
                  <option value="best3">Best of 3</option>
                  <option value="best5">Best of 5</option>
                </select>

                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full sm:w-auto rounded-md"
                />

                <Button
                  onClick={handleCreateLadder}
                  disabled={!ladderName || !csvFile || loading}
                  className="bg-blue-600 hover:bg-blue-700 rounded-md w-full sm:w-auto text-white hover:opacity-90"
                >
                  {loading ? "Creating..." : "Create Ladder"}
                </Button>
              </div>
            </CardContent>

            {/* Ladder List */}
            <main className="flex w-full">
              <LadderList userId={user?.id} />
            </main>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
