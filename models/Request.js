import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema({
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
  price: {
    type: String,
    default: "",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  author: {
    id: String,
    name: String,
    email: String,
    picture: String,
  },
  status: {
    type: String,
    enum: ["open", "fulfilled", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Request || mongoose.model("Request", RequestSchema)
