/* Authentication module */
var basicAuth = require('basic-auth');

module.exports.authorized = function(req) {
    var credentials = basicAuth(req);
    return credentials && credentials.name === 'admin' && credentials.pass === '1234';
}