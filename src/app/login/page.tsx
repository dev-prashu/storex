"use client";
import { signIn, signOut, useSession } from "next-auth/react";


export default function Home() {
  
  const { data: session } = useSession()

  
  if (session) {
  
    return (
      <>
        <p>Welcome {session.user?.name}. Signed In As</p>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  
  return (
    <>
      <p>Not Signed In</p>
      <button onClick={() => signIn('google')}>Sign in with google</button>
    </>
  )
}