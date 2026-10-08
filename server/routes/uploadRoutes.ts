import express, { NextFunction, Request, Response } from "express";
import auth from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

/** Max image size accepted by the upload endpoint. */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/** Cloudinary folder where all product images are stored. */
const CLOUDINARY_FOLDER = "grocery-del";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE },
});

/**
 * Wrap multer so its errors (oversized file, malformed multipart, ...)
 * surface as a 400 instead of bubbling up to the global error handler as a 500.
 */
const parseImage = (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err: any) => {
        if (!err) return next();

        const message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Image must be 5MB or smaller"
                : err.message || "Invalid image upload";

        return res.status(400).json({ message });
    });
};

const isCloudinaryConfigured = () =>
    Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
    );

/**
 * POST /api/upload
 * Body: multipart form-data with an `image` file field.
 * Returns: { url } where url is a Cloudinary CDN URL.
 */
uploadRouter.post("/", auth, parseImage, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            return res
                .status(400)
                .json({ message: "Only image files are allowed" });
        }

        if (!isCloudinaryConfigured()) {
            return res.status(500).json({
                message:
                    "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
            });
        }

        const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
        )}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: CLOUDINARY_FOLDER,
            resource_type: "auto",
        });

        return res.json({ url: result.secure_url });
    } catch (error: any) {
        console.error("Cloudinary upload failed:", error?.message, {
            http_code: error?.http_code,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key_set: !!process.env.CLOUDINARY_API_KEY,
            api_secret_set: !!process.env.CLOUDINARY_API_SECRET,
        });

        if (error?.http_code === 403) {
            return res.status(500).json({
                message:
                    "Image upload rejected by Cloudinary (403). Check that your API key has the 'Image Upload' (create) permission.",
            });
        }

        if (error?.http_code === 401) {
            return res.status(500).json({
                message:
                    "Cloudinary authentication failed (401). Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
            });
        }

        return res
            .status(500)
            .json({ message: error?.message || "Image upload failed" });
    }
});

export default uploadRouter;
