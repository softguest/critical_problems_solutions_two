import React from 'react'
import { auth } from '@/auth';

const UserNameDisplay = async () => {
   const session = await auth();
  return (
    <div>Hi {session?.user?.firstName}</div>
  )
}

export default UserNameDisplay;