

// ================== ==> 19

"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchLeaderboard, uploadCSV } from "@/redux/slices/leaderboardSlice";
import { UploadCloud } from "lucide-react";

const UploadPlayerLists = ({ onSuccessClose, ladderId }) => {
  const dispatch = useDispatch();

  // ✅ Safe fallback
  const leaderboard = useSelector((state) => state.leaderboard || {});
  const loading = leaderboard.loading || false;

  const user = useSelector((state) => state.user?.user);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ladderId) {
      dispatch(fetchLeaderboard({ ladder_id: ladderId }));
    }
  }, [dispatch, ladderId]);

  const handleUpload = async () => {
    if (!file) {
      toast.warn("Please select a CSV file first.");
      return;
    }
    if (file.type !== "text/csv") {
      toast.error("Only CSV files are allowed.");
      return;
    }

    try {
      // 🔄 simulate progress bar
      setProgress(10);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      await dispatch(uploadCSV({ file, ladder_id: ladderId })).unwrap();

      clearInterval(interval);
      setProgress(100);

      // toast.success("✅ CSV uploaded successfully!");
      setFile(null);

      if (typeof onSuccessClose === "function") {
        onSuccessClose(); // ✅ close dialog after success
      }

      // reset progress after 1 sec
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setProgress(0);
      toast.error("Failed to upload CSV. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 relative">
      {/* ✅ ToastContainer fix → no hideProgressBar */}
      <ToastContainer
        position="top-right"
        autoClose={7000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* 🔝 Top Header with Icon */}
      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <div className="p-4 bg-blue-50 rounded-full shadow-inner">
          <UploadCloud className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Upload Player List (CSV)
        </h2>
        <p className="text-sm text-gray-500">
          Upload your tournament/ladder players in bulk using a CSV file.
        </p>
      </div>

      {/* 🔐 CSV Upload - Admin Only */}
      {user?.user_type === "admin" && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile && selectedFile.type !== "text/csv") {
                toast.error("Please upload a valid CSV file.");
                setFile(null);
              } else {
                setFile(selectedFile);
              }
            }}
            className="w-full sm:w-56 rounded-lg shadow-sm border border-blue-300 font-mono text-sm"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full sm:w-auto rounded-lg bg-blue-600 font-semibold hover:bg-blue-700 duration-300 transition-all shadow-md"
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>
        </div>
      )}

      {/* 🚀 Progress Bar with % value */}
      {progress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner relative">
          <div
            className="bg-blue-600 h-5 rounded-full transition-all duration-300 flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            <span className="text-xs text-white font-semibold">
              {progress}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPlayerLists;
