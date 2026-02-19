import { Resend } from "resend"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "noreply@example.com"
}

export async function sendInquiryEmail({
  sellerEmail,
  sellerName,
  buyerName,
  buyerEmail,
  message,
  listingTitle,
  listingUrl,
}: {
  sellerEmail: string
  sellerName: string
  buyerName: string
  buyerEmail: string
  message: string
  listingTitle: string
  listingUrl: string
}) {
  await getResend().emails.send({
    from: getFrom(),
    to: sellerEmail,
    replyTo: buyerEmail,
    subject: `New inquiry on "${listingTitle}"`,
    html: `
      <p>Hi ${sellerName},</p>
      <p>You have a new inquiry on your listing <strong>${listingTitle}</strong>.</p>
      <hr />
      <p><strong>From:</strong> ${buyerName} (${buyerEmail})</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">${message.replace(/\n/g, "<br/>")}</blockquote>
      <hr />
      <p>Reply directly to this email to respond to ${buyerName}.</p>
      <p><a href="${listingUrl}">View listing</a></p>
    `,
  })
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string
  resetUrl: string
}) {
  await getResend().emails.send({
    from: getFrom(),
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset. Click the link below to set a new password.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  })
}
