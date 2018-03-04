(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  var options = INSTALL_OPTIONS
  var element

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement () {
    element = document.getElementsByTagName("cloudflare-app");
    if (element == null || element.length == 0) {
      element = document.createElement('cloudflare-app');
      document.body.appendChild(element);
    }

    element.setAttribute("MESSAGE", options.message);
    element.setAttribute("WARN_ONLY", options.warnOnly);
    element.setAttribute("FAILURE_PERCENTAGE", options.failurePercentage);
    element.setAttribute("CLEAR_PASSWORD_FIELDS", options.clearPasswords);

    Pappwords.onLoad();
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions
  
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
