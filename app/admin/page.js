// admin/page.js
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getDb } from "../../lib/mongodb"
import VideoManager from "./VideoManager"

const CATEGORIES = ["Humor", "Supportive", "Criticism", "Sarcasm", "Affirmation", "Accolade", "Emotional", "Inquisitive", "Rude", "Self-Promotion"]

async function getVideos(page = 1, limit = 10) {
  const db = await getDb()
  const skip = (page - 1) * limit
  
  const [videos, totalCount] = await Promise.all([
    db.collection("files").find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection("files").countDocuments({})
  ])
  
  return {
    videos: videos.map(video => ({
      ...video,
      _id: video._id.toString()
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  }
}

export default async function AdminPage(props) {
  const searchParams = await props.searchParams
  
  const user = await currentUser()
  if (!user) {
    const signin = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login"
    redirect(signin)
  }
  
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ""
  if ((email || "").toLowerCase() !== adminEmail) redirect("/")

  const page = parseInt(searchParams?.page) || 1
  const { videos, totalCount, totalPages, currentPage } = await getVideos(page)

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-neutral-100 mb-6">Admin Dashboard</h1>
      
      {/* Upload Form */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-neutral-200 mb-4">Upload New Media</h2>
        <form
          action="/api/admin/save"
          method="post"
          encType="multipart/form-data"
          className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4"
        >
          <div>
            <label className="block text-neutral-300 mb-2">Title</label>
            <input
              name="title"
              type="text"
              placeholder="Enter a title"
              className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Optional description"
              className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2 outline-none focus:ring-2 focus:ring-amber-600 min-h-24"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-2">Category</label>
            <select name="category" className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2">File type</label>
            <select
              name="fileType"
              className="w-full bg-neutral-800 text-neutral-200 rounded-md p-2"
              defaultValue="video"
            >
              <option value="video">Video</option>
              <option value="file">File</option>
            </select>
            <p className="text-sm text-neutral-400 mt-1">Choose Video for mp4 uploads or File for other assets.</p>
          </div>

          <div>
            <label className="block text-neutral-300 mb-2">File</label>
            <input
              type="file"
              name="file"
              accept="video/*,application/*"
              required
              className="block w-full text-neutral-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded-md">
            Upload
          </button>
        </form>
      </div>

      {/* Video Management */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-neutral-200">
            Manage Media ({totalCount} items)
          </h2>
        </div>
        <VideoManager 
          videos={videos} 
          totalPages={totalPages} 
          currentPage={currentPage} 
        />
      </div>
    </main>
  )
}