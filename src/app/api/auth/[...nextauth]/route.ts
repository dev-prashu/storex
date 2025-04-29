import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

const handler = NextAuth({
  adapter:DrizzleAdapter(db,{
    usersTable:users,
    accountsTable:accounts,
    sessionsTable:sessions,
    verificationTokensTable:verificationTokens
  }),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // callbacks: {
  //   async signIn({ user }) {
  //     if (!user.email) {
  //       return false;
  //     }

  //     try {
  //       const existingUser = await db
  //         .select()
  //         .from(users)
  //         .where(eq(users.email, user.email))
  //         .execute();

  //       if (existingUser.length === 0) {
  //         return "/login?error=unauthorized";
  //       }

  //       return true;
  //     } catch (error) {
  //       console.error("Database error:", error);
  //       return "/login?error=database_error";
  //     }
  //   },

  //   async session({ session }) {
  //     const email = session.user?.email;

  //     if (email) {
  //       const uuid = await db
  //         .select({ id: users.id })
  //         .from(users)
  //         .where(eq(users.email, email))
  //         .execute();

  //       if (uuid.length > 0) {
  //         (session.user as { id: string }).id = uuid[0].id;
  //       }
  //     }

  //     console.log("SESSION", session);
  //     return session;
  //   },
  // },
  // pages: {
  //   signIn: "/login",
  //   error: "/login",
  // },
});

export { handler as GET, handler as POST };
