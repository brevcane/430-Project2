/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  const errorMessageElement = document.getElementById('errorMessage');
  const MessageElement = document.getElementById('Message');

  errorMessageElement.textContent = message;
  MessageElement.classList.remove('hidden');
  MessageElement.classList.add('visible'); 
};

/* Sends post requests to the server using fetch. Will look for various
 entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });

  const result = await response.json();
  const MessageElement = document.getElementById('Message');
  MessageElement.classList.add('hidden');
  MessageElement.classList.remove('visible'); 

  if (result.redirect) {
      window.location = result.redirect;
  }

  if (result.error) {
      handleError(result.error);
  }

  if (handler) {
      handler(result);
  }
};

const hideError = () => {
  document.getElementById('Message').classList.add('hidden');
  document.getElementById('Message').classList.remove('visible'); 
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};
