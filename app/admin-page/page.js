"use client"

import AdminPage from '@/components/pages/admin/AdminPage'
import UserDetails from '@/components/shared/UserDetails'
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginPage } from '@/helper/RouteName'



const AdminPageRouter = () => {


      const router = useRouter()
    
      const user_type = useSelector((state)=> state.user?.user?.user_type)
    
      if(user_type !== "admin") {
        router.push(loginPage)
      } 

  const user = useSelector((state)=> state.user?.user?.ladder_id)

  return (
    <div className=''>
     
        <div>
          <AdminPage ladder_id={user} />
          
        </div>
    </div>
  )
}

export default AdminPageRouter