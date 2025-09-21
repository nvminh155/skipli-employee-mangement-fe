import { auth } from '@/auth';
import { EUserRole } from '@/types/user';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {
  const session = await auth();
  if (session?.user?.role === EUserRole.MANAGER) {
    return  redirect('/dashboard/employees')
  }
  return redirect('/dashboard/tasks')
}

export default Page