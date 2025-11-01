"use client";

import { useParams } from "next/navigation";
import RegisterPage from "@/components/pages/RegisterPage";
import LoginPage from "@/components/pages/LoginPage";
import RegisterUser from "@/components/pages/users/RegisterUser";
import LoginUser from "@/components/pages/users/LoginUser";

export default function DynamicPage() {
  const { action, encodedId } = useParams(); // Extracts both from the URL
  const decodedId = atob(encodedId); // Decode MzQ5 → 349

  if (!action || !encodedId) return <p>Invalid URL</p>;

  switch (action) {
    case "register-user":
      return <RegisterUser id={decodedId} />;
    case "login-user":
      return <LoginUser id={decodedId} />;

    default:
      return <p>Page not found</p>;
  }
}
