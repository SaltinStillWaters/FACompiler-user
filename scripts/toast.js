// Create and style the toast container
const toastContainer = document.createElement('div');
toastContainer.id = 'toast';
toastContainer.style.cssText = `
  visibility: hidden;
  min-width: 200px;
  margin: 0 auto;
  background-color: #f57a7a; /* Slightly transparent */
  color: #000;
  text-align: center;
  border-radius: 5px;
  padding: 16px;
  position: fixed;
  z-index: 10000;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0; /* Fully transparent initially */
  transition: opacity 0.5s ease, visibility 0s linear 0.5s; /* Smooth fade effect */
`;

// Append the toast container to the document body
document.body.appendChild(toastContainer);

/**
 * Displays a toast message with smooth fade-in and fade-out.
 * @param {string} message - The message to display in the toast.
 * @param {number} duration - Duration (in milliseconds) the toast is visible.
 */
function showToast(message, duration = 5000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.visibility = 'visible'; // Make the toast visible
  toast.style.opacity = '1'; // Fade in

  // Hide the toast after the specified duration
  setTimeout(() => {
    toast.style.opacity = '0'; // Fade out
    setTimeout(() => {
      toast.style.visibility = 'hidden'; // Hide completely after fade-out
    }, 1000); // Match the fade-out duration
  }, duration);
}