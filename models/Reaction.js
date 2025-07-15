import mongoose from "mongoose"

const ReactionSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    enum: ["content", "request"],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  reaction: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure one reaction per user per content
ReactionSchema.index({ contentId: 1, userId: 1 }, { unique: true })

export default mongoose.models.Reaction || mongoose.model("Reaction", ReactionSchema)
