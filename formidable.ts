import formidable from "formidable";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("./uploads");
fs.mkdirSync(uploadDir, { recursive: true });

export const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 4,
  maxFileSize: 2_000 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});
