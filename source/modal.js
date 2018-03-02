var overlay = document.querySelector(".app-modal-overlay");
var modal = document.querySelector(".app-modal-container");
var closeButton = document.querySelector(".app-modal-closer a");

function close() {
  modal.classList.remove("app-show");  
  overlay.classList.remove("app-show");  
}

function open() {
  modal.classList.add("app-show");  
  overlay.classList.add("app-show");  
}

closeButton.addEventListener("click", function() {
  close();
});

open();

