import { db } from "@/db";
import { authorizedUsers } from "@/db/schema";

import { eq } from "drizzle-orm";
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "./lib/drizzle-adapter";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: DrizzleAdapter,
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
          .from(authorizedUsers)
          .where(eq(authorizedUsers.email, user.email))
          .execute();

        if (existingUser.length == 0) {
          return false;
        }
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async session({ session }) {
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
