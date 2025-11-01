
// "use client";
// import React, { useEffect, useState } from "react";
// import LoginUser from "@/components/pages/users/LoginUser";

// const LoginUserRouter = ({ params }) => {
//   const { encodedId } = params;
//   const [ladderId, setLadderId] = useState(null);

//   useEffect(() => {
//     try {
//       const decodedId = atob(encodedId);
//       setLadderId(decodedId);
//     } catch (err) {
//       console.error("Invalid encoded ID:", err);
//     }
//   }, [encodedId]);

//   return <LoginUser ladderId={ladderId} />;
// };

// export default LoginUserRouter;

















"use client";
import React, { useEffect, useState } from "react";
import LoginUser from "@/components/pages/users/LoginUser";

const LoginUserRouter = ({ params }) => {
  const { encodedId } = params;
  const [ladderId, setLadderId] = useState(null);

  useEffect(() => {
    if (!encodedId) return;

    try {
      // ✅ Safe Base64 validation
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(encodedId);
      if (!isBase64) {
        console.warn("⚠️ Invalid Base64 string received:", encodedId);
        setLadderId(null);
        return;
      }

      const decodedId = atob(encodedId);
      setLadderId(decodedId);
    } catch (err) {
      console.error("Invalid encoded ID:", err);
      setLadderId(null);
    }
  }, [encodedId]);

  return <LoginUser ladderId={ladderId} />;
};

export default LoginUserRouter;
