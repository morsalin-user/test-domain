// models/Content.js

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
  linkvertiseLink: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: (v) => {
        if (!v) return true // Empty string is valid
        try {
          new URL(v)
          return true
        } catch {
          return false
        }
      },
      message: "Linkvertise link must be a valid URL",
    },
  },
  image: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: (v) => {
        if (!v) return true // Empty string is valid
        return v.startsWith('data:image/')
      },
      message: "Image must be a valid base64 data URL",
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
ContentSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Content || mongoose.model("Content", ContentSchema)
