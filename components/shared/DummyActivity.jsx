"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import digitalTwin from "@/public/digital-twin.gif";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import axios from "axios";

const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

const ActivityLogUser = ({ ladderId }) => {

   const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      if (!ladderId) return setLoading(false);
      try {
        const res = await axios.get(
          `https://ne-games.com/leaderBoard/api/user/activity?ladder_id=${ladderId}`,
          { headers: { "Content-Type": "application/json", APPKEY } }
        );
        setActivities(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [ladderId]);

  const renderActivities = () => {
    return activities.map((activity, index) => {
      const progress = activity.progress?.toLowerCase();
      const icon =
        progress === "up" ? (
          <FaLongArrowAltUp className="text-green-500" size={18} />
        ) : progress === "down" ? (
          <FaLongArrowAltDown className="text-red-500" size={18} />
        ) : null;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 p-4 bg-white/60 rounded-xl shadow-sm hover:bg-white transition duration-200"
        >
          <p className="text-base md:text-lg font-medium flex items-center gap-2 text-gray-800">
            {icon}
            {activity.message}
          </p>
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className=" bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200">
        <CardContent>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold mb-6 text-center flex items-center justify-center gap-3"
          >
            <Image src={digitalTwin} width={50} height={50} alt="activity" className="rounded-full" />
            <span className="bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent">
              ACTIVITY
            </span>
          </motion.h2>

          <div className="w-full max-w-xl px-1 pr-3 space-y-3 max-h-[400px] overflow-y-auto  scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent hover:scrollbar-thumb-purple-500">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 flex items-center gap-3 animate-pulse"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-red-600 font-semibold">⚠️ {error}</p>
            ) : activities.length === 0 ? (
              <p className="text-center text-gray-600">No activity available.</p>
            ) : (
              renderActivities()
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityLogUser;
