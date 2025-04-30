import {
    type Adapter,
    type AdapterAccount,
    type AdapterUser,
    type AdapterSession,
    type VerificationToken,
  } from "@auth/core/adapters";
  import {
    accounts,
    sessions,
    users,
    verificationTokens,
  } from "../db/schema";
  import { and, eq } from "drizzle-orm";
  import { db } from "../db";
  
  export const DrizzleAdapter: Adapter = {
    async createUser(data) {
      const [user] = await db
        .insert(users)
        .values({
          ...data,
          id: crypto.randomUUID(),
        })
        .returning();
  
      return user as AdapterUser;
    },
  
    async getUser(id) {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return (user as AdapterUser) ?? null;
    },
  
    async getUserByEmail(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return (user as AdapterUser) ?? null;
    },
  
    async getUserByAccount({ provider, providerAccountId }) {
      const [result] = await db
        .select()
        .from(accounts)
        .innerJoin(users, eq(accounts.userId, users.id))
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        );
  
      return result?.users as AdapterUser ?? null;
    },
  
    async updateUser(data) {
      if (!data.id) throw new Error("No user id.");
      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning();
  
      return user as AdapterUser;
    },
  
    async deleteUser(id) {
      const [user] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
  
      return user as AdapterUser;
    },
  
    async linkAccount(data) {
      const [account] = await db.insert(accounts).values(data).returning();
      return account as AdapterAccount;
    },
  
    async unlinkAccount({ provider, providerAccountId }) {
      const [account] = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.providerAccountId, providerAccountId)
          )
        )
        .returning();
  
      return account as AdapterAccount ?? null;
    },
  
    async createSession(data) {
      const [session] = await db.insert(sessions).values(data).returning();
      return session as AdapterSession;
    },
  
    async getSessionAndUser(sessionToken) {
      const [result] = await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.sessionToken, sessionToken));
  
      if (!result) return null;
  
      return {
        session: result.session as AdapterSession,
        user: result.user as AdapterUser,
      };
    },
  
    async updateSession(data) {
      const [session] = await db
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning();
  
      return session as AdapterSession;
    },
  
    async deleteSession(sessionToken) {
      const [session] = await db
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning();
  
      return session as AdapterSession;
    },
  
    async createVerificationToken(data) {
      const [verificationToken] = await db
        .insert(verificationTokens)
        .values(data)
        .returning();
  
      return verificationToken as VerificationToken;
    },
  
    async useVerificationToken({ identifier, token }) {
      try {
        const [verificationToken] = await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, identifier),
              eq(verificationTokens.token, token)
            )
          )
          .returning();
  
        return verificationToken as VerificationToken ?? null;
      } catch {
        return null;
      }
    },
  
    // async listAuthenticatorsByUserId(userId: string) {
    //   return await db
    //     .select()
    //     .from(authenticators)
    //     .where(eq(authenticators.userId, userId));
    // },
  
    // async getAuthenticator(credentialID: string) {
    //   const [authenticator] = await db
    //     .select()
    //     .from(authenticators)
    //     .where(eq(authenticators.credentialID, credentialID));
  
    //   return authenticator ?? null;
    // },
  
    // async updateAuthenticatorCounter(credentialID: string, counter: number) {
    //   const [authenticator] = await db
    //     .update(authenticators)
    //     .set({ counter })
    //     .where(eq(authenticators.credentialID, credentialID))
    //     .returning();
  
    //   return authenticator ?? null;
    // },
  
    // async createAuthenticator(data) {
    //   const [authenticator] = await db
    //     .insert(authenticators)
    //     .values(data)
    //     .returning();
  
    //   return authenticator ?? null;
    // },
  };
  