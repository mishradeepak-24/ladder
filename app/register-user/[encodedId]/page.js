


"use client";

import RegisterUser from "@/components/pages/users/RegisterUser";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const RegisterUserPage = () => {
  const params = useParams(); // Gets [encodedId] from the URL
  const [ladderId, setLadderId] = useState(null);

  useEffect(() => {
    const encodedId = params?.encodedId;

    console.log("🌐 Raw encodedId:", encodedId);

    if (encodedId) {
      try {
        const decodedId = atob(decodeURIComponent(encodedId)); // ✅ Safe decode
        console.log("✅ Decoded Ladder ID:", decodedId);
        setLadderId(decodedId);
      } catch (error) {
        console.error("❌ Invalid encoded ladder ID:", error);
        setLadderId(null);
      }
    }
  }, [params]);

  return (
    <div className="p-4">
      {/* ✅ Pass decoded ladderId safely to child */}
      <RegisterUser ladderId={ladderId} />
    </div>
  );
};

export default RegisterUserPage;