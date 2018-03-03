var overlay = document.querySelector(".app-modal-overlay");
var modal = document.querySelector(".app-modal-container");
var closeButton = document.querySelector("a.app-modal-closer");
var okButton = document.getElementById("app-modal-ok");

function close() {
  modal.classList.add("fadeOut");  
  overlay.classList.add("fadeOut");  
}

function open() {
  overlay.classList.add("fadeIn");
  modal.classList.add("fadeIn");
}

closeButton.addEventListener("click", close);
okButton.addEventListener("click", close);

open();

