import { NextRequest, NextResponse } from "next/server"
import { createHash, randomBytes } from "crypto"
import { db } from "@/db"
import { users, passwordResetTokens } from "@/db/schema"
import { eq } from "drizzle-orm"
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  // Always return ok to prevent email enumeration
  if (!email) return NextResponse.json({ ok: true })

  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (user && process.env.RESEND_API_KEY) {
    const token = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.insert(passwordResetTokens).values({ userId: user.id, tokenHash, expiresAt })

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset/${token}`
    const { sendPasswordResetEmail } = await import("@/lib/email")
    await sendPasswordResetEmail({ email: user.email, resetUrl })
  }

  return NextResponse.json({ ok: true })
}
