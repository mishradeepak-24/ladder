
  // Activity log 

//   "use client";

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
// import digitalTwin from "@/public/digital-twin.gif";
// import { fetchUserActivity } from "@/redux/slices/activitySlice";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { useSearchParams } from "next/navigation";

// const ActivityLog = () => {
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//     const ladder_id = searchParams.get("ladder_id");
//   const { loading, data, error } = useSelector((state) => state.activity);

//    useEffect(() => {
//     if (ladder_id) {
//       dispatch(fetchUserActivity({ ladder_id: Number(ladder_id) }));
//     }
//   }, [ladder_id, dispatch]);

//   const activities = data?.data || [];

//   const renderActivities = () => {
//     return activities.map((activity, index) => {
//       const progress = activity.progress?.toLowerCase();
//       let icon = null;

//       if (progress === "up") {
//         icon = <FaLongArrowAltUp className="text-green-500" size={18} />;
//       } else if (progress === "down") {
//         icon = <FaLongArrowAltDown className="text-red-500" size={18} />;
//       }

//       return (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: index * 0.05 }}
//           className="mb-4 p-4 bg-white/60 rounded-xl shadow-sm hover:bg-white transition duration-200"
//         >
//           <p className="text-base md:text-lg font-medium flex items-center gap-2 text-gray-800">
//             {icon}
//             {activity.message}
//           </p>
//         </motion.div>
//       );
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <Card className="flex items-center justify-center mx-6 border-none bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200">
//         <CardContent className="">
//           {/* Header */}
//           <motion.h2
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-2xl font-extrabold mb-6 text-center flex items-center justify-center gap-3"
//           >
//             <Image
//               src={digitalTwin}
//               width={50}
//               height={50}
//               alt="activity"
//               className="rounded-full"
//             />
//             <span className="bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent">
//               ACTIVITY
//             </span>
//           </motion.h2>

//           {/* Body (scroll removed) */}
//           <div className="w-full max-w-xl px-1 pr-3 space-y-3">
//             {loading ? (
//               <div className="space-y-4">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: i * 0.1 }}
//                     className="p-4 flex items-center gap-3 animate-pulse"
//                   >
//                     <Skeleton className="h-10 w-10 rounded-full" />
//                     <div className="flex-1 space-y-2">
//                       <Skeleton className="h-4 w-2/3" />
//                       <Skeleton className="h-3 w-1/2" />
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : error ? (
//               <p className="text-center text-red-600 font-semibold">
//                 ⚠️ {error}
//               </p>
//             ) : activities.length === 0 ? (
//               <p className="text-center text-gray-600">No activity available.</p>
//             ) : (
//               renderActivities()
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default ActivityLog;







// ======================





"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaLongArrowAltDown, FaLongArrowAltUp, FaTrash } from "react-icons/fa";
import digitalTwin from "@/public/digital-twin.gif";
import { fetchUserActivity } from "@/redux/slices/activitySlice";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const ActivityLog = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const ladder_id = searchParams.get("ladder_id");
  const { loading, data, error } = useSelector((state) => state.activity);
  const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";


  useEffect(() => {
    if (ladder_id) {
      dispatch(fetchUserActivity({ ladder_id: Number(ladder_id) }));
    }
  }, [ladder_id, dispatch]);

  const activities = data?.data || [];

  // Delete activity function
  const handleDelete = async (activityId) => {
    if (!activityId) return;
    try {
      const res = await fetch(
        `https://ne-games.com/leaderBoard/api/user/activityDelete?id=${activityId}`,
         {
        method: "GET", // as per your API
        headers: {
          appkey: APPKEY,
        },
      }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success(result?.message || "Activity deleted successfully!");
        // Refresh activity list
        if (ladder_id) {
          dispatch(fetchUserActivity({ ladder_id: Number(ladder_id) }));
        }
      } else {
        toast.error(result?.message || "Failed to delete activity!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const renderActivities = () => {
    return activities.map((activity, index) => {
      const progress = activity.progress?.toLowerCase();
      let icon = null;

      if (progress === "up") {
        icon = <FaLongArrowAltUp className="text-green-500" size={18} />;
      } else if (progress === "down") {
        icon = <FaLongArrowAltDown className="text-red-500" size={18} />;
      }

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="mb-3 p-4 bg-white/70 rounded-xl shadow-sm hover:shadow-md hover:bg-white transition duration-200 flex justify-between items-center"
        >
          <p className="text-base md:text-lg font-medium flex items-center gap-2 text-gray-800">
            {icon}
            {activity.message}
          </p>
          <button
            onClick={() => handleDelete(activity.id)}
            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
            title="Delete Activity"
          >
            <FaTrash />
          </button>
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
      <Card className="flex items-center justify-center mx-6 border-none bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 shadow-xl rounded-2xl">
        <CardContent className="w-full max-w-2xl p-6">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold mb-6 text-center flex items-center justify-center gap-3"
          >
            <Image
              src={digitalTwin}
              width={50}
              height={50}
              alt="activity"
              className="rounded-full"
            />
            <span className="bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent">
              ACTIVITY
            </span>
          </motion.h2>

          {/* Scrollable Body */}
          <div
            className="w-full max-h-[400px] overflow-y-auto px-2 pr-3 space-y-3 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent hover:scrollbar-thumb-purple-500"
          >
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
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
              <p className="text-center text-red-600 font-semibold">
                ⚠️ {error}
              </p>
            ) : activities.length === 0 ? (
              <p className="text-center text-gray-600">
                No activity available.
              </p>
            ) : (
              renderActivities()
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #a78bfa; /* purple-400 */
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #8b5cf6; /* purple-500 */
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </motion.div>
  );
};

export default ActivityLog;