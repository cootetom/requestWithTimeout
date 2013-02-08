/*jshint curly: true, eqeqeq: true, undef: true, devel: true, browser: true */
/*global jQuery */

/**
* @author Tom Coote (tomcoote.co.uk)
* @version 1.0.0
* @copyright Copyright 2011 Tom Coote
* @license released under the BSD (3-clause) licences
*
* Extend jQuery by adding two more functions to it.
*
* $.getWithTimeout(timeout, url, [data,] [success(data, textStatus, jqXHR),] [dataType])
* $.postWithTimeout(timeout, url, [data,] [success(data, textStatus, jqXHR),] [dataType])
* 
* Each function can be used just like $.get or $.post with some added functionality.
* The parametes named 'url', 'data', 'success' and 'dataType' are all used just as the
* jQuery documentation states for the $.get and $.post functions.
*
* The additional parameter named 'timeout' is used to ensure that the success method
* isn't invoked until the given timeout, in milliseconds, has passed. For example, if a 
* timeout of 500 milliseconds was given and the request took 300 milliseconds then a 
* further 200 milliseconds would be set to pass before the success function was invoked with the
* request response. If, for the same timeout of 500 milliseconds, the request took 800
* milliseconds then the success function would be invoked immediately.
*
* This allows an AJAX request to be made with time to show the user some feedback on the web
* page for a given timeout period, one long enough for the user to read what ever loading message
* is presented to them, but doesn't delay any longer than required for the response.
*
* Logic to show a loading message should exist before calling one of these functions. Then logic
* to clear up any loading message can be placed inside the success callback function.
*/
(function($){

	function requestWithTimeout(requestFn, timeout, url, data, success, dataType) {
		var started = new Date();
		
		return requestFn(url, data, function(data, textStatus, jqXHR) {
			if (typeof success === 'function') {
				timeout = timeout - (new Date() - started);
				if (timeout) {
					window.setTimeout(function() {
						success(data, textStatus, jqXHR);
					}, timeout);
				}
				else {
					success(data, textStatus, jqXHR);
				}
			}
		}, dataType);
	}

	$.extend({
		getWithTimeout: function(timeout, url, data, success, dataType) {
			return requestWithTimeout($.get, timeout, url, data, success, dataType);
		},
		postWithTimeout: function(timeout, url, data, success, dataType) {
			return requestWithTimeout($.post, timeout, url, data, success, dataType);
		},
		getJSONWithTimeout: function(timeout, url, data, success, dataType) {
			return requestWithTimeout($.getJSON, timeout, url, data, success, dataType);
		}
	});

})(jQuery);