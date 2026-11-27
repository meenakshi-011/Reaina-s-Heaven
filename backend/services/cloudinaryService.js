import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";

// Parse CLOUDINARY_URL if provided: cloudinary://<api_key>:<api_secret>@<cloud_name>
const parseCloudinaryUrl = () => {
  const cldUrl = process.env.CLOUDINARY_URL || "";
  if (!cldUrl.startsWith("cloudinary://")) return null;

  try {
    const raw = cldUrl.replace("cloudinary://", "");
    const [credentials, cloudName] = raw.split("@");
    const [apiKey, apiSecret] = credentials.split(":");
    return { apiKey, apiSecret, cloudName };
  } catch (err) {
    console.warn("Failed to parse CLOUDINARY_URL:", err.message);
    return null;
  }
};

/**
 * Uploads an image either to Cloudinary (if configured)
 * or to local public storage as fallback.
 *
 * @param {string} base64Data - Data URL like "data:image/jpeg;base64,..."
 * @param {string} folder - Target folder/category
 * @param {string} caption - Optional image label
 * @param {string} requirementType - Optional requirement category
 */
export const uploadReferenceImage = async ({
  base64Data,
  folder = "customizations",
  caption = "",
  requirementType = "general",
}) => {
  if (!base64Data || typeof base64Data !== "string") {
    throw new Error("Invalid image data provided. Expected base64 data string.");
  }

  // Validate format and mime type
  const match = base64Data.match(/^data:(image\/(jpeg|png|webp|gif|svg\+xml));base64,/);
  if (!match) {
    // Check if it's already a hosted URL (e.g. Unsplash or Cloudinary)
    if (base64Data.startsWith("http://") || base64Data.startsWith("https://")) {
      return {
        url: base64Data,
        publicId: `ext-${Date.now()}`,
        caption,
        requirementType,
      };
    }
    throw new Error("Invalid image format. Supported formats: JPG, PNG, WEBP, GIF, SVG.");
  }

  const mimeType = match[1];
  const extension = mimeType.split("/")[1].replace("svg+xml", "svg");
  const rawBase64 = base64Data.replace(/^data:image\/\w+(\+xml)?;base64,/, "");
  const buffer = Buffer.from(rawBase64, "base64");

  // Max 15MB size check
  const maxBytes = 15 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error("Image exceeds maximum allowed size of 15MB.");
  }

  const cldConfig = parseCloudinaryUrl();

  // 1. Try uploading to Cloudinary if credentials exist
  if (cldConfig && cldConfig.apiKey && cldConfig.apiSecret && cldConfig.cloudName) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${cldConfig.apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      const formData = new URLSearchParams();
      formData.append("file", base64Data);
      formData.append("api_key", cldConfig.apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${cldConfig.cloudName}/image/upload`;
      const res = await axios.post(endpoint, formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      });

      if (res.data && res.data.secure_url) {
        return {
          url: res.data.secure_url,
          publicId: res.data.public_id,
          caption,
          requirementType,
        };
      }
    } catch (cldErr) {
      console.warn("Cloudinary upload failed or network unavailable, falling back to local storage:", cldErr.message);
    }
  }

  // 2. Safe local file fallback
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads", "customizations");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `ref_${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);

  const localUrl = `/public/uploads/customizations/${filename}`;
  return {
    url: localUrl,
    publicId: `local-${filename}`,
    caption,
    requirementType,
  };
};

export default {
  uploadReferenceImage,
};

