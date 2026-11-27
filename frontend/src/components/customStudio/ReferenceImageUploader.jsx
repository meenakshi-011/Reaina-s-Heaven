import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const REQUIREMENT_TYPES = [
  { value: "cake_design", label: "Cake Design Reference" },
  { value: "color_palette", label: "Color Palette & Shades" },
  { value: "decoration_inspiration", label: "Decoration & Flowers" },
  { value: "packaging", label: "Packaging & Box Style" },
  { value: "typography", label: "Engraving / Font Reference" },
  { value: "general", label: "General Inspiration" },
];

const ReferenceImageUploader = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return reject(new Error("Not an image"));
      }

      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB size limit.`);
        return reject(new Error("File too large"));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target.result,
          base64Data: e.target.result,
          name: file.name,
          caption: "",
          requirementType: "general",
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (images.length + files.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} reference images.`);
      return;
    }

    setUploading(true);
    try {
      const processed = await Promise.all(files.map(processFile));
      onImagesChange([...images, ...processed]);
      toast.success(`${processed.length} image(s) attached!`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const handleCaptionChange = (index, caption) => {
    const updated = [...images];
    updated[index].caption = caption;
    onImagesChange(updated);
  };

  const handleTypeChange = (index, requirementType) => {
    const updated = [...images];
    updated[index].requirementType = requirementType;
    onImagesChange(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          isDragging
            ? "border-[#a67c52] bg-[#a67c52]/10 scale-[1.01]"
            : "border-[#e0d6cb] hover:border-[#a67c52]/60 bg-[#fbf9f6]"
        }`}
      >
        <input
          type="file"
          id="reference-upload-input"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <label
          htmlFor="reference-upload-input"
          className="cursor-pointer flex flex-col items-center justify-center space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#f4ece3] flex items-center justify-center text-[#a67c52] shadow-xs">
            <Upload size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-800">
              Drag & drop inspiration pictures, or <span className="text-[#a67c52] underline">browse files</span>
            </p>
            <p className="text-xs text-gray-400">
              Upload up to {maxImages} images (Pinterest screenshots, cake designs, color palettes, fonts). Max 10MB each.
            </p>
          </div>
        </label>
      </div>

      {/* Image Gallery List */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-xs relative group"
            >
              <img
                src={img.url}
                alt={`Reference ${i + 1}`}
                className="w-20 h-20 rounded-lg object-cover border border-gray-100 shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Image #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>

                <select
                  value={img.requirementType}
                  onChange={(e) => handleTypeChange(i, e.target.value)}
                  className="w-full text-xs py-1 px-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#a67c52]"
                >
                  {REQUIREMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Add note (e.g., love this flower arrangement)"
                  value={img.caption || ""}
                  onChange={(e) => handleCaptionChange(i, e.target.value)}
                  className="w-full text-xs py-1 px-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#a67c52]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferenceImageUploader;

