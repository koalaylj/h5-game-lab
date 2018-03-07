define(function (require, exports, module) {

  var channel = require('channel');
  var cache = require('cache');

  //todo
  var uri = cache.get('__server').gameServerUrl;

  var header = {
      InterfaceID: 0,
      LoginCode: "",
      PassPort: "",
      SPECIALID: "",
      SinCode: "",
      GameLoginCode: ""
  };

  return {
    reqLogin: function (msg) {
      header.InterfaceID = 100101
      return channel.post(uri, msg, {'X-Game':JSON.stringify(header)});
    },
    reqBonus: function (msg) {
      header.InterfaceID = 100102
      return channel.post(uri, msg, {'X-Game':JSON.stringify(header)});
    },
    reqSpin: function (msg) {
      header.InterfaceID = 100103
      return channel.post(uri, msg, {'X-Game':JSON.stringify(header)});
    }
  }

});