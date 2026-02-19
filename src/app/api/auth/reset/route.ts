import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import bcrypt from "bcrypt"
import { db } from "@/db"
import { users, passwordResetTokens } from "@/db/schema"
import { eq, and, gt, isNull } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const { token, newPw } = await req.json()

  if (!token || !newPw || newPw.length < 8) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const tokenHash = createHash("sha256").update(token).digest("hex")

  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        gt(passwordResetTokens.expiresAt, new Date()),
        isNull(passwordResetTokens.usedAt)
      )
    )
    .limit(1)

  if (!record) {
    return NextResponse.json({ error: "Link is invalid or has expired." }, { status: 400 })
  }

  const hash = await bcrypt.hash(newPw, 12)

  await db.update(users).set({ passwordHash: hash }).where(eq(users.id, record.userId))
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, record.id))

  return NextResponse.json({ ok: true })
}
