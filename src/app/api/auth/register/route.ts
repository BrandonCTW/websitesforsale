import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, or } from "drizzle-orm"
import { createSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json()

  if (!email || !username || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
    return NextResponse.json({ error: "Username must be 3–20 characters (letters, numbers, _ -)." }, { status: 400 })
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, email.toLowerCase()), eq(users.username, username.toLowerCase())))
    .limit(1)

  if (existing.length) {
    return NextResponse.json({ error: "Email or username already taken." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      passwordHash,
    })
    .returning({ id: users.id })

  await createSession(user.id)
  return NextResponse.json({ ok: true })
}
