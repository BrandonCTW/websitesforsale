import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

interface GeneratedListing {
  title: string
  description: string
  category: string
  techStack: string[]
  monetization: string[]
  reasonForSelling: string
  includedAssets: string
}

function inferCategory(text: string): string {
  const t = text.toLowerCase()
  if (/shop|store|ecommerce|woocommerce|shopify|product|cart/.test(t)) return "ecommerce"
  if (/saas|software|platform|subscription|dashboard|app/.test(t)) return "saas"
  if (/newsletter|substack|email list|subscribers/.test(t)) return "newsletter"
  if (/community|forum|discord|members|membership/.test(t)) return "community"
  if (/service|agency|freelance|consulting/.test(t)) return "service-business"
  if (/tool|utility|calculator|generator/.test(t)) return "tool-or-app"
  return "content-site"
}

function detectTechStack(html: string): string[] {
  const tech: string[] = []

  const generatorMatch = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']generator["']/i)
  if (generatorMatch) {
    const gen = generatorMatch[1]
    if (/wordpress/i.test(gen)) { tech.push("WordPress", "PHP") }
    else if (/joomla/i.test(gen)) { tech.push("Joomla", "PHP") }
    else if (/drupal/i.test(gen)) { tech.push("Drupal", "PHP") }
    else if (/wix/i.test(gen)) { tech.push("Wix") }
    else if (/squarespace/i.test(gen)) { tech.push("Squarespace") }
    else if (/webflow/i.test(gen)) { tech.push("Webflow") }
    else if (/ghost/i.test(gen)) { tech.push("Ghost") }
  }

  if (!tech.length) {
    if (/cdn\.shopify\.com|myshopify\.com/.test(html)) tech.push("Shopify")
    if (/\/_next\//.test(html)) { tech.push("Next.js", "React") }
    else if (/react/.test(html)) tech.push("React")
    if (/wp-content|wp-includes/.test(html)) {
      if (!tech.includes("WordPress")) { tech.push("WordPress", "PHP") }
    }
    if (/gatsby/.test(html)) tech.push("Gatsby")
    if (/nuxt/.test(html)) tech.push("Nuxt.js", "Vue")
    if (/vue/.test(html) && !tech.includes("Vue")) tech.push("Vue")
    if (/angular/.test(html)) tech.push("Angular")
    if (/laravel/.test(html)) tech.push("Laravel", "PHP")
    if (/rails|ruby-on-rails/.test(html)) tech.push("Ruby on Rails")
    if (/django/.test(html)) tech.push("Django", "Python")
    if (/flask/.test(html)) tech.push("Flask", "Python")
  }

  return tech.length ? tech : ["HTML/CSS", "JavaScript"]
}

function inferMonetization(text: string, category: string): string[] {
  const t = text.toLowerCase()
  const monetization: string[] = []

  if (/adsense|display ads|banner ads|mediavine|ezoic|adthrive/.test(t)) monetization.push("Display Ads")
  if (/affiliate|amazon associates|commission/.test(t)) monetization.push("Affiliate Marketing")
  if (/subscription|saas|monthly fee|annual plan/.test(t) || category === "saas") monetization.push("Subscriptions")
  if (/sponsored|sponsorship|brand deal/.test(t)) monetization.push("Sponsored Content")
  if (/ebook|course|digital product|download/.test(t)) monetization.push("Digital Products")
  if (/ecommerce|shop|store/.test(t) || category === "ecommerce") monetization.push("Product Sales")
  if (/newsletter|email/.test(t) || category === "newsletter") {
    if (!monetization.includes("Subscriptions")) monetization.push("Newsletter")
  }

  if (!monetization.length) {
    if (category === "content-site") monetization.push("Display Ads", "Affiliate Marketing")
    else if (category === "ecommerce") monetization.push("Product Sales")
    else if (category === "saas") monetization.push("Subscriptions")
    else monetization.push("Affiliate Marketing")
  }

  return monetization
}

