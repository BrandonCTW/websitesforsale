import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

function getDb() {
  const url = process.env.POSTGRES_URL
  if (!url) throw new Error("POSTGRES_URL is not set")
  return drizzle(neon(url), { schema })
}

// Lazy singleton — only connects when first used at runtime
let _db: ReturnType<typeof getDb> | null = null
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop) {
    if (!_db) _db = getDb()
    return (_db as unknown as Record<string | symbol, unknown>)[prop]
  },
})
