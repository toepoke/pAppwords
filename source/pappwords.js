var PappwordsConfig = {
	FAILURE_PERCENTAGE_DEFAULT: 33,
	PREVENT_SUBMIT_DEFAULT: true,
	CLEAR_PASSWORD_FIELDS_DEFAULT: true,
	MESSAGE_DEFAULT: 
		"<p>This password has previously appeared in a data breach.</p>"
		+ "<p>It has appeared {PRETTY-COUNT} time(s).</p>"
		+ "<p>Please use a more secure alternative.</p>",

	getCloudFlareOptions: function() {
		var cf = document.getElementsByTagName("cloudflare-app");

		if (!cf) return null;
		if (cf.length == 0) return null;

		var options = cf[0];

		return options;
	},

	getOption: function(attrName) {
		var cf = this.getCloudFlareOptions();
		
		return cf.getAttribute(attrName);
	},

	getMessage: function() {
		var msg = this.getOption("message");

		if (msg == null)
			msg = PappwordsConfig.MESSAGE_DEFAULT;
		
		return msg;
	},

	getPreventSubmit: function() {
		var preventSubmit = this.getOption("preventSubmit");

		if (preventSubmit == null)
			preventSubmit = PappwordsConfig.PREVENT_SUBMIT_DEFAULT;
		
		return preventSubmit;
	},

	getClearPasswords: function() {
		var clearPwds = this.getOption("clearPasswords");

		if (clearPwds == null)
			clearPwds = PappwordsConfig.CLEAR_PASSWORD_FIELDS_DEFAULT;
		
		return clearPwds;
	},

	getFailurePercentage: function() {
		var failure = this.getOption("failurePercentage");

		if (failure == null)
			failure = PappwordsConfig.FAILURE_PERCENTAGE_DEFAULT;
		
		failure = parseFloat(failure);
		
		return failure;
	}

};

var Pappwords = {
	_activeForm: null,
	_failurePercentage: 0.0,

	/// Find all password type fields on the page
	findPasswordFields: function() { 
		// If querySelectorAll is supported, just use that!
		if (document.querySelectorAll)
			return document.querySelectorAll("input[type='password']"); 

		// If not, use Robusto's solution
		var ary = []; 
		var inputs = document.getElementsByTagName("input"); 
		for (var i=0; i<inputs.length; i++) { 
			if (inputs[i].type.toLowerCase() === "password") { 
				ary.push(inputs[i]); 
			} 
		} 
		return ary; 
	}, // findPasswordFields


	/// For a given set of password fields, find all the [unique] forms they are part of
	findPasswordForms: function(passwords) {
		var forms = [];

		for (var p in passwords) {
			var element = passwords[p];
			
			// Find the form the password is part of
			while (element.parentElement != null && element.tagName.toLowerCase() !== "form") {
				element = element.parentElement;
			}

			// We're only interested in the password is actually part of a form
			if (element && element.tagName && element.tagName.toLowerCase() === "form") {
				var add = true;

				// Ensure it's a distinct list of forms
				for (var f in forms) {
					var form = forms[f];
					if (form == element) {
						add = false;
					}
				}
				if (add) {
					forms.push(element);
				}
			}
		
		}

		return forms;
	}, // findPasswordForms


	onSubmit: function(e) {
		// find all password fields and see if they've been pawned
		var passwordFields = e.currentTarget.querySelectorAll("input[type='password']");
		var pwnedPasswords = [];
		var numPasswordFields = passwordFields.length;
		var numPasswordsPwnd = 0;
		var numPasswordsChecked = 0;
		var highestHits = 0;
		var highestPrettyHits = "";

		Pappwords._activeForm = e.target;

		for (var pf=0; pf < passwordFields.length; pf++) {
			var passwordField = passwordFields[pf];
			var password = passwordField.value;

			if (password.length == 0) {
				// no point querying
				continue;
			}

			PasswordChecker.checkForPawnage(password, function (data) {
				numPasswordsChecked++;
				if (data.isPwned) {
					numPasswordsPwnd++;
					pwnedPasswords.push(data.password);
					if (data.hits > highestHits) {
						highestHits = data.hits;
						highestPrettyHits = data.prettyHits;
					}
				}

				var isFinalCheck = (numPasswordsChecked === numPasswordFields);
				if (isFinalCheck) {
					// final check has been done, so what's the result?
					var allowFormSubmission = true;
					var showDialog = false;
					// At least one password is pawned, but this isn't the end of the story.  Consider
					//  - Login => 1 password
					//  - Password change => 3 passwords (current, new and new confirm)
					//  - SPA => could have loads!
					// So we calculate the percentage of the passwords that have failed and go with that
					Pappwords._failurePercentage = (numPasswordsPwnd / numPasswordFields) * 100;
					if (Pappwords._failurePercentage >= PappwordsConfig.getFailurePercentage()) {
						allowFormSubmission = false;
						showDialog = true;
					}
					if (showDialog && PappwordsConfig.getClearPasswords()) {
						// clear passwords
						for (var i=0; i < pwnedPasswords.length; i++) {
							var pwnedPassword = pwnedPasswords[i];
							for (var j=0; j < passwordFields.length; j++) {
								var passwordField = passwordFields[j];
								if (passwordField.value === pwnedPassword) {
									passwordField.value = "";
								}
							}
						}
					} // clear password fields

					// apply template changes
					// var template = PappwordsConfig.MESSAGE;
					var template = PappwordsConfig.getMessage();
					template = template.replace("{COUNT}", highestHits);
					template = template.replace("{PRETTY-COUNT}", highestPrettyHits);

					if (showDialog) {
						PappwordsModal.openPwndDialog(template, function() {
							var preventSubmit = PappwordsConfig.getPreventSubmit();
							if (allowFormSubmission || !preventSubmit) {
								// allow form submission to continue.
								Pappwords._activeForm.submit();
							}
						});
					} // showDialog
		
				} // isFinalCheck
		
			});
				
		} // for each password field

		// Stop form submission for now, we'll allow it to continue later if the test is passed
		e.preventDefault();
		return false;

	}, // onSubmit

	onLoad: function() {
		var passwords = Pappwords.findPasswordFields();
		var forms = Pappwords.findPasswordForms(passwords);

		for (var f in forms) {
			var form = forms[f];

			// attach to the form submissions
			form.addEventListener("submit", Pappwords.onSubmit);
		}
	}
}	// Pappwords



/// Wait for the injected website page to load, then inject our code.
// document.addEventListener("DOMContentLoaded", Pappwords.onLoad );
