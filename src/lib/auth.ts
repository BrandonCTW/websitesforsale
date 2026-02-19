import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "@/db"
import { sessions, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { randomBytes } from "crypto"

const SESSION_COOKIE = "session"
const SESSION_DURATION_DAYS = 7
const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

export async function createSession(userId: number) {
  const sessionId = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)

  await db.insert(sessions).values({ id: sessionId, userId, expiresAt })

  const token = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    const sessionId = payload.sessionId as string

    const result = await db
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (!result.length) return null
    const { session, user } = result[0]

    if (new Date() > session.expiresAt) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
      return null
    }

    if (user.isBanned) return null

    return { user, sessionId }
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret)
      await db.delete(sessions).where(eq(sessions.id, payload.sessionId as string))
    } catch {}
  }
  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("UNAUTHORIZED")
  }
  return session
}
