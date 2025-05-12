import { auth } from "@/auth";
import { db } from "@/db";
import { authorizedUsers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    console.log(id);

    await db.transaction(async (tx) => {
      // const [{ email }] = await tx
      //   .select({ email: authorizedUsers.email })
      //   .from(authorizedUsers)
      //   .where(eq(authorizedUsers.id, id));

      // console.log(email);
      // if (email) {
      //   const [{ id: uuid }] = await tx
      //     .select({ id: users.id })
      //     .from(users)
      //     .where(eq(users.email, email));
      //   if (uuid) await tx.delete(sessions).where(eq(sessions.userId, uuid));
      // }

      await tx
        .update(authorizedUsers)
        .set({ deletedAt: sql`now()`, deletedById: session.user?.id })
        .where(eq(authorizedUsers.id, id));
    });

    return NextResponse.json(
      { message: "User Deleted Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
}
