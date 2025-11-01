// import CouponLists from '@/components/pages/coupon/CouponLists'
// import React from 'react'

// const CouponListRouter = () => {
//   return (
//     <div>
//         <CouponLists />
//     </div>
//   )
// }

// export default CouponListRouter






// ==================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import CouponLists from "@/components/pages/coupon/CouponLists";

export default function CouponListPage() {
  const router = useRouter();

  const user_type = useSelector((state)=> state.user?.user?.user_type) 

  

  useEffect(() => {
    

    if ( user_type !== "superadmin") {
      router.push("/coupon/login"); 
    }
  }, []);

 
  return <CouponLists />;
}

// Agar aap upar wala CouponLists component alag file me rakha hai
// import CouponLists from "@/components/CouponLists";
