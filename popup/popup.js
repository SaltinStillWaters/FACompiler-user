document.getElementById('submitButton').addEventListener('click', () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'activateExport'
      }, 
      (response) => {
        if (response.error) {
          console.error(response.error);
          reject(response.error);
        } else {
          resolve(response.result)
        }
      }
    );
  });
});  