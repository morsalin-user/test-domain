// admin/panel.js

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
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteAllInput, setDeleteAllInput] = useState("")
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)

  const videosPerPage = 10
  const { data, mutate } = useSWR(`/api/files?page=${currentPage}&limit=${videosPerPage}&all=true`, fetcher)

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

  async function onDelete(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    try {
      const res = await fetch(`/api/admin/delete/${id}`, { method: "DELETE" })
      if (res.ok) {
        mutate()
        setMessage("Video deleted successfully")
      } else {
        setMessage("Failed to delete video")
      }
    } catch (error) {
      setMessage("Error deleting video")
    }
  }

  async function onDeleteAll() {
    if (deleteAllInput !== "i want to delete all the videos") {
      alert("Please type the exact phrase: 'i want to delete all the videos'")
      return
    }

    try {
      const res = await fetch("/api/admin/delete-all", { method: "DELETE" })
      if (res.ok) {
        mutate()
        setMessage("All videos deleted successfully")
        setShowDeleteAllModal(false)
        setDeleteAllInput("")
        setCurrentPage(1)
      } else {
        setMessage("Failed to delete all videos")
      }
    } catch (error) {
      setMessage("Error deleting all videos")
    }
  }

  const files = data?.files || []
  const totalPages = Math.ceil((data?.total || 0) / videosPerPage)

  return (
    <div className="space-y-6">
      {/* Upload Form */}
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
          <div className="text-sm font-semibold">Upload Statistics</div>
          <div className="mt-3 space-y-2 text-sm text-foreground/70">
            <div>Total files: {data?.total || 0}</div>
            <div>Current page: {currentPage} of {totalPages}</div>
            <div>Files per page: {videosPerPage}</div>
            {data?.debug && (
              <>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="text-xs font-medium text-foreground/60 mb-1">Debug Info:</div>
                  <div>Videos collection: {data.debug.videosCount}</div>
                  <div>Files collection: {data.debug.filesCount}</div>
                  <div>Using: {data.debug.usingCollection}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Video Management */}
      <div className="rounded border bg-background p-4 border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold">Manage Videos ({data?.total || 0})</div>
          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="rounded bg-destructive px-3 py-2 text-sm text-destructive-foreground hover:opacity-90"
            disabled={files.length === 0}
          >
            Delete All Videos
          </button>
        </div>

        {/* Video Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div key={file._id} className="rounded border bg-background/50 p-3 border-border">
              {/* Video Preview */}
              {file.fileType === 'video' && file.secureUrl && (
                <video
                  src={file.secureUrl}
                  className="w-full h-32 object-cover rounded mb-2"
                  controls={false}
                  muted
                />
              )}
              
              {/* File Info */}
              <div className="space-y-1">
                <div className="font-medium text-sm truncate" title={file.title}>
                  {file.title}
                </div>
                <div className="text-xs text-foreground/60">
                  {file.category} • {file.fileType}
                </div>
                {file.description && (
                  <div className="text-xs text-foreground/50 line-clamp-2">
                    {file.description}
                  </div>
                )}
                <div className="text-xs text-foreground/40">
                  {new Date(file.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onDelete(file._id, file.title)}
                  className="flex-1 rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground hover:opacity-90"
                >
                  Delete
                </button>
                {file.secureUrl && (
                  <a
                    href={file.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:opacity-90"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="py-8 text-center text-sm text-foreground/70">
            No files found.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded bg-secondary px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:opacity-90'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded bg-secondary px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete All Videos</h3>
            <p className="text-sm text-foreground/70 mb-4">
              This action cannot be undone. To confirm, please type:
            </p>
            <p className="text-sm font-mono bg-secondary px-2 py-1 rounded mb-4">
              i want to delete all the videos
            </p>
            <input
              type="text"
              value={deleteAllInput}
              onChange={(e) => setDeleteAllInput(e.target.value)}
              className="w-full rounded border bg-input px-3 py-2 text-foreground placeholder-foreground/50 border-border mb-4"
              placeholder="Type the phrase above"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteAllModal(false)
                  setDeleteAllInput("")
                }}
                className="flex-1 rounded bg-secondary px-3 py-2 text-sm hover:opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteAll}
                className="flex-1 rounded bg-destructive px-3 py-2 text-sm text-destructive-foreground hover:opacity-90"
                disabled={deleteAllInput !== "i want to delete all the videos"}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}