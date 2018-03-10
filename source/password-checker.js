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
	aside: null,
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

		// assume all is well to start with
		data.isPwned = false;
		data.hits = null;
		data.prettyHits = null;

		if (suffixAt < 0) {
			// no pawnage ... phew!
			return data;
		}

		// match found, they've been pwned ... now find how many times
		var colonAt = text.indexOf(':', suffixAt);
		var newLine = text.indexOf('\n', colonAt);
		var pawnCountStr = text.substring(colonAt + 1, newLine);

		// and record the outcome
		data.isPwned = true;
		data.hits = parseInt(pawnCountStr);
		data.prettyHits = data.hits.toLocaleString();

		return data;
	}, // parseResponse


	/// kicks off checking for a breached password.
	checkForPawnage: function (password, aside, onCheckComplete) {

		var PWNED_CHECKER_URL = "https://api.pwnedpasswords.com/range/";
		var url = "";
		var sha = "";
		var prefix = "";
		var suffix = "";
		var data = new Object();

		data.sha = sha1(password);
		data.checkComplete = onCheckComplete;
		data.password = password;
		data.aside = aside;

		if (data.sha && data.sha !== "") {
			// Response is uppercase, so make matching easier later on ...
			data.sha = data.sha.toUpperCase();

			// for the range query we only want the first 5 characters
			data.prefix = data.sha.substring(0, 5);
			data.suffix = data.sha.substring(5);

			url = PWNED_CHECKER_URL + data.prefix;

			return this.queryApi(url, data, function(data, resp) {
				var outcome = PasswordChecker.parseResponse(data, resp);

				if (data.checkComplete) {
					data.checkComplete(data);
				}
			});
		}

		return false;
	} // checkForPawnage

} // PasswordChecker

