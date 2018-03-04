(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  var options = INSTALL_OPTIONS
  var element

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement () {
    element = INSTALL.createElement(options.location, element)

    Pappwords.onLoad();
    // PappwordsConfig.MESSAGE = options.message;
    // PappwordsConfig.PREVENT_SUBMIT = options.preventSubmit;
    // PappwordsConfig.FAILURE_PERCENTAGE = options.failurePercentage;
    // PappwordsConfig.CLEAR_PASSWORD_FIELDS = options.clearPasswords;

    element.setAttribute("MESSAGE", options.message);
    element.setAttribute("PREVENT_SUBMIT", options.preventSubmit);
    element.setAttribute("FAILURE_PERCENTAGE", options.failurePercentage);
    element.setAttribute("CLEAR_PASSWORD_FIELDS", options.clearPasswords);

    // Set the app attribute to your app's dash-delimited alias.

    // element.setAttribute('app', 'example')
    // element.innerHTML = options.message
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions

      PappwordsConfig.MESSAGE = options.message;
      PappwordsConfig.PREVENT_SUBMIT = options.preventSubmit;
      PappwordsConfig.FAILURE_PERCENTAGE = options.failurePercentage;
      PappwordsConfig.CLEAR_PASSWORD_FIELDS = options.clearPasswords;
  
      updateElement()
    }
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }
}())
