/**
 * Optimizes image URLs for faster loading
 * @param {string} imageUrl - The original image URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.quality - Quality setting (auto, good, best, eco)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return null;

  const {
    width = null,
    height = null,
    quality = "auto:good",
    crop = "fill",
  } = options;

  // If it's a Cloudinary URL, add transformations
  if (imageUrl.includes("cloudinary.com") && imageUrl.includes("/upload/")) {
    const parts = imageUrl.split("/upload/");
    if (parts.length === 2) {
      const baseUrl = parts[0];
      const imagePath = parts[1];

      // Build transformation string
      const transformations = [];
      
      if (width && height) {
        transformations.push(`w_${width},h_${height},c_${crop}`);
      } else if (width) {
        transformations.push(`w_${width}`);
      } else if (height) {
        transformations.push(`h_${height}`);
      }

      transformations.push(`q_${quality}`);
      transformations.push("f_auto"); // Auto format (WebP when supported)
      transformations.push("dpr_auto"); // Auto device pixel ratio

      const transformString = transformations.join(",");
      return `${baseUrl}/upload/${transformString}/${imagePath}`;
    }
  }

  // Return original URL if not Cloudinary
  return imageUrl;
};

/**
 * Get optimized profile photo URL
 */
export const getOptimizedProfilePhoto = (photoUrl, size = 100) => {
  if (!photoUrl) return null;
  return optimizeImageUrl(photoUrl, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto:good",
  });
};

/**
 * Get optimized message image URL (thumbnail)
 */
export const getOptimizedMessageImage = (imageUrl, width = 400) => {
  if (!imageUrl) return null;
  return optimizeImageUrl(imageUrl, {
    width: width,
    height: width,
    crop: "limit",
    quality: "auto:good",
  });
};

/**
 * Get optimized full-size image URL
 */
export const getOptimizedFullImage = (imageUrl) => {
  if (!imageUrl) return null;
  return optimizeImageUrl(imageUrl, {
    quality: "auto:best",
  });
};

/**
 * Preload an image
 */
export const preloadImage = (imageUrl) => {
  if (!imageUrl) return;
  const img = new Image();
  img.src = imageUrl;
};

