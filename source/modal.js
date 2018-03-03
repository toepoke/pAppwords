var _overlay = null;
var _modal = null;
var _closeButton = null;
var _okButton = null;
var _modalHtml = null;
var _placeholder = null;
var _onClose = null;


/// Closes the dialog and removes from the DOM to prevent issues on the website being injected.
function closePwndDialog() {
  _modal.classList.add("fadeOut");  
  _overlay.classList.add("fadeOut");  
  document.body.removeChild(_placeholder);
  _placeholder = null;
  if (this._onClose) {
    this._onClose();
  }
} // close


/// Shows the overlay and dialog
function openPwndDialog(onCloseHandler) {
  attachDialog();
  _overlay.classList.remove("app-hide");
  _modal.classList.remove("app-hide");
  _overlay.classList.add("animated", "fadeIn");
  _modal.classList.add("animated", "fadeIn");
  if (onCloseHandler) {
    this._onClose = onCloseHandler;
  }
} // open


/// Attaches the loaded dialog code into the DOM ready for display.
/// Wires up the various buttons and the escape key to close the dialog.
function attachDialog() {
  _placeholder = document.createElement("div")
  _placeholder.innerHTML = _modalHtml;

  document.body.appendChild(_placeholder);

  _overlay = document.querySelector(".app-modal-overlay");
  _modal = document.querySelector(".app-modal-container");
  _closeButton = document.querySelector("a.app-modal-closer");
  _okButton = document.getElementById("app-modal-ok");
  _closeButton.addEventListener("click", closePwndDialog);
  _okButton.addEventListener("click", closePwndDialog);
  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 27) {
      closePwndDialog();
    }
  });

} // attachDialog


/// Loads the dialog HTML from the external file.
/// Once loaded it adds into memory ready to be attached to the DOM.
/// Only loads the file once per page load no matter how many times the dialog is open/closed.
function loadModalDialog() {
  var me = this;
  if (me._modalHtml != null) {
    // already downloaded, so just re-attach
    return;
  }

  var r = new XMLHttpRequest();
  var url = "./modal.html";
  
  r.open("GET", url, true/*async*/);
  
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) 
        return;
    me._modalHtml = r.responseText;
  };

  r.send();

} // loadModalDialog


/// Wait for the injected website page to load, then inject our code.
document.addEventListener("DOMContentLoaded", function() {
  loadModalDialog();
});

