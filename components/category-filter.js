"use client"
export default function CategoryFilter({ categories = [], value = "all", onChange }) {
  const all = ["all", ...categories]
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {all.map((c) => (
        <button
          key={c}
          onClick={() => onChange?.(c)}
          className={`px-3 py-1.5 rounded-full text-sm ${
            value === c ? "bg-amber-600 text-black" : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
