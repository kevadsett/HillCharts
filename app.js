// const { createApp } = Vue

// createApp({
//   data() {
//     return {
//       message: 'Hello Vue!'
//     }
//   }
// })

function copyDisabledInput(inputId) {
  // Get the disabled input field
  var input = document.getElementById(inputId);

  // Create a new text field
  var tempInput = document.createElement('input');

  // Set the value of the new text field to the value of the disabled input field
  tempInput.value = input.value;

  // Add the new text field to the page
  document.body.appendChild(tempInput);

  // Select the text in the new text field
  tempInput.select();

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the new text field from the page
  document.body.removeChild(tempInput);
}