define(function (require, exports, module) {

  //todo: get status text from i18n

  var codes = {
    0: 'ok',
    1: 'wrong http status(not 200),',
    2: 'fatal network error',
    99: 'last error code of client',
    100: 'first error code of server',
  };

  return {
    text: function (code) {
      var statusText = codes[code] || 'unkown error!';
      return statusText;
    }
  };

});