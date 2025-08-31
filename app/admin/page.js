import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cloudinary } from "../../lib/cloudinary"
import { getDb } from "../../lib/mongodb"

const CATEGORIES = ["character", "animals", "tech", "business", "funny", "sketch", "other"]

export default async function AdminPage({ searchParams }) {
  const user = await currentUser()
  if (!user) {
    const signin = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login"
    redirect(signin)
  }
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ""
  if ((email || "").toLowerCase() !== adminEmail) redirect("/")

  // Safely handle searchParams
  let uploadSuccess = false
  try {
    const resolvedSearchParams = await Promise.resolve(searchParams)
    uploadSuccess = resolvedSearchParams?.uploaded === "1"
  } catch (error) {
    console.warn("Error resolving searchParams:", error)
    uploadSuccess = false
  }

  // Server Action for upload (executes with user session)
  async function uploadAction(formData) {
    "use server"
    const me = await currentUser()
    if (!me) {
      const signinUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login"
      redirect(signinUrl)
    }

    // Access adminEmail directly from environment variable in Server Action
    const adminEmailInAction = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "email@example.com").toLowerCase()
    const meEmail = me.primaryEmailAddress?.emailAddress || me.emailAddresses?.[0]?.emailAddress || ""
    if ((meEmail || "").toLowerCase() !== adminEmailInAction) {
      redirect("/") // not admin
    }

    const category = String(formData.get("category") || "other")
    const file = formData.get("file")
    if (!file || typeof file === "string") {
      console.error("No file provided or file is string")
      revalidatePath("/admin")
      return
    }

    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type
    })

    let uploadResult, db

    try {
      // Upload to Cloudinary as video
      const buffer = Buffer.from(await file.arrayBuffer())
      console.log("Buffer size:", buffer.length)

      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              type: "upload",
              folder: "media-vault/videos",
              overwrite: false,
              chunk_size: 6000000, // 6MB chunks for large files
            },
            (err, result) => {
              if (err) {
                console.error("Cloudinary error:", err)
                reject(err)
              } else {
                console.log("Cloudinary upload success:", result?.public_id)
                resolve(result)
              }
            },
          )
          .end(buffer)
      })

      db = await getDb()
      const doc = {
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        mp4Url: uploadResult.secure_url,
        category,
        createdAt: new Date(),
        resourceType: "video",
        deliveryType: "upload",
        bytes: uploadResult.bytes,
        duration: uploadResult.duration,
        width: uploadResult.width,
        height: uploadResult.height,
        uploaderId: me.id,
      }
      await db.collection("files").insertOne(doc)
      console.log("Database insert success")

    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })

      // Only handle actual upload/database errors, not redirects
      if (!error.message.includes('NEXT_REDIRECT')) {
        revalidatePath("/admin")
        throw new Error(`Upload failed: ${error.message}`)
      }
      // Re-throw redirect errors so Next.js can handle them properly
      throw error
    }

    // Success - refresh and redirect (outside try/catch to avoid catching redirect)
    revalidatePath("/")
    revalidatePath("/admin")
    redirect("/admin?uploaded=1")
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-neutral-100 mb-6">Admin Upload</h1>

      <div className="mb-6 p-4 bg-amber-600 border border-amber-700 rounded-lg">
        <p className="text-green-200 font-medium">Click upload and wait a few seconds to see success message!</p>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
          <p className="text-green-200 font-medium">✅ Uploaded successfully!</p>
        </div>
      )}

      <form
        action={uploadAction}
        className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4"
        key={uploadSuccess ? "reset" : "form"} // This will reset the form when uploadSuccess changes
      >
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
          <label className="block text-neutral-300 mb-2">Video file</label>
          <input
            type="file"
            name="file"
            accept="video/*"
            required
            className="block w-full text-neutral-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
          />
          <p className="text-sm text-neutral-400 mt-1">Only video files are allowed.</p>
        </div>
        <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded-md">
          Upload
        </button>
      </form>
    </main>
  )
}