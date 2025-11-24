// Utility functions for handling images and profile photos

const API_BASE_URL = "http://localhost:5000";

/**
 * Get the profile photo URL for a user
 * @param {string} profilePhoto - The profile photo filename from the database
 * @param {string} name - The user's name for fallback avatar
 * @returns {string} The complete URL for the profile photo
 */
export const getProfilePhotoUrl = (profilePhoto, name = "default") => {
  if (profilePhoto) {
    return `${API_BASE_URL}/uploads/${profilePhoto}`;
  }
  // Fallback to a professional-looking initials avatar
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=FFFFFF&bold=true&length=2&format=svg`;
};

/**
 * Handle image load errors by setting a fallback avatar
 * @param {Event} e - The error event
 * @param {string} name - The user's name for fallback avatar
 */
export const handleImageError = (e, name = "default") => {
  const encodedName = encodeURIComponent(name || "User");
  e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=FFFFFF&bold=true&length=2&format=svg`;
}; 