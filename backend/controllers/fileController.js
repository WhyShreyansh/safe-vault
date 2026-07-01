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

// GET ALL FILES
export const getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await File.find({ userId }).sort({ createdAt: -1 });
    return res.json({ files });
  } catch (error) {
    console.error("Get files error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET FILE BY ID
export const getFileByIdRoute = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file || file.userId.toString() !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.json({ file });
  } catch (error) {
    console.error("Get file by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};// GET FILE BY ID
export const getFileByIdRoute = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file || file.userId.toString() !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.json({ file });
  } catch (error) {
    console.error("Get file by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DOWNLOAD FILE
export const downloadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file || file.userId.toString() !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadsDir, file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing" });
    }

    return res.download(filePath, file.originalName);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// SOFT DELETE
export const deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file || file.userId.toString() !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    file.isLatest = false;
    await file.save();

    return res.json({ message: "File soft-deleted", file });
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};