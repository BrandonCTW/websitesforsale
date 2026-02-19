# Product Requirements Document
## WebsitesForSale — Self-Hosted Website Marketplace

**Version:** 1.1
**Date:** 2026-02-19
**Status:** Draft

---

## 1. Overview

A lean, self-hosted marketplace for buying and selling websites. No listing fees, no broker commissions — just a direct channel between sellers and buyers. Built for small operators who want to move projects without paying Flippa's 5–10% take.

### Goals
- Let sellers list websites/apps for sale with all relevant metrics, fully visible to the public
- Let buyers browse, filter, and contact sellers without needing an account
- Keep the surface area small so it can actually be built and maintained

### Non-Goals (MVP)
- Buyer accounts or login
- Built-in escrow or payment processing
- Automated revenue verification
- Mobile app
- Multi-language support

---

## 2. User Roles

| Role   | Account Required | Description |
|--------|-----------------|-------------|
| Buyer  | No | Browses listings, contacts sellers anonymously via contact form |
| Seller | Yes | Lists websites for sale, manages inquiries from their dashboard |

Buyers never create accounts. Only sellers register.

---

## 3. Authentication (Sellers Only)

Simple email + password auth. No OAuth required for MVP.

### Requirements
- Register with email + password (bcrypt hashed, min 8 chars)
- Login with email + password
- Session via HTTP-only cookie (7-day expiry, sliding)
- Password reset via email link (1-hour token)
- No email verification required for MVP (reduces friction)
- Protected routes redirect to `/login?next=<path>`

### What's NOT included in MVP
- OAuth (Google, GitHub)
- Two-factor authentication
- Email verification on signup

---

## 4. Listings

The core data model. All fields (except seller email) are publicly visible.

### Listing Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | e.g. "Niche recipe blog" |
| url | string | yes | Current live URL — publicly visible |
| description | text | yes | 200–2000 chars, markdown supported |
| category | enum | yes | See categories below |
| asking_price | integer | yes | USD |
| monthly_revenue | integer | no | Avg last 3 months, USD |
| monthly_profit | integer | no | After expenses |
| monthly_traffic | integer | no | Avg monthly pageviews |
| age_months | integer | yes | How long it's been live |
| monetization | string[] | no | e.g. ["AdSense", "Affiliates", "SaaS"] |
| tech_stack | string[] | no | e.g. ["WordPress", "PHP", "MySQL"] |
| reason_for_selling | text | yes | Required — buyers always want this |
| included_assets | text | no | Domain, codebase, social accounts, etc. |
| screenshots | image[] | no | Up to 6 images |
| status | enum | yes | `active`, `under_offer`, `sold` |
| created_at | timestamp | auto | |
| updated_at | timestamp | auto | |
| seller_id | FK | auto | |

### Categories
`content-site`, `saas`, `ecommerce`, `tool-or-app`, `newsletter`, `community`, `service-business`, `other`

### Visibility Rules
Everything is public. The only thing never exposed is the seller's email address — buyers contact sellers via a forwarding form.

---

## 5. Buyer Journey

Buyers need no account at any point.

### 5.1 Browse Listings
- Landing page shows active listings in a card grid
- Each card shows: title, category badge, asking price, monthly revenue, age, short description excerpt
- Listings sorted by newest by default

### 5.2 Filter & Search
- Filter by: category, price range, monthly revenue range, age range, monetization type
- Search by keyword (title + description full-text)
- Sort by: newest, price low→high, price high→low, revenue high→low

### 5.3 View Listing Detail
All fields are visible to anyone:
- Title, URL (clickable), category, asking price
- Monthly revenue, profit, traffic
- Age, tech stack, monetization methods
- Description (rendered markdown)
- Reason for selling
- Included assets
- Screenshots gallery
- Contact form (see 5.4)
- Seller's public username and member-since date (no email)

### 5.4 Contact Seller (no login required)
- Contact form on every listing detail page
- Fields: buyer's name, buyer's email, message (required)
- On submit: email forwarded to seller with buyer's email in reply-to
- Message also stored in DB (inquiries table) for seller's dashboard
- Honeypot field + rate limit (3 submissions per IP per hour) to reduce spam
- Buyer sees a confirmation message on success ("Your message has been sent. The seller will reply to your email directly.")

---

## 6. Seller Journey

### 6.1 Register & Login
- `/register` — email + password
- `/login` — email + password
- `/forgot-password` / `/reset-password/<token>` — password reset flow

### 6.2 Create Listing
- Multi-step form in dashboard:
  1. **Basics** — title, current URL, category, asking price
  2. **Metrics** — monthly revenue, monthly profit, monthly traffic, age in months
  3. **Details** — description (markdown editor), reason for selling, included assets, tech stack tags, monetization tags
  4. **Media** — screenshot uploads (up to 6, drag-to-reorder)
  5. **Review & Publish** — preview of how listing will appear, then publish
- Auto-saves draft between steps
- Listing goes live immediately on publish

