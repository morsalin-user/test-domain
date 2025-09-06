export default function AboutPage() {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="bg-neutral-900 rounded-lg border border-neutral-800 p-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <h1 className="text-2xl font-semibold text-neutral-100">About Us</h1>
          </div>
          <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
            <p>
              Welcome to our platform — a curated library of videos designed to inspire,
              educate, and entertain.
            </p>
            <p>
              Our mission is to make it simple for users to discover and enjoy high-quality
              content, organized into categories that suit every interest.
            </p>
            <p>
              With smooth performance, intuitive filters, and a modern UI, we provide a
              distraction-free viewing experience.
            </p>
            <p>
              We are constantly growing our library to bring you the latest and most relevant
              uploads.
            </p>
            <p>
              Thank you for being part of our journey — your support keeps us building and
              innovating every day.
            </p>
          </div>
        </section>
      </main>
    )
  }
  