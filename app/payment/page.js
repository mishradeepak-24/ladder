
"use client"

import React from 'react'
import PaymentHeading from '@/components/pages/payment/PaymentHeading'
import SubscriptionPlan from '@/components/pages/payment/SubscriptionPlan'
import { useRouter } from 'next/navigation'

import { useSelector } from 'react-redux'
import { loginPage } from '@/helper/RouteName'


const PaymentPageRouter = () => {

  const ladderId = useSelector((state) => state.user?.user?.ladder_id);

    const router = useRouter()
  
    const user_type = useSelector((state)=> state.user?.user?.user_type)
  
    if(user_type !== "admin") {
      router.push(loginPage)
    }   

  return (
    <div>
        <main className='bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-400 '>
         <PaymentHeading />
         <SubscriptionPlan ladderId={ladderId} />
        </main>
        

    </div>
  )
}

export default PaymentPageRouter