
// ============ ==> 19/08/2025

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
import { loginPage } from "@/helper/RouteName";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    const { username, password, confirmPassword, name } = formData;

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
      user_type: "admin", // always admin
    };

    dispatch(registerUser(payload));
  };

  // ✅ Mount hone par purana success/error clear
  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  // ✅ Success/Error handling
  useEffect(() => {
    if (successMessage) {
      toast.success("You have successfully created an account!");
      setTimeout(() => {
        dispatch(resetUserState()); // Reset before redirect
        router.push(loginPage);
      }, 2000);
    }

    if (error) {
      toast.error(error);
      dispatch(resetUserState());
    }
  }, [successMessage, error, dispatch, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <ToastContainer />
      <Card className="w-[380px] shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
            Sports Ladder
          </h2> */}
{/* 
          <h2 className="text-2xl font-bold text-center flex-col flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">


                   <button
              type="button"
              onClick={()=>router.push("/demo-page")}
              className="text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-blue-300 px-2 py-2 rounded-full"
            >
              {<Eye size={22} />}
            </button>


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

          {/* Username / Email */}
          <div className="mb-4">
            <Label htmlFor="username" className="font-semibold text-blue-600 text-md">
              Username/Email
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
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Register Button */}
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
          >
            {loading ? "Registering..." : "Register Now"}
          </Button>

          {/* Redirect to Login */}
          <div className="mt-4 text-sm text-center">
            <p>
              Already have an account?{" "}
              <Link href={loginPage} className="text-blue-600 underline">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}











