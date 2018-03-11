/// 
/// Pappwords:
/// Class that handles the interaction between the website form and the pwned api.
/// In essence we inject ourselves into the form submission process so we can perform
/// the password check and show the dialog if required.
///
var Pappwords = {
	_activeForm: null,

	/// Find all password type fields on the page
	findPasswordFields: function () {
		// If querySelectorAll is supported, just use that!
		if (document.querySelectorAll) { return document.querySelectorAll("input[type='password']") }

		// If not, use Robusto's solution
		var ary = []
		var inputs = document.getElementsByTagName('input')
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].type.toLowerCase() === 'password') {
				ary.push(inputs[i])
			}
		}
		return ary
	}, // findPasswordFields

	/// For a given set of password fields, find all the [unique] forms they are part of
	findPasswordForms: function (passwords) {
		var forms = []

		for (var p in passwords) {
			var element = passwords[p]

			// Find the form the password is part of
			while (element.parentElement != null && element.tagName.toLowerCase() !== 'form') {
				element = element.parentElement
			}

			// We're only interested in the password is actually part of a form
			if (element && element.tagName && element.tagName.toLowerCase() === 'form') {
				var add = true

				// Ensure it's a distinct list of forms
				for (var f in forms) {
					var form = forms[f]
					if (form == element) {
						add = false
					}
				}
				if (add) {
					forms.push(element)
				}
			}
		} // findPasswordForms

		return forms
	}, // findPasswordForms

	/// Handler for the injected form submit
	onSubmit: function (e) {
		// find all password fields and see if they've been pwned
		var passwordFields = e.currentTarget.querySelectorAll("input[type='password']")
		var pwnedPasswords = []
		var numPasswordFields = passwordFields.length
		var numPasswordsPwnd = 0
		var numPasswordsChecked = 0
		var highestHits = 0
		var highestPrettyHits = ''

		Pappwords._activeForm = e.target

		/// Loop over each password in the form so we can perform a breach check
		for (var pf = 0; pf < passwordFields.length; pf++) {
			var passwordField = passwordFields[pf]
			var password = passwordField.value

			if (password.length == 0) {
				// no point querying as there are no password fields filled in
				continue
			}

			// Check if the password has been subject to a breach
			PasswordChecker.checkForPawnage(password, { field: passwordField }, function (data) {
				numPasswordsChecked++
				if (data.isPwned) {
					numPasswordsPwnd++
					pwnedPasswords.push(data.password)
					if (data.hits > highestHits) {
						highestHits = data.hits
						highestPrettyHits = data.prettyHits
					}
				}

				// If there are several passwords to check (e.g. it's a change password form)
				// we only want to show the dialog once, so we wait for the last one before deciding what to do
				var isFinalCheck = (numPasswordsChecked === numPasswordFields)
				if (isFinalCheck) {
					// final check has been done, so what's the result?
					var shouldReport = false

					data.message = PappwordsConfig.translateMessage(highestHits, highestPrettyHits);

					// We may be checking 1 or several passwords.  Consider:
					//  - Login => 1 password
					//  - Password change => 3 passwords (current, new and new confirm)
					//  - SPA => could have loads!
					// So we calculate the percentage of the passwords that have failed and go with that
					var failurePercentage = (numPasswordsPwnd / numPasswordFields) * 100
					if (failurePercentage >= PappwordsConfig.getFailurePercentage()) {
						// we're over the "aggression" setting, so we'll show the user the dialog
						shouldReport = true
					}
					if (shouldReport && PappwordsConfig.getClearPasswords()) {
						// Clearing breached passwords is on, so clear out the effected passwords
						for (var i = 0; i < pwnedPasswords.length; i++) {
							var pwnedPassword = pwnedPasswords[i]
							for (var j = 0; j < passwordFields.length; j++) {
								var passwordField = passwordFields[j]
								if (passwordField.value === pwnedPassword) {
									passwordField.value = ''
								}
							}
						}
					} // clear password fields

					if (shouldReport && PappwordsConfig.SHOW_DIALOG) {
						PappwordsModal.openPwndDialog(data.message, function () {
							var warnOnly = PappwordsConfig.getWarnOnly()
							if (warnOnly) {
								// warnOnly => allow form submission to continue.
								Pappwords._activeForm.submit()
							}
						})
					} // shouldReport

					if (PappwordsConfig.onComplete) {
						var msg = PappwordsConfig.translateMessage(highestHits, highestPrettyHits);
						PappwordsConfig.onComplete(data);
					}
					
				} // isFinalCheck
			}) // checkForPawnage
		} // for each password field

		// Stop form submission for now, we'll allow it to continue later if the password isn't breached
		// (or warnOnly mode is on)
		e.preventDefault()
		return false
	}, // onSubmit

	/// Fires on page load so we can find any forms with passwords on them
	onLoad: function (config) {
		PappwordsConfig.applyOverrides(config);

		// Show the adopted settings (easier for debugging)
		PappwordsConfig.showSettings()

		var passwords = Pappwords.findPasswordFields()
		var forms = Pappwords.findPasswordForms(passwords)

		for (var f in forms) {
			var form = forms[f]

			// attach to the form submissions
			form.addEventListener('submit', Pappwords.onSubmit)
		} // foreach form
	} // onLoad

}	// Pappwords

/// Wait for the injected website page to load, then inject our code.
document.addEventListener("DOMContentLoaded", function() {
	Pappwords.onLoad();
});
