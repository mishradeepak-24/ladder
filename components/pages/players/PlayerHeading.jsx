

// // =============================== ==> 28/08/2025

// "use client";

// import Image from "next/image";
// import React, { useRef, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "next/navigation";
// import { Pencil } from "lucide-react";

// const PlayerHeading = ({ demoLadderName }) => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const searchParams = useSearchParams();

//   const ladderIdFromUrl = searchParams.get("ladder_id");
//   const user = useSelector((state) => state.user?.user);
//   const ladderId = ladderIdFromUrl || user?.ladder_id;

//   const ladderDetails = useSelector(
//     (state) => state.player?.players?.[ladderId]?.ladderDetails
//   );

//   const [isEditingName, setIsEditingName] = useState(false);
//   const [editedName, setEditedName] = useState(
//     demoLadderName || ladderDetails?.name || ""
//   );

//   const logo = ladderDetails?.logo;
//   const name = demoLadderName || ladderDetails?.name; // ✅ agar demoLadderName pass hua toh wahi dikhayega

//   const imagePath =
//     logo && logo !== "null"
//       ? logo?.startsWith("http")
//         ? logo
//         : `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${logo}`
//       : "/game.png";

//   const handleLogoClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleLogoUpload = async (e) => {
//     if (demoLadderName) return; // ✅ demo page me upload disable
//     const file = e.target.files?.[0];
//     if (!file || !ladderId) return;

//     const formData = new FormData();
//     formData.append("logo", file);
//     formData.append("ladder_id", ladderId);

//     try {
//       const response = await fetch(
//         "https://ne-games.com/leaderBoard/api/user/updateladderlogo",
//         {
//           method: "POST",
//           headers: {
//             APPKEY:
//               "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//           },
//           body: formData,
//         }
//       );
//       const result = await response.json();
//       if (response.ok) {
//         window.location.reload();
//       } else {
//         console.error("Logo upload failed:", result.message);
//       }
//     } catch (err) {
//       console.error("Error uploading logo:", err);
//     }
//   };

//   const handleNameEdit = () => {
//     if (demoLadderName) return; // ✅ demo page me edit disable
//     setIsEditingName(true);
//   };

//   const handleNameChange = (e) => {
//     setEditedName(e.target.value);
//   };

//   const saveName = async () => {
//     if (demoLadderName) return; // ✅ demo page me save disable
//     if (!ladderId || !editedName.trim()) return;

//     try {
//       const response = await fetch(
//         `https://ne-games.com/leaderBoard/api/user/updateladdername?ladder_id=${ladderId}&name=${encodeURIComponent(
//           editedName.trim()
//         )}`,
//         {
//           method: "Post",
//           headers: {
//             APPKEY:
//               "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
//           },
//         }
//       );
//       const result = await response.json();
//       if (response.ok) {
//         setIsEditingName(false);
//         window.location.reload();
//       } else {
//         console.error("Name update failed:", result.message);
//       }
//     } catch (error) {
//       console.error("Error updating name:", error);
//     }
//   };

//   const handleNameKeyPress = (e) => {
//     if (e.key === "Enter") {
//       saveName();
//     }
//   };

//   return (
//     <div className="px-4 w-full">
//       <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-8 gap-4 text-center sm:text-left">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleLogoUpload}
//           style={{ display: "none" }}
//         />

//         {/* Logo + Pencil */}
//         <div
//           className={`relative ${demoLadderName ? "" : "cursor-pointer"}`}
//           onClick={!demoLadderName ? handleLogoClick : undefined}
//         >
//           <Image
//             src={imagePath || "/game.png"}
//             alt="Ladder Logo"
//             width={70}
//             height={70}
//             className="rounded-full border shadow-md object-cover"
//           />
//           {!demoLadderName && (
//             <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
//               <Pencil className="w-4 h-4 text-gray-600" />
//             </div>
//           )}
//         </div>

