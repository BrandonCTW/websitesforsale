import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { currentPw, newPw } = await req.json()

  if (!currentPw || !newPw || newPw.length < 8) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

  const valid = await bcrypt.compare(currentPw, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
  }

  const hash = await bcrypt.hash(newPw, 12)
  await db.update(users).set({ passwordHash: hash }).where(eq(users.id, user.id))

  return NextResponse.json({ ok: true })
}
