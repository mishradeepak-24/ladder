
// ===================== responsive here

// "use client";

// import React, { useEffect, useState } from "react";
// import { Copy } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const LadderLinkPanel = ({ ladderId }) => {
//   const [copied, setCopied] = useState(false);
//   const [registerUrl, setRegisterUrl] = useState("");

//   useEffect(() => {
//     if (ladderId && typeof window !== "undefined") {
//       const encodedId = encodeURIComponent(btoa(String(ladderId)));
//       const url = `${window.location.origin}/register-user/${encodedId}`;
//       setRegisterUrl(url);
//     }
//   }, [ladderId]);

//   const handleCopy = () => {
//     if (registerUrl) {
//       navigator.clipboard.writeText(registerUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   if (!registerUrl) return null;

//   return (
//     <div className="w-full backdrop-blur-sm p-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         {/* <span className="sm:text-sm text-center text-blue-950 font-semibold">
//           Ladder URL
//         </span> */}

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
//           <div className="flex items-center justify-center px-2 bg-white/55 rounded">
//             <span className=" text-blue-950 font-semibold">
//               Ladder URL
//             </span>
//             <input
//               type="text"
//               value={registerUrl}
//               readOnly
//               className="text-sm px-3 py-2 rounded-md  flex-1 text-blue-800 font-semibold outline-none"
//             />
//             <Button
//               onClick={handleCopy}
//               className=" bg-white/0 text-red-600 hover:bg-red-100 cursor-pointer px-4 py-2 flex items-center justify-center gap-1 text-sm font-medium"
//             >
//               {copied ? "Copied!" : "Copy"}
//               <Copy size={14} />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LadderLinkPanel;











// ===================== ==>


  "use client";

import React, { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const LadderLinkPanel = ({ ladderId }) => {
  const [copied, setCopied] = useState(false);
  const [registerUrl, setRegisterUrl] = useState("");

  useEffect(() => {
    if (ladderId && typeof window !== "undefined") {
      const encodedId = encodeURIComponent(btoa(String(ladderId)));
      const url = `${window.location.origin}/register-user/${encodedId}`;
      setRegisterUrl(url);
    }
  }, [ladderId]);

  const handleCopy = () => {
    if (registerUrl) {
      navigator.clipboard.writeText(registerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!registerUrl) return null;

  return (
    <div className="w-full backdrop-blur-sm ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
   

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <div className="flex flex-col sm:flex-row items-center bg-white/55 rounded w-full sm:w-auto py-3 sm:py-0">
               <span className="sm:text-sm text-center sm:text-left text-blue-950 font-semibold w-full sm:w-auto px-2">
          Ladder URL
        </span>
            <input
              type="text"
              value={registerUrl}
              readOnly
              className="text-sm text-center px-3 py-2 rounded-md flex-1 text-blue-800 font-semibold outline-none w-full sm:w-auto"
            />
            <Button
              onClick={handleCopy}
              className="mt-2 sm:mt-0 sm:ml-2 sm:bg-white/0 text-red-600 hover:bg-red-100 cursor-pointer px-4 py-2 sm:border-none md:border-none lg:border-none border border-red-400 shadow-md bg-red-100 flex items-center justify-center gap-1 text-sm font-medium w-50 sm:w-auto"
            >
              {copied ? "Copied!" : "Copy"}
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LadderLinkPanel;










