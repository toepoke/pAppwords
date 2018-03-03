var config = {
	FAILURE_PERCENTAGE: 33,
	PREVENT_SUBMIT: true,
	CLEAR_PASSWORD_FIELDS: true
};

var _activeForm = null;
var _allowContinue = false;
var _failurePercentage = 0.0;

/// Find all password type fields on the page
function findPasswordFields() { 
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
} // findPasswordFields


/// For a given set of password fields, find all the [unique] forms they are part of
function findPasswordForms(passwords) {
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
} // findPasswordForms


function onSubmit(e) {
	// find all password fields and see if they've been pawned
	var passwordFields = e.currentTarget.querySelectorAll("input[type='password']");
	var numPasswordFields = passwordFields.length;
	var numPasswordsPwnd = 0;
	var numPasswordsChecked = 0;

	this._activeForm = e.target;

	for (var pf=0; pf < passwordFields.length; pf++) {
		var passwordField = passwordFields[pf];
		var password = passwordField.value;

		if (password.length == 0) {
			// no point querying
			continue;
		}

		Checker.checkForPawnage(password, function (isPwded, hits, prettyHits) {
			console.log(isPwded, hits, prettyHits);
			
			numPasswordsChecked++;
			if (isPwded) {
				numPasswordsPwnd++;
				if (config.CLEAR_PASSWORD_FIELDS) {
					passwordField.value = "";
				}
			}

			var isFinalCheck = (numPasswordsChecked === numPasswordFields);
			if (isFinalCheck) {
				// final check has been done, so what's the result?
				this._allowContinue = true;
				// At least one password is pawned, but this isn't the end of the story.  Consider
				//  - Login => 1 password
				//  - Password change => 3 passwords (current, new and new confirm)
				//  - SPA => could have loads!
				// So we calculate the percentage of the passwords that have failed and go with that
				this._failurePercentage = (numPasswordsPwnd / numPasswordFields) * 100;
				if (this._failurePercentage >= config.FAILURE_PERCENTAGE) {
					this._allowContinue = false;
				}

				var me = this;
				openPwndDialog(function() {
					if (me._allowContinue || !config.PREVENT_SUBMIT) {
						// allow form submission to continue.
						me._activeForm.submit();
					}
				});
	
			} // isFinalCheck
	
		});
			
	} // for each password field

	// Stop form submission for now, we'll allow it to continue later if the test is passed
	e.preventDefault();
	return false;

} // onSubmit


/// Wait for the injected website page to load, then inject our code.
document.addEventListener("DOMContentLoaded", function() {

	var passwords = findPasswordFields();
	var forms = findPasswordForms(passwords);

	for (var f in forms) {
		var form = forms[f];

		// attach to the form submissions
		form.addEventListener("submit", onSubmit);
	}
	
});
