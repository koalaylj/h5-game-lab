define(function (require, exports, module) {

  var util = require('util');
  var cache = require('cache');
  var _ = require('lodash');

  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

  /**
   * detect user language
   * @param conf : i18n configuration, get more details from `i18n` section in config file of the game.
   * {
      "i18n": {
          "languages": ["en", "zh-cn"],
          "directory": "assets/games/happy-caveman/i18n"
      },} 
   */
  function detectLanguage(conf) {

    var lang = util.parseQueryString().lang;

    if (lang && conf.languages.indexOf(lang) !== -1) {
      return lang;
    }

    lang = window.navigator.userLanguage || window.navigator.language;

    if (lang && conf.languages.indexOf(lang) !== -1) {
      return lang;
    }

    return 'en';
  }

  /**
   * get uri of the specified language config file
   * @param conf : i18n configuration, get more details from `i18n` section in config file of the game.
   * {
      "i18n": {
          "languages": ["en", "zh-cn"],
          "directory": "assets/games/happy-caveman/i18n"
      },} 
   */
  function getLanguageFileUri(dir, lang) {

    // var lang = detectLanguage(conf);

    var uri = dir;

    if (!_.endsWith(uri, '/')) {
      uri += '/';
    }

    uri += lang + '.json';

    console.log('user-language', uri);

    return uri;

  }

  /**
   * get words from user language
   * @param {string} key :key in cache.get('__i18n')
   * @param {object} options : data(if have) to fill the `lodash` template
   * example
      template for the key:  hello {{ user }}!
      options: {user:'jack'}

    you will get `hello jack`。
   */
  function get(key, options) {

    var value = cache.get('__i18n')[key];

    if (value) {
      if (options) {
        var compiled = _.template(value);
        return compiled(options);
      }
      return value;
    } else {
      throw 'can not find key:' + key;
    }
  }

  return {
    getLanguageFileUri: getLanguageFileUri,
    detectLanguage: detectLanguage,
    get: get
  };
});