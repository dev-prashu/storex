import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db"; // Your Drizzle DB connection
import { users } from "@/db/schema"; // Your users table schema
import { eq } from "drizzle-orm";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      try {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .execute();

        console.log(user);
        if (existingUser.length === 0) {
          return "/login?error=unauthorized";
        }

        return true;
      } catch (error) {
        console.error("Database error:", error);
        return "/login?error=database_error";
      }
    },
    async session({ session }) {
      console.log(session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Handles errors from signIn callback
  },
});

export { handler as GET, handler as POST };
