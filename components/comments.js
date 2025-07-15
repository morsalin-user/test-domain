"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { showToast } from "./toast"

export function Comments({ contentId, type = "content" }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadComments()
  }, [contentId])

  const loadComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${type}/${contentId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Failed to load comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      showToast("Please login to comment", "error")
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/${type}/${contentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
        showToast("Comment added!", "success")
      }
    } catch (error) {
      showToast("Failed to add comment", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`/api/${type}/${contentId}/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setComments(comments.filter((c) => c._id !== commentId))
        showToast("Comment deleted", "success")
      }
    } catch (error) {
      showToast("Failed to delete comment", "error")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-purple-100">Comments ({comments.length})</h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            {user.picture && (
              <img
                src={user.picture || "/placeholder.svg"}
                alt="Your avatar"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="textarea w-full min-h-[80px]"
                disabled={submitting}
              />
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={submitting || !newComment.trim()} className="btn btn-primary">
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 bg-purple-900/10 rounded-lg">
          <p className="text-gray-400 mb-4">Please login to leave a comment</p>
          <a href="/upload" className="btn btn-primary">
            Login
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-purple-100">Loading comments...</div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-purple-900/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {comment.author.picture && (
                  <img
                    src={comment.author.picture || "/placeholder.svg"}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-purple-100">
                      {comment.author.name || comment.author.username}
                    </span>
                    <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    {user && (user.id === comment.author.id || user.isAdmin) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-400 hover:text-red-300 text-sm ml-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
