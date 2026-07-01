import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import File from "../models/File.js";

const uploadsDir = path.join(process.cwd(), "uploads");

// UPLOAD FILE
export const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const userId = req.user.id;
    const savedFiles = [];

    for (const file of req.files) {
      const existingVersions = await File.find({
        userId,
        originalName: file.originalname,
      }).sort({ version: -1 });

      const lastVersion = existingVersions.length > 0 ? existingVersions[0].version : 0;
      const newVersion = lastVersion + 1;

      await File.updateMany(
        { userId, originalName: file.originalname },
        { $set: { isLatest: false } }
      );

      const filename = `${uuidv4()}-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, file.buffer);

      const newFile = await File.create({
        userId,
        filename,
        originalName: file.originalname,
        size: file.size,
        uploadDate: new Date(),
        version: newVersion,
        isDeleted: false,
        isLatest: true,
        mimeType: file.mimetype,
      });

      savedFiles.push(newFile);
    }

    return res.json({ message: "Files uploaded", files: savedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import File from "../models/File.js";

const uploadsDir = path.join(process.cwd(), "uploads");

// UPLOAD FILE
export const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const userId = req.user.id;
    const savedFiles = [];

    for (const file of req.files) {
      const existingVersions = await File.find({
        userId,
        originalName: file.originalname,
      }).sort({ version: -1 });

      const lastVersion = existingVersions.length > 0 ? existingVersions[0].version : 0;
      const newVersion = lastVersion + 1;

      await File.updateMany(
        { userId, originalName: file.originalname },
        { $set: { isLatest: false } }
      );

      const filename = `${uuidv4()}-${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, file.buffer);

      const newFile = await File.create({
        userId,
        filename,
        originalName: file.originalname,
        size: file.size,
        uploadDate: new Date(),
        version: newVersion,
        isDeleted: false,
        isLatest: true,
        mimeType: file.mimetype,
      });

      savedFiles.push(newFile);
    }

    return res.json({ message: "Files uploaded", files: savedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};