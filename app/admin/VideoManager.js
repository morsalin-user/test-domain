// admin/VideoManager.js
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VideoManager({ videos, totalPages, currentPage }) {
  const router = useRouter()
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleteAllInput, setDeleteAllInput] = useState("")
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteSingle = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/admin/delete-single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId })
      })

      if (response.ok) {
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert("Failed to delete video")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    if (deleteAllInput !== "i want to delete all the videos") {
      alert("Please type exactly: 'i want to delete all the videos'")
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/admin/delete-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      if (response.ok) {
        setShowDeleteAll(false)
        setDeleteAllInput("")
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert("Failed to delete all videos")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "Unknown"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Delete All Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowDeleteAll(true)}
          disabled={isDeleting || videos.length === 0}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-medium rounded-md"
        >
          Delete All Videos
        </button>
      </div>

      {/* Delete All Modal */}
      {showDeleteAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-100 mb-4">
              Delete All Videos
            </h3>
            <p className="text-neutral-300 mb-4">
              This will permanently delete all videos and cannot be undone. 
              To confirm, please type: <strong>"i want to delete all the videos"</strong>
            </p>
            <input
              type="text"
              value={deleteAllInput}
              onChange={(e) => setDeleteAllInput(e.target.value)}
              placeholder="Type confirmation here"
              className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 mb-4 outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting || deleteAllInput !== "i want to delete all the videos"}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-md"
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteAll(false)
                  setDeleteAllInput("")
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          No videos uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
              {/* Video Preview */}
              {video.fileType === "video" && (
                <div className="aspect-video bg-neutral-800">
                  <video
                    src={video.secureUrl}
                    className="w-full h-full w-full h-full object-contain"
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                    style={{ maxHeight: '280px', minHeight: '280px' }}
                  />
                </div>
              )}

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-neutral-100 mb-2 truncate">
                  {video.title}
                </h3>
                
                {video.description && (
                  <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="space-y-1 text-xs text-neutral-500">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{video.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{video.fileType}</span>
                  </div>
                  {video.duration && (
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  )}
                  {video.width && video.height && (
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span>{video.width}x{video.height}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(video.bytes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteSingle(video._id)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white text-sm rounded"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {currentPage > 1 && (
            <button
              onClick={() => router.push(`/admin?page=${currentPage - 1}`)}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded"
            >
              Previous
            </button>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => router.push(`/admin?page=${page}`)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-amber-600 text-black"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
              }`}
            >
              {page}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button
              onClick={() => router.push(`/admin?page=${currentPage + 1}`)}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  )
}