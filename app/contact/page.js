export default function ContactPage() {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="bg-neutral-900 rounded-lg border border-neutral-800 p-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <h1 className="text-2xl font-semibold text-neutral-100">Contact Us</h1>
          </div>
  
          <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
            <p>
              We’d love to hear from you! You can reach us through the following
              contact details:
            </p>
  
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-400">📍 Address:</span>{" "}
                Placeholder Street, City, Country
              </li>
              <li>
                <span className="text-neutral-400">📧 Email:</span>{" "}
                contact@example.com
              </li>
              <li>
                <span className="text-neutral-400">📞 Phone:</span>{" "}
                +123 456 7890
              </li>
              <li>
                <span className="text-neutral-400">🌐 Website:</span>{" "}
                www.example.com
              </li>
            </ul>
          </div>
        </section>
      </main>
    )
  }
  