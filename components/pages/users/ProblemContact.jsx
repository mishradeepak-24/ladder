// "use client"

// import React from "react";
// import { useSelector } from "react-redux";
// import { useSearchParams } from "next/navigation";
// import { FcCellPhone } from "react-icons/fc";

// const ProblemContact = () => {
//   const searchParams = useSearchParams();
//   const ladderIdFromUrl = searchParams.get("ladder_id");

//   const user = useSelector((state) => state.user?.user);
//   const ladderId = ladderIdFromUrl || user?.ladder_id;

//   const playersData = useSelector((state) => state.player?.players?.[ladderId]);
//   const ladderDetails = playersData?.ladderDetails;

//   if (!ladderDetails?.admin_name || !ladderDetails?.admin_phone) return null;

//   return (
//     <div className="space-x-2 flex items-center">
//       <span className="font-semibold">Admin:</span>
//       <span className="font-semibold capitalize">
//         {ladderDetails.admin_name}
//       </span>
//       <span className=" underline text-blue-700 flex items-center"> <FcCellPhone fontSize={20} /> {ladderDetails.admin_phone}</span>
//     </div>
//   );
// };

// export default ProblemContact;






// ========================

"use client"

import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { FcCellPhone } from "react-icons/fc";
import clsx from "clsx";

const ProblemContact = () => {
  const searchParams = useSearchParams();
  const ladderIdFromUrl = searchParams.get("ladder_id");

  const user = useSelector((state) => state.user?.user);
  const ladderId = ladderIdFromUrl || user?.ladder_id;

  const playersData = useSelector((state) => state.player?.players?.[ladderId]);
  const ladderDetails = playersData?.ladderDetails

  console.log("problem contact: ", ladderDetails)

  // if (!ladderDetails?.admin_name || !ladderDetails?.admin_phone) return null;

  return (
    <div className="space-x-2 flex items-center">
      <span className="font-semibold">Admin:</span>
      <span className="font-semibold capitalize">
        {ladderDetails?.admin_name}
      </span>
      {/* <span className=" underline text-blue-700 flex items-center"> <FcCellPhone fontSize={20} /> {ladderDetails?.admin_phone}</span> */}
    </div>
  );
};

export default ProblemContact;
