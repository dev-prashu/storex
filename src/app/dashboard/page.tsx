import { NextResponse } from 'next/server';
import React from 'react'
import {auth} from '@/auth';

async function DashBoard() {
  const session = await auth();
  console.log('------Dashboard Session ------',session);

  if(!session){
    return NextResponse.redirect('/login');
  }
  
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard