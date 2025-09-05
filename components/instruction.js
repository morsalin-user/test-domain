// components/instruction.js
"use client"

export default function Instruction() {
  const steps = [
    "1. Browse and discover curated video content.",
    "2. Filter videos by category to find what you need.",
    "3. Enjoy smooth playback with a modern interface.",
    "4. Stay updated with the latest uploads instantly.",
    "5. Engage with our growing library anytime, anywhere."
  ]

  return (
    <section className="w-full mb-8">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
          <h2 className="text-lg font-semibold text-neutral-100">How It Works</h2>
        </div>
        <ul className="space-y-2 text-neutral-300 text-sm">
          {steps.map((line, i) => (
            <li key={i} className="hover:text-amber-400 transition-colors">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
