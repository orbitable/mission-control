var _ = require('lodash');

/*
 * Validates origin headers on requests and updates response.
 *
 * The cors middlewhere inspects the origin of all requests and compares
 * them to a white list of comma seperated hosts. If a match is found the
 * response includes an updated 'Access-Control-Allowed-Origin' header with
 * the origin.
 */
F.middleware('cors', function(req, res, next, options, controller) {

  if (controller) {
    // Parse the cors field of the current config
    var allowedOrigins = (F.config.cors || '').split(',');

    // Validate request origin agains cors whitelist
    var isOrigin = (uri) => uri === req.headers.origin;
    controller.cors(_.find(allowedOrigins, isOrigin) || 'origin');
  }

  next();
});
