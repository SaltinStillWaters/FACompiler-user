const toastContainer = document.createElement('div');
toastContainer.id = 'toast';
toastContainer.style.cssText = `
  visibility: hidden;
  min-width: 200px;
  margin: 0 auto;
  background-color:#bfc2bf;
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
  transition: opacity 0.5s ease, visibility 0s linear 0.5s;
`;


document.body.appendChild(toastContainer);

/**
 * Displays a toast message with smooth fade-in and fade-out.
 * @param {string} message - The message to display in the toast.
 * @param {number} duration - Duration (in milliseconds) the toast is visible.
 */
function showToast(message: string, bgColor = '#f57a7a', duration = 5000) {
  const toast = document.getElementById('toast');
  if (!toast) {
    return
  }

  toast.textContent = message;
  toast.style.backgroundColor = bgColor;
  toast.style.visibility = 'visible';
  toast.style.opacity = '1';


  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.visibility = 'hidden';
    }, 1000);
  }, duration);
}