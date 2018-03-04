'use strict'

///
/// PasswordData: 
/// Used for passing the data around through the callback hell!
/// 
var PasswordData = {
	url: "",
	suffix: "",
	prefix: "",
	sha: "",
	password: "",
	checkComplete: null,

	isPwned: false,
	hits: 0,
	prettyHits: ""
};


///
/// PasswordChecker: 
/// Performs the check against the haveibeenpwned API.
/// 
var PasswordChecker = {

	_passwordCheckComplete: null,


	/// Hit the API
	queryApi: function (url, data, onOK) {
		var r = new XMLHttpRequest();

		r.open("GET", url, true/*async*/);

		r.onreadystatechange = function () {
			if (r.readyState != 4 || r.status != 200)
				return;
			onOK(data, r);
		};

		r.send();
	}, // queryApi


	/// Delimits the API response and establishes if the password has been in a breach
	parseResponse: function (data, response) {
		var text = response.responseText;
		var suffixAt = text.indexOf(data.suffix);

		if (suffixAt < 0) {
			// no pawnage ... phew!
			if (data.checkComplete) {
				data.checkComplete(data);
			}
			return;
		}

		// match found, they've been pwned ... now find how many times
		var colonAt = text.indexOf(':', suffixAt);
		var newLine = text.indexOf('\n', colonAt);
		var pawnCountStr = text.substring(colonAt + 1, newLine);

		// and record the outcome
		data.isPwned = true;
		data.hits = parseInt(pawnCountStr);
		data.prettyHits = data.hits.toLocaleString();

		if (data.checkComplete) {
			data.checkComplete(data);
		}

	}, // parseResponse


	/// kicks off checking for a breached password.
	checkForPawnage: function (password, onCheckComplete) {
		var PWNED_CHECKER_URL = "https://api.pwnedpasswords.com/range/";
		var url = "";
		var sha = "";
		var prefix = "";
		var suffix = "";
		var data = new Object();

		data.sha = sha1(password);
		data.checkComplete = onCheckComplete;
		data.password = password;

		if (data.sha && data.sha !== "") {
			// Response is uppercase, so make matching easier later on ...
			data.sha = data.sha.toUpperCase();

			// for the range query we only want the first 5 characters
			data.prefix = data.sha.substring(0, 5);
			data.suffix = data.sha.substring(5);

			url = PWNED_CHECKER_URL + data.prefix;

			this.queryApi(url, data, this.parseResponse);
			return true;
		}

		return false;
	} // checkForPawnage

} // PasswordChecker

