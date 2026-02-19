import { notFound } from "next/navigation"
import { db } from "@/db"
import { listings, listingImages, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatNumber } from "@/lib/slug"
import { ContactForm } from "@/components/listings/ContactForm"
import Link from "next/link"

export const dynamic = "force-dynamic"

const CATEGORY_LABELS: Record<string, string> = {
  "content-site": "Content Site",
  "saas": "SaaS",
  "ecommerce": "eCommerce",
  "tool-or-app": "Tool / App",
  "newsletter": "Newsletter",
  "community": "Community",
  "service-business": "Service Business",
  "other": "Other",
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [row] = await db
    .select({ listing: listings, seller: { username: users.username, createdAt: users.createdAt } })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(eq(listings.slug, slug))
    .limit(1)

  if (!row) notFound()

  const { listing, seller } = row

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id))
    .orderBy(listingImages.displayOrder)

  const age =
    listing.ageMonths >= 12
      ? `${Math.floor(listing.ageMonths / 12)} yr ${listing.ageMonths % 12} mo`
      : `${listing.ageMonths} mo`

  const memberSince = new Date(seller.createdAt).getFullYear()

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{CATEGORY_LABELS[listing.category] ?? listing.category}</Badge>
          {listing.status !== "active" && (
            <Badge variant={listing.status === "sold" ? "destructive" : "outline"}>
              {listing.status === "under_offer" ? "Under Offer" : "Sold"}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-muted-foreground">
          Listed by{" "}
          <Link href={`/seller/${seller.username}`} className="underline">
            {seller.username}
          </Link>{" "}
          · Member since {memberSince}
        </p>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Screenshot ${i + 1}`}
              className={`rounded-lg object-cover w-full ${i === 0 && images.length > 1 ? "col-span-2 aspect-video" : "aspect-video"}`}
            />
          ))}
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricBox label="Asking Price" value={formatCurrency(listing.askingPrice)} highlight />
        {listing.monthlyRevenue != null && (
          <MetricBox label="Monthly Revenue" value={formatCurrency(listing.monthlyRevenue)} />
        )}
        {listing.monthlyProfit != null && (
          <MetricBox label="Monthly Profit" value={formatCurrency(listing.monthlyProfit)} />
        )}
        {listing.monthlyTraffic != null && (
          <MetricBox label="Monthly Traffic" value={formatNumber(listing.monthlyTraffic) + " views"} />
        )}
        <MetricBox label="Age" value={age} />
        {listing.monthlyRevenue && listing.askingPrice ? (
          <MetricBox
            label="Multiple"
            value={`${(listing.askingPrice / listing.monthlyRevenue).toFixed(1)}x monthly`}
          />
        ) : null}
      </div>

      <Separator />

      {/* Live URL */}
      <div>
        <h2 className="font-semibold mb-1">Live Site</h2>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {listing.url}
        </a>
      </div>

      {/* Description */}
      <div>
        <h2 className="font-semibold mb-2">About This Site</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
      </div>

      {/* Reason for selling */}
      <div>
        <h2 className="font-semibold mb-2">Reason for Selling</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{listing.reasonForSelling}</p>
      </div>

      {/* Included assets */}
      {listing.includedAssets && (
        <div>
          <h2 className="font-semibold mb-2">What&apos;s Included</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{listing.includedAssets}</p>
        </div>
      )}

      {/* Tags */}
      {(listing.techStack?.length || listing.monetization?.length) ? (
        <div className="space-y-3">
          {listing.techStack?.length ? (
            <div>
              <h2 className="font-semibold mb-2">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </div>
          ) : null}
          {listing.monetization?.length ? (
            <div>
              <h2 className="font-semibold mb-2">Monetization</h2>
              <div className="flex flex-wrap gap-2">
                {listing.monetization.map((m) => (
                  <Badge key={m} variant="outline">{m}</Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <Separator />

      {/* Contact form */}
      {listing.status === "active" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact the Seller</h2>
          <ContactForm listingId={listing.id} listingTitle={listing.title} />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          This listing is no longer accepting inquiries.
        </p>
      )}
    </div>
  )
}

function MetricBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-primary bg-primary/5" : ""}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold text-lg ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  )
}
