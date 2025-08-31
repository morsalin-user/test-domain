"use client"

import useSWR from "swr"
import { useState } from "react"
const fetcher = (url) => fetch(url).then((r) => r.json())

export default function AdminPanel() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Humor")
  const [type, setType] = useState("video")
  const [message, setMessage] = useState(null)

  const { data, mutate } = useSWR("/api/files?limit=100&all=true", fetcher)

  async function onUpload(e) {
    e.preventDefault()
    if (!file) {
      setMessage("Please select a file")
      return
    }
    const fd = new FormData()
    fd.append("file", file)
    fd.append("title", title)
    fd.append("description", description)
    fd.append("category", category)
    fd.append("type", type)
    setMessage("Uploading...")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    if (!res.ok) {
      setMessage("Upload failed")
    } else {
      setMessage("Uploaded!")
      setFile(null)
      setTitle("")
      setDescription("")
      mutate()
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this file?")) return
    const res = await fetch(`/api/admin/files/${id}`, { method: "DELETE" })
    if (res.ok) mutate()
  }

  const files = data?.files || []

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={onUpload} className="space-y-3 rounded border bg-background p-4 border-border">
        <div className="text-sm font-semibold">Upload new</div>
        <input
          type="file"
          accept="video/*,image/*,.zip,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded border bg-input px-3 py-2 text-foreground border-border file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border bg-input px-3 py-2 text-foreground placeholder-foreground/50 border-border"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border bg-input px-3 py-2 text-foreground placeholder-foreground/50 border-border"
        />
        <div className="flex gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 rounded border bg-input px-3 py-2 text-foreground border-border"
          >
            {["Humor", "Praise", "Retorts", "Tutorials", "Announcements", "Reactions", "Misc"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-32 rounded border bg-input px-3 py-2 text-foreground border-border"
          >
            <option value="video">Video</option>
            <option value="file">File</option>
          </select>
        </div>
        <button className="w-full rounded bg-primary px-3 py-2 font-medium text-primary-foreground hover:opacity-90 transition">
          Upload
        </button>
        {message && <p className="text-sm text-foreground/80">{message}</p>}
      </form>

      <div className="rounded border bg-background p-4 border-border">
        <div className="text-sm font-semibold">Manage files</div>
        <ul className="mt-3 divide-y divide-border">
          {files.map((f) => (
            <li key={f._id} className="flex items-center justify-between py-2">
              <div className="min-w-0">
                <div className="truncate text-sm">{f.title}</div>
                <div className="text-xs text-foreground/60">
                  {f.category} • {f.type}
                </div>
              </div>
              <button
                onClick={() => onDelete(f._id)}
                className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground hover:opacity-90"
              >
                Delete
              </button>
            </li>
          ))}
          {files.length === 0 && <li className="py-3 text-sm text-foreground/70">No files yet.</li>}
        </ul>
      </div>
    </div>
  )
}
