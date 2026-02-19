import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { listings } from "@/db/schema"
import { eq, and, gte, lte, ilike, or } from "drizzle-orm"
import { getSession } from "@/lib/auth"
import { generateSlug } from "@/lib/slug"

// GET /api/listings — public browse with filters
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const minRevenue = searchParams.get("minRevenue")
  const maxRevenue = searchParams.get("maxRevenue")
  const q = searchParams.get("q")

  const conditions = [eq(listings.status, "active")]

  if (category) conditions.push(eq(listings.category, category))
  if (minPrice) conditions.push(gte(listings.askingPrice, parseInt(minPrice)))
  if (maxPrice) conditions.push(lte(listings.askingPrice, parseInt(maxPrice)))
  if (minRevenue) conditions.push(gte(listings.monthlyRevenue, parseInt(minRevenue)))
  if (maxRevenue) conditions.push(lte(listings.monthlyRevenue, parseInt(maxRevenue)))
  if (q) {
    conditions.push(or(ilike(listings.title, `%${q}%`), ilike(listings.description, `%${q}%`))!)
  }

  const results = await db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(listings.createdAt)

  return NextResponse.json(results)
}

// POST /api/listings — create listing (seller only)
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const {
    title, url, description, category, askingPrice,
    monthlyRevenue, monthlyProfit, monthlyTraffic, ageMonths,
    monetization, techStack, reasonForSelling, includedAssets,
  } = body

  if (!title || !url || !description || !category || !askingPrice || !ageMonths || !reasonForSelling) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  const slug = generateSlug(title)

  const [listing] = await db
    .insert(listings)
    .values({
      sellerId: session.user.id,
      title,
      slug,
      url,
      description,
      category,
      askingPrice: parseInt(askingPrice),
      monthlyRevenue: monthlyRevenue ? parseInt(monthlyRevenue) : null,
      monthlyProfit: monthlyProfit ? parseInt(monthlyProfit) : null,
      monthlyTraffic: monthlyTraffic ? parseInt(monthlyTraffic) : null,
      ageMonths: parseInt(ageMonths),
      monetization: monetization ?? [],
      techStack: techStack ?? [],
      reasonForSelling,
      includedAssets: includedAssets ?? null,
      status: "active",
    })
    .returning()

  return NextResponse.json(listing, { status: 201 })
}
