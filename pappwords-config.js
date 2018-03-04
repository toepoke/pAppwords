///
/// PappwordsConfig:
/// Handles getting configuration properties.
/// Intention is that people can use Pappwords outside Cloudflare app if they wish.
/// This class provides facilities to the use the defaults if we're outside Cloudflare.
/// 

var PappwordsConfig = {
  FAILURE_PERCENTAGE_DEFAULT: 33,
  WARN_ONLY_DEFAULT: false,
  CLEAR_PASSWORD_FIELDS_DEFAULT: true,
  MESSAGE_DEFAULT:
		'<p>This password has previously appeared in a data breach.</p>' +
		'<p>It has appeared {PRETTY-COUNT} time(s).</p>' +
		'<p>Please use a more secure alternative.</p>',

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

	/// Helper method that puts the settings (Cloudflare or defaults) into the console.
	/// Makes debugging easier.
  showSettings: function () {
    console.info('settings', {
      warnOnly: this.getWarnOnly(),
      clearPasswords: this.getClearPasswords(),
      failurePercentage: this.getFailurePercentage(),
      message: this.getMessage()
    })
  }

} // PappwordsConfig

