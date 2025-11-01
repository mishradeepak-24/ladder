
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetUserState } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterUser({ ladderId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    ladder_id: ladderId,
  });

  // show/hide state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ladder_id: ladderId,
    }));
  }, [ladderId]);

  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  useEffect(() => {
    if (formSubmitted && successMessage) {
      toast.success("You have successfully created an account!");
      setTimeout(() => {
        const encodedId = formData.ladder_id ? btoa(formData.ladder_id) : null;
        const loginRedirectUrl = encodedId
          ? `/login-user?id=${encodedId}`
          : "/login-user";
        router.push(loginRedirectUrl);
      }, 2000);
    }

    if (formSubmitted && error) {
      toast.error(error);
      dispatch(resetUserState());
      setFormSubmitted(false);
    }
  }, [successMessage, error, dispatch, router, formData.ladder_id, formSubmitted]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    const { username, password, confirmPassword, name, ladder_id } = formData;

    if (!username || !password || !confirmPassword || !name) {
      toast.error("All fields are required!");
      return;
    }

    if (!emailRegex.test(username)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const payload = {
      user_id: username,
      password,
      name,
      user_type: "user",
      ladder_id: ladder_id,
    };

    console.log("✅ Sending payload:", payload);
    setFormSubmitted(true);
    dispatch(registerUser(payload));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <ToastContainer />
      <Card className="w-[380px] shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
            Sports Ladder
          </h2> */}

          {/* Name */}
          <div className="mb-4">
            <Label htmlFor="fullname" className="font-semibold text-blue-600 text-md">
              Name
            </Label>
            <Input
              id="fullname"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 rounded-none"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <Label htmlFor="username" className="font-semibold text-blue-600 text-md">
              Username / Email
            </Label>
            <Input
              id="username"
              placeholder="Enter your email address"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="mt-1 rounded-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <Label htmlFor="password" className="font-semibold text-blue-600 text-md">
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="mt-1 pr-10 rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <Label htmlFor="confirmPassword" className="font-semibold text-blue-600 text-md">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="mt-1 pr-10 rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
          >
            {loading ? "Registering..." : "Register Now"}
          </Button>

          <div className="mt-4 text-sm text-center">
            <p>
              Already have an account?{" "}
              <Link
                href={`/login-user${
                  formData.ladder_id ? `?id=${btoa(formData.ladder_id)}` : ""
                }`}
                className="text-blue-600 underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}























// ========================== ==>

// "use client";
// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser, resetUserState } from "@/redux/slices/userSlice";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import PlayerCard from "@/components/shared/PlayerCard";
// import AvailableLabel from "@/components/shared/AvailableLabel";

// const APPKEY =
//   "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// export default function RegisterUser({ ladderId }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loading, error, successMessage } = useSelector((state) => state.user);

//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//     ladder_id: ladderId,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Leaderboard modal state
//   const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
//   const [ladderDetails, setLadderDetails] = useState(null);
//   const [grades, setGrades] = useState([]);
//   const [players, setPlayers] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       ladder_id: ladderId,
//     }));
//   }, [ladderId]);

//   useEffect(() => {
//     dispatch(resetUserState());
//   }, [dispatch]);

//   useEffect(() => {
//     if (formSubmitted && successMessage) {
//       toast.success("You have successfully created an account!");
//       setTimeout(() => {
//         const encodedId = formData.ladder_id ? btoa(formData.ladder_id) : null;
//         const loginRedirectUrl = encodedId
//           ? `/login-user?id=${encodedId}`
//           : "/login-user";
//         router.push(loginRedirectUrl);
//       }, 2000);
//     }

//     if (formSubmitted && error) {
//       toast.error(error);
//       dispatch(resetUserState());
//       setFormSubmitted(false);
//     }
//   }, [successMessage, error, dispatch, router, formData.ladder_id, formSubmitted]);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRegister = () => {
//     const { username, password, confirmPassword, name, ladder_id } = formData;

//     if (!username || !password || !confirmPassword || !name) {
//       toast.error("All fields are required!");
//       return;
//     }

//     if (!emailRegex.test(username)) {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const payload = {
//       user_id: username,
//       password,
//       name,
//       user_type: "user",
//       ladder_id: ladder_id,
//     };

//     setFormSubmitted(true);
//     dispatch(registerUser(payload));
//   };

//   const handleEyeClick = async () => {
//     if (!formData.ladder_id) {
//       toast.error("No ladder ID found!");
//       return;
//     }

//     try {
//       setLoadingLeaderboard(true);

//       // 🟢 Fetch leaderboard
//       const res = await fetch(
//         `https://ne-games.com/leaderBoard/api/user/leaderboard?ladder_id=${formData.ladder_id}`,
//         {
//           method: "GET",
//           headers: {
//             APPKEY: APPKEY,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) throw new Error("Leaderboard request failed");
//       const data = await res.json();
//       console.log("dkk", data);

//       setLadderDetails(data?.ladderDetails || null);
//       setGrades(data?.gradebarDetails || []);
//       setPlayers(data?.data || []);

//       // 🟢 Fetch activity
//       const activityRes = await fetch(
//         `https://ne-games.com/leaderBoard/api/user/activity?ladder_id=${formData.ladder_id}`,
//         {
//           method: "GET",
//           headers: {
//             APPKEY: APPKEY,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!activityRes.ok) throw new Error("Activity request failed");
//       const activityData = await activityRes.json();
//       setActivities(activityData?.data || []);

//       setShowLeaderboardModal(true);
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//       toast.error("Failed to load leaderboard or activity!");
//     } finally {
//       setLoadingLeaderboard(false);
//     }
//   };


//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
//       <ToastContainer />
//       <Card className="w-[380px] shadow-lg rounded-2xl">
//         <CardContent className="p-6">
//           <h2 className="text-2xl font-bold text-center flex items-center flex-col justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
//             <button
//               type="button"
//               onClick={handleEyeClick}
//               className="text-gray-600 hover:text-gray-800 cursor-pointer"
//             >
//               <Eye size={22} />
//             </button>
//             Sports Ladder
//           </h2>

//           {/* Leaderboard Modal */}
//           {showLeaderboardModal && (
//             <div className=" bg-gradient-to-br  from-purple-300 via-pink-200 to-indigo-400 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className=" w-[95%] max-w-6xl p-6 rounded-lg relative max-h-[90vh] overflow-y-auto">
//                 {/* Close Btn */}
//                 <button
//                   className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//                   onClick={() => setShowLeaderboardModal(false)}
//                 >
//                   <X size={22} />
//                 </button>

//                 {loadingLeaderboard ? (
//                   <p className="text-center text-gray-500">Loading...</p>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Section: Players */}
//                     <div className="lg:col-span-2">
//                       {ladderDetails && (
//                         <div className="mb-4 border-b pb-2">
//                           <h3 className="font-bold text-blue-600 text-xl">
//                             {ladderDetails.name}
//                           </h3>
//                           <p className="text-gray-700 text-sm">
//                             Admin: {ladderDetails.admin_name} ({ladderDetails.admin_email})
//                           </p>
//                         </div>
//                       )}

//                       {/* Players by Gradebar */}


//                       {/* Players by Gradebar */}


//                       <div className="space-y-8 mt-4">
//                         {grades.map((grade, gradeIndex) => {
//                           // Split players by rank for this grade
//                           const gradePlayers = players
//                             .sort((a, b) => a.rank - b.rank)
//                             .slice(gradeIndex * 10, (gradeIndex + 1) * 10); // 10 players per grade

//                           return (
//                             <div key={grade.id}>
//                               {/* Grade Heading */}
//                               <h2 className="text-red-600 font-bold text-xl mb-4">
//                                 {grade.gradebar_name}
//                               </h2>

//                               {/* Players Grid */}
//                               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
//                                 {gradePlayers.length > 0 ? (
//                                   gradePlayers.map((player) => (
//                                     <div
//                                       key={player.id}
//                                       className="bg-green-600 text-black p-4 rounded-lg shadow-md flex items-center gap-3"
//                                     >
//                                       {/* Rank */}
//                                       <div className="font-bold text-xl">{player.rank}</div>

//                                       {/* Avatar (agar image ho to image use karo, warna dummy icon) */}
//                                       <img
//                                         src={
//                                           player.image
//                                             ? `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${p.image}`
//                                             : "/logo.jpg"
//                                         }
//                                         alt={player.name}
//                                         className="w-10 h-10 rounded-full border-2 border-white"
//                                       />

//                                       {/* Player Info */}
//                                       <div>
//                                         <p className="font-semibold">{player.name}</p>
//                                         <p className="text-sm">{player.phone}</p>
//                                       </div>
//                                     </div>
//                                   ))
//                                 ) : (
//                                   <p className="text-center text-gray-500 col-span-full">
//                                     No players found
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>




//                     </div>

//                     {/* Right Section: Activity */}
//                     <div className="mt-28 ">
//                       <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-4 rounded-xl shadow-md">
//                         <h4 className="text-lg font-bold text-purple-800 flex items-center gap-2 mb-3">
//                           <span role="img" aria-label="activity">🎉</span> ACTIVITY
//                         </h4>

//                         {activities.length > 0 ? (
//                           <div className="space-y-3">
//                             {activities.map((a, i) => (
//                               <div
//                                 key={i}
//                                 className="bg-white p-3 rounded-lg shadow border-l-4 border-green-500"
//                               >
//                                 <p className="text-gray-800 text-sm">
//                                   {a.message || "Congratulations - Activity completed!"}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-gray-500 text-sm">No recent activity</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Name */}
//           <div className="mb-4">
//             <Label className="font-semibold text-blue-600 text-md">Name</Label>
//             <Input
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//               className="mt-1 rounded-none"
//             />
//           </div>

//           {/* Username */}
//           <div className="mb-4">
//             <Label className="font-semibold text-blue-600 text-md">
//               Username / Email
//             </Label>
//             <Input
//               placeholder="Enter your email address"
//               value={formData.username}
//               onChange={(e) => handleChange("username", e.target.value)}
//               className="mt-1 rounded-none"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4 relative">
//             <Label className="font-semibold text-blue-600 text-md">
//               Password
//             </Label>
//             <Input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={(e) => handleChange("password", e.target.value)}
//               className="mt-1 pr-10 rounded-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-9 text-gray-500"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-4 relative">
//             <Label className="font-semibold text-blue-600 text-md">
//               Confirm Password
//             </Label>
//             <Input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm your password"
//               value={formData.confirmPassword}
//               onChange={(e) => handleChange("confirmPassword", e.target.value)}
//               className="mt-1 pr-10 rounded-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-9 text-gray-500"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           {/* Register Button */}
//           <Button
//             onClick={handleRegister}
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
//           >
//             {loading ? "Registering..." : "Register Now"}
//           </Button>

//           <div className="mt-4 text-sm text-center">
//             <p>
//               Already have an account?{" "}
//               <Link
//                 href={`/login-user${formData.ladder_id ? `?id=${btoa(formData.ladder_id)}` : ""}`}
//                 className="text-blue-600 underline"
//               >
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }