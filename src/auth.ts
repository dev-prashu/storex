import { db } from "@/db";
import {
  accounts,
  authenticatedUsers,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";


export const {handlers:{GET,POST},signIn,signOut,auth} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }
      try {
        const existingUser = await db
          .select()
          .from(authenticatedUsers)
          .where(eq(authenticatedUsers.email, user.email))
          .execute();

          
        
          if(existingUser.length==0){
            return false
          }
          return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async session({ session }) {
      return session;
    }
  },
 
  pages: {
    signIn: "/login",
    error: "/login",
  },
});


