import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { NewListingForm } from "@/components/dashboard/NewListingForm"

export default async function NewListingPage() {
  const session = await getSession()
  if (!session) redirect("/login")
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Create a listing</h1>
      <p className="text-muted-foreground mb-8">Fill in the details about the website you&apos;re selling.</p>
      <NewListingForm />
    </div>
  )
}
