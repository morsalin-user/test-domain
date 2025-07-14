import mongoose from "mongoose"

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["plugins", "servers", "mods", "maps", "textures", "other"],
  },
  downloadLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const allowedDomains = ["mediafire.com", "mega.nz", "gofile.io"]
        try {
          const url = new URL(v)
          return allowedDomains.some((domain) => url.hostname.includes(domain))
        } catch {
          return false
        }
      },
      message: "Download link must be from MediaFire, MEGA, or GoFile.io",
    },
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  downloads: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Content || mongoose.model("Content", ContentSchema)
