import { getContentById } from "@/lib/content"
import { notFound } from "next/navigation"
import { ContentPageClient } from "@/components/content-page-client"

export default async function ContentPage({ params }) {
  const content = await getContentById(params.id)

  if (!content) {
    notFound()
  }
  
  return <ContentPageClient content={content} />
}