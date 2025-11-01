

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetUserState } from "@/redux/slices/userSlice";
import { forgotPassword,resetForgotPasswordState } from "@/redux/slices/forgetPasswordSlice";
import { adminPage, registerPage } from "@/helper/RouteName";
import { Eye, EyeOff } from "lucide-react";

// Shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, user, isFreePlanExpired } = useSelector(
    (state) => state.user
  );

  const {
    loading: forgotLoading,
    success: forgotSuccess,
    error: forgotError,
    message: forgotMessage,
  } = useSelector((state) => state.forgotPassword);

  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    if (from === "ladder") {
      toast.info("Use the same exact details you used to create your account.", {
        autoClose: 5000,
      });
    }
  }, [from]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Username and Password are required!");
      return;
    }

    const payload = {
      user_id: username.trim().toLowerCase(),
      password: password.trim(),
      user_type: "admin", // This is the intended login type
    };

    try {
      const res = await dispatch(loginUser(payload)).unwrap();

      if (res?.data?.user_type === "user") {
        toast.error(
          "Incorrect login type! This account is a normal user, not an admin."
        );
        return;
      }

      if (res?.status === 200) {
        localStorage.setItem("userData", JSON.stringify(res.data));
      }

      toast.success(res?.success_message || "Login successful!");
      router.push(adminPage);
    } catch (err) {
      toast.error(
        err?.error_message ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  // ✅ Forgot password handler with slice
  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error("Please enter your email!");
      return;
    }
    dispatch(forgotPassword(forgotEmail));
  };

  // ✅ Show toast on forgot password API result
  useEffect(() => {
    if (forgotSuccess) {
      toast.success("Reset link sent to your Registered Email!");
      setIsForgotOpen(false);
      setForgotEmail("");
      dispatch(resetForgotPasswordState());
    }
    if (forgotError) {
      toast.error(
        typeof forgotError === "string"
          ? forgotError
          : "Failed to send reset link"
      );
      dispatch(resetForgotPasswordState());
    }
  }, [forgotSuccess, forgotError, forgotMessage, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(resetUserState());
    }
  }, [error, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <ToastContainer />
      <Card className="w-[380px] shadow-lg rounded-2xl">
        <CardContent className="p-6">
          {/* Username */}
          <div className="mb-4">
            <Label
              htmlFor="username"
              className="text-blue-600 py-2 font-semibold text-xl"
            >
              Username/Email
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="mb-4 relative">
            <Label
              htmlFor="password"
              className="text-blue-600 py-2 font-semibold text-xl"
            >
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-13 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 font-semibold flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <FaArrowRightLong />}
          </Button>

          {/* Links */}
          <div className="mt-4 text-sm text-center space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link href={registerPage} className="text-blue-600 underline">
                Register here
              </Link>
            </p>

            {/* Forgot Password Modal Trigger */}
            <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
              <DialogTrigger asChild>
                <button className="text-purple-600 underline">
                  Forgot Password
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="forgotEmail">Enter your email</Label>
                  <Input
                    id="forgotEmail"
                    placeholder="example@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Free Plan Expired Warning */}
          {isFreePlanExpired && (
            <p className="mt-4 text-sm text-red-600 text-center">
              ⚠️ Your free plan has expired. Please upgrade to continue.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

