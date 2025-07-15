import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    enum: ["content", "request"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    id: String,
    name: String,
    username: String,
    email: String,
    picture: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema)
