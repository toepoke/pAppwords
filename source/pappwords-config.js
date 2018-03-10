///
/// PappwordsConfig:
/// Handles getting configuration properties.
/// Intention is that people can use Pappwords outside Cloudflare app if they wish.
/// This class provides facilities to the use the defaults if we're outside Cloudflare.
/// 

var PappwordsConfig = {
	DEBUG: false,

	/// Specifies how agressive the check should be.  If we imagine a password change form
	/// we have the existing password and two new password fields.  It's more likely the current
	/// password is in a breach (this may be why someone is changing their password!).  
	/// So you may not want to show the report the problem unless the new password and new password
	/// confirm fields are in a breach.
	/// Pappwords can't know which password is which so it uses a failure percentage to determine 
	/// what to report.  So at 33% (the default) we'd only report if 2 or more are in a breach.
	/// If you'd prefer to always report, set this to 100.
	FAILURE_PERCENTAGE_DEFAULT: 33,
	
	/// If true the dialog will be shown, but the form will be allowed to submit
	/// If false the dialog will be shown, but the form will not submit
	WARN_ONLY_DEFAULT: false,
	
	/// If true the password fields which are in a breach they are cleared forcing the user
	/// to enter a different password.
	CLEAR_PASSWORD_FIELDS_DEFAULT: true,

	/// If true the dialog will be shown (subject to the above).
	/// If false the dialog is not shown (and you want to add JavaScript to report the issue yourself)
	SHOW_DIALOG: true,

	/// Message to appear in the dialog
  MESSAGE_DEFAULT:
		'<p>This password has previously appeared in a data breach.</p>' +
		'<p>It has appeared {PRETTY-COUNT} time(s).</p>' +
		'<p>Please use a more secure alternative.</p>',

	/// onComplete will be called if you wish to handle the reporting yourself
	onComplete: null,

	/// Finds the Cloudflare element with the settings on the page
  getCloudFlareOptions: function () {
    var cf = document.getElementsByTagName('cloudflare-app')

    if (!cf) return null
    if (cf.length == 0) return null

    var options = cf[0]

    return options
  },

	/// Helper method to get an option.
	/// If we aren't runnning Cloudflare, this will return null.
  getOption: function (attrName) {
    var cf = this.getCloudFlareOptions()
    if (cf == null) { return null }

    var value = cf.getAttribute(attrName)

    if (value == 'null') { value = null }

    return value
  },

	/// Get the "message" option (via Cloudflare setting or default)
  getMessage: function () {
    var msg = this.getOption('message')

    if (msg == null) { msg = PappwordsConfig.MESSAGE_DEFAULT }

    return msg
  },

	/// Get the "warnOnly" option (via Cloudflare setting or default)
  getWarnOnly: function () {
    var warnOnly = this.getOption('warn_only')

    if (warnOnly == null) { warnOnly = PappwordsConfig.WARN_ONLY_DEFAULT }

		// convert to boolean
    warnOnly = (warnOnly.toString() == 'true')

    return warnOnly
  },

	/// Get the "clearPasswords" option (via Cloudflare setting or default)
  getClearPasswords: function () {
    var clearPwds = this.getOption('clear_password_fields')

    if (clearPwds == null) { clearPwds = PappwordsConfig.CLEAR_PASSWORD_FIELDS_DEFAULT }

		// convert to boolean
    clearPwds = (clearPwds.toString() == 'true')

    return clearPwds
  },

	/// Get the "failurePercentage" option (via Cloudflare setting or default)
  getFailurePercentage: function () {
    var failure = this.getOption('failure_percentage')

    if (failure == null) { failure = PappwordsConfig.FAILURE_PERCENTAGE_DEFAULT }

    failure = parseFloat(failure)

    return failure
	},

	/// Whether the 
	getShowDialog: function() {
		// Doesn't make sense for Cloudflare version
		return this.SHOW_DIALOG;
	},
	
	/// Applies variables to the message
	translateMessage: function(count, prettyCount) {
		var template = this.getMessage();

		template = template.replace('{COUNT}', count)
		template = template.replace('{PRETTY-COUNT}', prettyCount)

		return template;
	},

	/// Helper method that puts the settings (Cloudflare or defaults) into the console.
	/// Makes debugging easier.
  showSettings: function () {
		if (!this.DEBUG)
			return;
    console.info('settings', {
			warnOnly: this.getWarnOnly(),
			showDialog: this.getShowDialog(),
      clearPasswords: this.getClearPasswords(),
      failurePercentage: this.getFailurePercentage(),
      message: this.getMessage()
    })
	},

	/// convenience function to handle user provided configuration changes
	applyOverrides: function(config) {
		this.MESSAGE_DEFAULT = config.message || this.MESSAGE_DEFAULT;
		this.FAILURE_PERCENTAGE_DEFAULT = config.failurePercentage || this.FAILURE_PERCENTAGE_DEFAULT;
		this.WARN_ONLY_DEFAULT = config.warnOnly || this.WARN_ONLY_DEFAULT;
		this.CLEAR_PASSWORD_FIELDS_DEFAULT = config.clearPasswordFields || this.CLEAR_PASSWORD_FIELDS_DEFAULT;
		this.onComplete = config.onComplete || this.onComplete;

		// bools ...
		if (config.showDialog === false)
			this.SHOW_DIALOG = config.showDialog;
		if (config.warnOnly === true)
			this.WARN_ONLY_DEFAULT = config.warnOnly;
	}

} // PappwordsConfig