function cleanTitle(rawTitle: string, askingPrice: number): string {
  // Strip site name suffixes like "| My Brand" or "- My Brand"
  let title = rawTitle.replace(/\s*[\|–—-]\s*[^|–—-]+$/, "").trim()
  if (!title) title = rawTitle.trim()
  if (!title) title = "Established Website for Sale"

  // Cap at ~60 chars
  if (title.length > 60) title = title.slice(0, 57) + "..."

  // Avoid "for sale" duplication
  if (!/for sale/i.test(title)) title = title + " for Sale"

  return title
}

function buildDescription(
  metaDescription: string,
  pageTitle: string,
  category: string,
  tech: string[],
  monetization: string[],
  askingPrice: number
): string {
  const categoryLabels: Record<string, string> = {
    "content-site": "content website",
    "saas": "SaaS product",
    "ecommerce": "eCommerce store",
    "tool-or-app": "web application",
    "newsletter": "email newsletter",
    "community": "online community",
    "service-business": "service business",
    "other": "online business",
  }

  const categoryLabel = categoryLabels[category] ?? "online business"
  const techSummary = tech.slice(0, 3).join(", ")
  const monSummary = monetization.slice(0, 2).join(" and ")
  const priceFormatted = `$${askingPrice.toLocaleString()}`

  const intro = metaDescription
    ? `${metaDescription} This is a ${categoryLabel} with a proven track record, now available for acquisition at ${priceFormatted}.`
    : `This is an established ${categoryLabel} available for acquisition at ${priceFormatted}. Built on ${techSummary}, it represents a turnkey opportunity for a new owner to take over and grow.`

  const body = `The business is monetized through ${monSummary}, providing a diversified revenue base. Built on ${techSummary}, the technical stack is modern and maintainable. A new owner can hit the ground running with an existing audience and established SEO footprint. All assets, including the domain, codebase, and content library, are included in the sale.`

  return `${intro}\n\n${body}`
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: { url?: string; askingPrice?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { url, askingPrice } = body
  if (!url || !askingPrice || askingPrice <= 0) {
    return NextResponse.json({ error: "url and askingPrice are required." }, { status: 400 })
  }

  // Validate URL format
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("bad protocol")
  } catch {
    return NextResponse.json({ error: "Please enter a valid URL (https://...)." }, { status: 422 })
  }

  // Fetch homepage HTML
  let html = ""
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ListingBot/1.0)",
        "Accept": "text/html",
      },
    })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const raw = await response.text()
    html = raw.slice(0, 100_000) // Cap at 100KB
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json(
      { error: `Could not fetch the URL (${message}). Please check the URL and try again, or fill in the form manually.` },
      { status: 422 }
    )
  }

  // Parse key metadata
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawTitle = titleMatch ? titleMatch[1].trim() : ""

  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : ""

  const metaKeywordsMatch = html.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']keywords["']/i)
  const metaKeywords = metaKeywordsMatch ? metaKeywordsMatch[1] : ""

  // Inference
  const searchText = [rawTitle, metaDescription, metaKeywords, url].join(" ")
  const category = inferCategory(searchText)
  const techStack = detectTechStack(html)
  const monetization = inferMonetization(searchText, category)
  const title = cleanTitle(rawTitle, askingPrice)
  const description = buildDescription(metaDescription, rawTitle, category, techStack, monetization, askingPrice)

  const result: GeneratedListing = {
    title,
    description,
    category,
    techStack,
    monetization,
    reasonForSelling: "I'm focusing on other projects and don't have the bandwidth to grow this site to its full potential. I'd love to see it in the hands of someone who can dedicate the time and resources it deserves.",
    includedAssets: `Domain name, full source code and codebase, all content and media assets, Google Analytics / Search Console access, social media accounts (if any), and a 30-day handover period to ensure a smooth transition.`,
  }

  return NextResponse.json(result)
}
