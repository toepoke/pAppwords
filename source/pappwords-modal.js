///
/// Responsible for drawing the dialog the user sees when we detect
/// their password has been subject to a breach.
/// 

var PappwordsModal = {
	_overlay: null,
	_modal: null,
	_closeButton: null,
	_okButton: null,
	_modalHtml: null,
	_onClose: null,

	/// Closes the dialog and removes from the DOM to prevent issues on the website being injected.
	closePwndDialog: function () {
		_modal.classList.add('animated', 'fadeOut')
		_overlay.classList.add('animated', 'fadeOut')
		setTimeout(function () {
			var placeholder = document.querySelector('.pappwords-dialog')
			if (placeholder != null) { document.body.removeChild(placeholder) }
		}, 800)
		if (_onClose) {
			_onClose()
		}
	}, // close

	/// Shows the overlay and dialog
	openPwndDialog: function (dialogContent, onCloseHandler) {
		this.attachDialog(dialogContent)
		_overlay.classList.remove('app-hide')
		_modal.classList.remove('app-hide')
		_overlay.classList.add('animated', 'fadeIn')
		_modal.classList.add('animated', 'fadeIn')
		if (onCloseHandler) {
			_onClose = onCloseHandler
		}
	}, // open

	/// Attaches the loaded dialog code into the DOM ready for display.
	/// Wires up the various buttons and the escape key to close the dialog.
	attachDialog: function (dialogContent) {
		var template = this.getModalDialog()

		template = template.replace('{MODAL-CONTENT}', dialogContent)

		var placeholder = document.createElement('div')
		placeholder.classList.add('pappwords-dialog')
		placeholder.innerHTML = template
		document.body.appendChild(placeholder)

		_overlay = document.querySelector('.app-modal-overlay')
		_modal = document.querySelector('.app-modal-container')
		_closeButton = document.querySelector('a.app-modal-closer')
		_okButton = document.getElementById('app-modal-ok')
		_closeButton.addEventListener('click', this.closePwndDialog)
		_okButton.addEventListener('click', this.closePwndDialog)

		var me = this
		document.addEventListener('keyup', function (e) {
			if (e.keyCode === 27) {
				me.closePwndDialog()
			}
		})
	}, // attachDialog

	/// Loads the dialog HTML from the external file.
	/// Once loaded it adds into memory ready to be attached to the DOM.
	/// Only loads the file once per page load no matter how many times the dialog is open/closed.
	getModalDialog: function () {
		var html =
			'<div class="app-modal-overlay app-hide"></div>' +
			'<div class="app-modal-container app-hide">' +
			'<div class="app-modal">' +
			'<div class="app-modal-header">' +
			'<a class="app-modal-closer" href="#">X</a>' +
			'<div class="app-modal-title app-modal-bar">' +
			'<h1>Pawned Password</h1>' +
			'</div>' +
			'</div>' +
			'<div class="app-modal-content-container">' +
			'<div class="app-modal-warning">' +
			'<span class="app-modal-icon">!</span>' +
			'</div>' +
			'<div class="app-modal-content">' +
			'{MODAL-CONTENT}' +
			'</div>' +
			'</div>' +
			'<div class="app-clear"></div>' +
			'<div class="app-modal-footer">' +
			'<input id="app-modal-ok" type="button" value="Ok" class="app-modal-ok app-float-right">' +
			'<div class="app-clear"></div>' +
			'<div class="app-modal-bar">' +
			'<p class="app-float-left app-inline">' +
			'Password check by <a href="https://haveibeenpwned.com">haveibeenpwned.com</a>' +
			'</p>' +
			'<p class="app-float-right app-inline">' +
			'<a href="https://cloudflare.com">app</a> by <a href="https://toepoke.co.uk">toepoke.co.uk</a>' +
			'</p>' +
			'<div class="app-clear"></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>'

		return html
	} // getModalDialog

} // PappwordsModal
