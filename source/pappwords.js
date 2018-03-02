'use strict'

var Checker = {
	
	_sha1: "",
	_prefix: "",
	_suffix: "",
	_hits: 0,
	_prettyHits: "",
	_isPwned: false,

	queryApi: function (url, onOK) {
		var r = new XMLHttpRequest();
		var me = this;
		
		r.open("GET", url, true/*async*/);
		
		r.onreadystatechange = function () {
			if (r.readyState != 4 || r.status != 200) 
					return;
			onOK(me, r);
		};

		r.send();
	}, // queryApi


	parseResponse(ctx, response) {
		var text = response.responseText;
		var suffixAt = text.indexOf(ctx._suffix);

		if (suffixAt < 0) {
			// no pawnage ... phew!
			ctx._isPwned = false;
			return;
		}

		// match found, they've been pwned ... now find how many times
		var colonAt = text.indexOf(':', suffixAt);
		var newLine = text.indexOf('\n', colonAt);
		var pawnCountStr = text.substring(colonAt+1, newLine);

		// and record the outcome
		ctx._isPwned = true;
		ctx._hits = parseInt(pawnCountStr);
		ctx._prettyHits = ctx._hits.toLocaleString();
		
		console.info("isPwed:", ctx._isPwned, ctx._prettyHits);
		
	}, // parseResponse


	checkForPawnage: function(password) {
		var PWNED_CHECKER_URL = "https://api.pwnedpasswords.com/range/";
		var url = "";

		this._sha1 = sha1(password);

		if (this._sha1 && this._sha1 !== "") {
			// Response is uppercase, so make matching easier later on ...
			this._sha1 = this._sha1.toUpperCase();

			// for the range query we only want the first 5 characters
			this._prefix = this._sha1.substring(0, 5);
			this._suffix = this._sha1.substring(5);

			url = PWNED_CHECKER_URL + this._prefix;

			this.queryApi(url, this.parseResponse);
			return true;
		}

		return false;
	} // checkForPawnage

}


// https://api.pwnedpasswords.com/range/92429

// 92429d82a41e930486c6de5ebda9602d55c39986
