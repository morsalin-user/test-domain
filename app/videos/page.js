import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Gallery from "@/components/gallery"

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-foreground">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <p className="mt-2 text-foreground/80">Organized and easy to browse by category.</p>
      </section>
      <div className="mt-8 mx-8">
        <Gallery />
      </div>
      <Footer />
    </main>
  )
}
