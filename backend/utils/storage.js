import fs from "fs";
import path from "path";

export function ensureDataFiles() {
  const uploadsDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}