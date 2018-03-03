var PappwordsConfig = {
	FAILURE_PERCENTAGE: 33,
	PREVENT_SUBMIT: true,
	CLEAR_PASSWORD_FIELDS: true,
	MESSAGE: 
		"<p>This password has previously appeared in a data breach.</p>"
		+ "<p>It has appeared {PRETTY-COUNT} time(s).</p>"
		+ "<p>Please use a more secure alternative.</p>",
};

var Pappwords = {
	_activeForm: null,
	_allowContinue: false,
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
		var numPasswordFields = passwordFields.length;
		var numPasswordsPwnd = 0;
		var numPasswordsChecked = 0;

		Pappwords._activeForm = e.target;

		for (var pf=0; pf < passwordFields.length; pf++) {
			var passwordField = passwordFields[pf];
			var password = passwordField.value;

			if (password.length == 0) {
				// no point querying
				continue;
			}

			PasswordChecker.checkForPawnage(password, function (isPwded, hits, prettyHits) {
				console.log(isPwded, hits, prettyHits);
				
				numPasswordsChecked++;
				if (isPwded) {
					numPasswordsPwnd++;
					if (PappwordsConfig.CLEAR_PASSWORD_FIELDS) {
						passwordField.value = "";
					}
				}

				var isFinalCheck = (numPasswordsChecked === numPasswordFields);
				if (isFinalCheck) {
					// final check has been done, so what's the result?
					Pappwords._allowContinue = true;
					// At least one password is pawned, but this isn't the end of the story.  Consider
					//  - Login => 1 password
					//  - Password change => 3 passwords (current, new and new confirm)
					//  - SPA => could have loads!
					// So we calculate the percentage of the passwords that have failed and go with that
					Pappwords._failurePercentage = (numPasswordsPwnd / numPasswordFields) * 100;
					if (Pappwords._failurePercentage >= PappwordsConfig.FAILURE_PERCENTAGE) {
						Pappwords._allowContinue = false;
					}

					// apply template changes
					var template = PappwordsConfig.MESSAGE;
					template = template.replace("{COUNT}", hits);
					template = template.replace("{PRETTY-COUNT}", prettyHits);

					PappwordsModal.openPwndDialog(template, function() {

						if (Pappwords._allowContinue || !PappwordsConfig.PREVENT_SUBMIT) {
							// allow form submission to continue.
							Pappwords._activeForm.submit();
						}
					});
		
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
document.addEventListener("DOMContentLoaded", Pappwords.onLoad );
