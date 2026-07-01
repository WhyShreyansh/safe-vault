import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: true },
    mimeType: { type: String, default: "application/octet-stream" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;