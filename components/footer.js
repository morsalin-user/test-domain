"use client"

import useSWR from "swr"

const fetcher = (url) => fetch(url).then((r) => (r.ok ? r.text() : ""))

export default function Footer() {
  const { data: text = "" } = useSWR("/pasted-text.txt", fetcher, { revalidateOnFocus: false })

  return (
    <footer className="mt-16 border-t border-neutral-800 bg-neutral-900 ">
      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-lg bg-neutral-800 text-neutral-200 p-6 leading-relaxed whitespace-pre-wrap">
          {text || " "}
        </div>
      </div>
    </footer>
  )
}
