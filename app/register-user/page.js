
"use client"

import React from 'react'

import RegisterUser from '@/components/pages/users/RegisterUser'
import { useSelector } from 'react-redux'


const RegisterUserRouter = () => {

  const ladderId = useSelector((state)=> state)
  console.log("register user ladder id : ", ladderId)

  return (
    <div>
        <RegisterUser ladderId={ladderId} />
    </div>
  )
}

export default RegisterUserRouter