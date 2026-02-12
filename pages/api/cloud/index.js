import { createRouter } from "next-connect";
import multer from "multer";
import cloudinary from "../../lib/cloudinary";
import { verifyToken } from "../../lib/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const apiRoute = createRouter();

// OPTIONS handler
apiRoute.all((req, res, next) => {
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Multer middleware
apiRoute.use(upload.single("file"));

// Auth middleware
apiRoute.use((req, res, next) => {
  try {
    verifyToken(req);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// POST upload
apiRoute.post(async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!file.mimetype.startsWith("image/"))
      return res.status(400).json({ message: "Invalid file type" });

    let type = req.body?.type;
    if (Array.isArray(type)) type = type[0];

    // Extended allowed types
    const allowedTypes = [
      "avatar",
      "project_before",
      "project_after",
      "partner",
    ];
    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid or missing image type",
        allowed: allowedTypes,
      });
    }

    // Folder map
    const folderMap = {
      avatar: "avatars",
      project_before: "projects/before",
      project_after: "projects/after",
      partner: "partners",
    };
    const folder = folderMap[type] || "misc";

    // Base64 upload (avoids stream timeout)
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, { folder });

    console.log("Upload success:", result.secure_url);

    res.status(200).json({
      url: result.secure_url,
      type,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      message: "Upload failed",
      error: err.message || err,
    });
  }
});

// GET health check
apiRoute.get((req, res) =>
  res.status(200).json({ status: "Upload service alive" }),
);

export default apiRoute.handler();
export const config = { api: { bodyParser: false } };