//         {/* Name + Pencil */}
//         <div className="w-full">
//           <div className="flex items-center justify-center sm:justify-start gap-2">
//             {isEditingName ? (
//               <input
//                 className="text-3xl sm:text-4xl font-bold border-b-2 border-purple-600 focus:outline-none"
//                 value={editedName}
//                 onChange={handleNameChange}
//                 onBlur={saveName}
//                 onKeyDown={handleNameKeyPress}
//                 autoFocus
//               />
//             ) : (
//               <>
//                 <h1 className="uppercase text-3xl sm:text-4xl font-bold pb-1">
//                   {name || "Loading..."}
//                 </h1>
//                 {!demoLadderName && (
//                   <button onClick={handleNameEdit}>
//                     <Pencil className="w-4 h-4 text-gray-600" />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//           <span className="text-sm sm:text-lg text-purple-800 font-semibold rounded-sm block mt-1">
//             ★ ★ ★ Tap on your name to move, edit details or status and upload avatar ★ ★ ★
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayerHeading;
 














// =============================== ==>

  "use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";

const PlayerHeading = ({ demoLadderName }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  const ladderIdFromUrl = searchParams.get("ladder_id");
  const user = useSelector((state) => state.user?.user);
  const ladderId = ladderIdFromUrl || user?.ladder_id;

  const ladderDetails = useSelector(
    (state) => state.player?.players?.[ladderId]?.ladderDetails
  );

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(
    demoLadderName || ladderDetails?.name || ""
  );

  const logo = ladderDetails?.logo;
  const name = demoLadderName || ladderDetails?.name;

  const imagePath =
    logo && logo !== "null"
      ? logo?.startsWith("http")
        ? logo
        : `https://ne-games.com/leaderBoard/public/admin/clip-one/assets/user/original/${logo}`
      : "/game.png";

  const handleLogoClick = () => {
    if (!demoLadderName && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoUpload = async (e) => {
    if (demoLadderName) return;
    const file = e.target.files?.[0];
    if (!file || !ladderId) return;

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("ladder_id", ladderId);

    try {
      const response = await fetch(
        "https://ne-games.com/leaderBoard/api/user/updateladderlogo",
        {
          method: "POST",
          headers: {
            APPKEY:
              "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
          },
          body: formData,
        }
      );
      if (response.ok) window.location.reload();
    } catch (err) {
      console.error("Error uploading logo:", err);
    }
  };

  const handleNameEdit = () => {
    if (!demoLadderName) setIsEditingName(true);
  };

  const saveName = async () => {
    if (demoLadderName) return;
    if (!ladderId || !editedName.trim()) return;

    try {
      const response = await fetch(
        `https://ne-games.com/leaderBoard/api/user/updateladdername?ladder_id=${ladderId}&name=${encodeURIComponent(
          editedName.trim()
        )}`,
        {
          method: "POST",
          headers: {
            APPKEY:
              "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
          },
        }
      );
      if (response.ok) {
        setIsEditingName(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleNameKeyPress = (e) => {
    if (e.key === "Enter") saveName();
  };

  return (
    <div className="px-4 w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 sm:gap-8 text-center sm:text-left max-w-3xl mx-auto">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleLogoUpload}
          className="hidden"
        />

        {/* Logo with Pencil */}
        <div
          className={`relative ${demoLadderName ? "" : "cursor-pointer"}`}
          onClick={handleLogoClick}
        >
          <Image
            src={imagePath}
            alt="Ladder Logo"
            width={80}
            height={80}
            className="rounded-full border shadow-md object-cover w-20 h-20 sm:w-[90px] sm:h-[90px]"
          />
          {!demoLadderName && (
            <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow">
              <Pencil className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {isEditingName ? (
              <input
                className="text-2xl sm:text-4xl font-bold border-b-2 border-purple-600 focus:outline-none px-1"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={saveName}
                onKeyDown={handleNameKeyPress}
                autoFocus
              />
            ) : (
              <>
                <h1 className="uppercase text-3xl sm:text-4xl font-bold pb-1 break-words max-w-full">
                  {name || "Loading..."}
                </h1>
                {!demoLadderName && (
                  <button onClick={handleNameEdit}>
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </>
            )}
          </div>
          <span className="text-sm sm:text-base text-center sm:text-start md:text-lg font-semibold mt-1 block">
            Tap your name to move, edit details, update status or upload avatar ★★★
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeading;