### 6.3 Manage Listings
- `/dashboard/listings` — table of all seller's listings with status badges and inquiry counts
- Actions per listing:
  - Edit (all fields)
  - Mark as Under Offer
  - Mark as Sold
  - Unpublish (removes from public browse, keeps record)
  - Delete (permanent)

### 6.4 Manage Inquiries
- `/dashboard/inquiries` — inbox of all messages from buyers
- Shows: buyer name, buyer email (so seller can reply), listing title, message, timestamp
- Mark as read / archive
- Seller replies directly from their email client — no in-app messaging

### 6.5 Seller Public Profile
- `/seller/<username>` — public page
- Shows: username, member since, all active listings by this seller
- Email is never shown

### 6.6 Account Settings
- `/dashboard/settings` — change email, change password

---

## 7. Pages & Routes

```
/                            Browse all active listings (public)
/listings/<slug>             Full listing detail + contact form (public)
/seller/<username>           Seller's public profile (public)
/about                       How it works, static page (public)

/login                       Seller login
/register                    Seller registration
/forgot-password             Request password reset email
/reset-password/<token>      Set new password

/dashboard                   Redirect → /dashboard/listings
/dashboard/listings          Seller's listing management table
/dashboard/listings/new      New listing wizard (multi-step)
/dashboard/listings/<id>/edit  Edit existing listing
/dashboard/inquiries         Seller's inquiry inbox
/dashboard/settings          Account settings (email, password)
```

---

## 8. Notifications (Email)

| Event | Recipient |
|-------|-----------|
| New inquiry received | Seller (contains buyer name, email, message, link to listing) |
| Password reset requested | Seller |

No in-app notification bell. No buyer emails other than the confirmation shown on-screen.

---

## 9. Admin (Minimal)

A simple `is_admin` boolean on user accounts. No admin UI for MVP.

Admin abilities (via direct DB or a bare `/admin` route):
- View/delete any listing
- Ban a user (`is_banned: true` prevents login)

---

## 10. Data Models

```
users
  id, email, password_hash, username, is_admin, is_banned,
  created_at, updated_at

sessions
  id, user_id, expires_at, created_at

password_reset_tokens
  id, user_id, token_hash, expires_at, used_at

listings
  id, seller_id, title, url, slug, description, category,
  asking_price, monthly_revenue, monthly_profit, monthly_traffic,
  age_months, monetization (json array), tech_stack (json array),
  reason_for_selling, included_assets, status,
  created_at, updated_at

listing_images
  id, listing_id, storage_key, display_order, created_at

inquiries
  id, listing_id, buyer_name, buyer_email, message,
  is_read, created_at
```

Note: No `buyer_id` on inquiries — buyers have no accounts.

---

## 11. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 15 (App Router) | SSR for SEO on public listing pages; API routes for form handling |
| Database | Vercel Postgres (Neon) | Free tier: 256MB, integrates in one click from Vercel dashboard |
| ORM | Drizzle ORM | Lightweight, type-safe, works great with Neon |
| Auth | Hand-rolled with `jose` + `bcrypt` | Node.js runtime so no Edge constraints — standard bcrypt works fine |
| Styling | Tailwind CSS + shadcn/ui | Fast, accessible components out of the box |
| File storage | Vercel Blob | Free tier: 512MB, one-line upload API, no config |
| Email | Resend | Simple API, generous free tier (100/day), good deliverability |
| Deployment | Vercel (GitHub integration) | Push to main → auto-deploy, preview URLs on every PR |

### Why this is simple to set up
- Connect GitHub repo to Vercel (2 clicks)
- Add Postgres and Blob from the Vercel dashboard Storage tab (2 more clicks — env vars auto-populate)
- Add `RESEND_API_KEY` as a single env var
- Push code — done

---

## 12. MVP Scope

### In MVP
- Seller auth (register, login, logout, password reset)
- Fully public listing browse + filter + search (no buyer login)
- Fully public listing detail pages (all fields visible)
- Anonymous buyer contact form with email forwarding + rate limiting
- Create / edit / publish / unpublish / delete listings (seller)
- Screenshot uploads (up to 6)
- Seller dashboard: listings table + inquiry inbox
- Seller public profile page
- Email notifications (new inquiry → seller, password reset)
- Admin flag with basic controls

### Deferred to V2
- OAuth login for sellers (Google)
- Listing verification badges (revenue verified, traffic verified)
- Listing view counter (how many people viewed it)
- Featured/promoted listings
- RSS feed of new listings
- Email digest for buyers who opt in to new listing alerts
- Offers/negotiation flow (structured offer, counter-offer, accept/decline)
- Escrow.com integration for closing deals

---

## 13. Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time to list a website | < 5 minutes |
| Time for buyer to contact seller | < 2 minutes (no signup friction) |
| All listing pages indexed by Google | Yes (SSR, no auth wall) |
| Listing page LCP | < 1.5s |

---

## 14. Slug Strategy

Auto-generate from title + short ID suffix: `niche-recipe-blog-a3f2`
- Keeps URLs readable and shareable
- Suffix prevents collisions without requiring unique titles
- Slug is set at publish time and does not change if title is edited
