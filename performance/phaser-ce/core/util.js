define(function (require, exports, module) {

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns the hostname given by the browser.
   * @return {string}
   */
  function getHostName() {

    if (window.location && window.location.hostname) {
      return window.location.hostname;
    }

    return null;
  }

  /**
   * Compares the given domain name against the hostname of the browser containing the game.
   * If the domain name is found it returns true.
   * You can specify a part of a domain, for example 'google' would match 'google.com', 'google.co.uk', etc.
   * Do not include 'http://' at the start.
   * @param {string} domain
   * @return {boolean} true if the given domain fragment can be found in the window.location.hostname
   */
  function checkDomainName(domain) {
    return window.location.hostname.indexOf(domain) !== -1;
  }

  /**
   * Returns the Query String as an object.
   * If you specify a parameter it will return just the value of that parameter, should it exist.
   *
   * @param {string} [parameter=''] - If specified this will return just the value for that key.
   * @return {string|object} An object containing the key value pairs found in the query string or just the value if a parameter was given.
   */
  function parseQueryString(url) {

    if (url === undefined || url === "" || url === null) {
      url = location.search.substring(1);
    }

    var output = {};
    var keyValues = url.split('&');

    for (var i in keyValues) {
      var key = keyValues[i].split('=');
      output[this.decodeURI(key[0])] = this.decodeURI(key[1]);
    }
    return output;
  }

  /**
   * Returns the Query String as an object.
   * If you specify a parameter it will return just the value of that parameter, should it exist.
   *
   * @param {string} value - The URI component to be decoded.
   * @return {string} The decoded value.
   */
  function decodeURI(value) {
    return decodeURIComponent(value.replace(/\+/g, " "));
  }

  /**
   * Class for presentting number by image.
   * @param  {Number} x       [] require
   * @param  {Number} y       []  require
   * @param  {Number} figure      [the max number,the figure of the number] require
   * @param  {String} atlas [atlas name] require
   * @param  {String[]} frameNames [number name arrays] require
   * @param  <string> shadow [背景的图片名字数组] option
   * @param  <Number> gap     [数字间距,pixel] option
   */
  var ImageNumber = function (x, y, figure, atlas, frameNames, shadow, gap) {
    Phaser.Group.call(this, game);

    this.num = 0;
    this.max = Math.pow(10, figure) - 1;
    this.sprites = [];

    this.frameNames = frameNames;

    gap = gap || 4;

    this.position.setTo(x, y);

    for (var i = 0; i < figure; i++) {
      var temp = game.add.image(0, 0, atlas, frameNames[0]);
      temp.position.setTo(i * (temp.width + gap), 0);
      temp.visible = false;
      this.sprites.push(temp);
      if (shadow !== null && shadow !== undefined && shadow !== "") {
        this.addChild(game.add.image(i * (temp.width + gap), 0, atlas, shadow));
      }
      this.addChild(temp);
    }
  };

  ImageNumber.prototype = Object.create(Phaser.Group.prototype);
  ImageNumber.prototype.constructor = ImageNumber;

  ImageNumber.prototype.hide = function () {
    this.sprites.forEach(function (e) {
      e.visible = false;
    });
  };

  /**
   * set number directly
   * @param  {[Number]} num      [目标数值]
   */
  ImageNumber.prototype.change = function (num) {
    if (num > this.max) {
      num = this.max;
    }
    this.num = num;
    this.hide();
    var numArray = num.toString().split('').map(Number);
    numArray.forEach(function (e, i, l) {
      this.sprites[this.sprites.length - 1 - i].visible = true;
      this.sprites[this.sprites.length - 1 - i].frameName = this.frameNames[l[l.length - 1 - i]];
    }, this);
  };

  /**
   * set numbers with scrolling animation.
   * @param  {[type]} end        [target number]
   * @param  {[type]} time       [total time for scrolling to target number(end)]
   * @param  {[type]} onComplete [callback when animation is completed]
   */
  ImageNumber.prototype.changeWithAnimation = function (end, time, onComplete) {
    var start = this.num;
    var self = this;
    time = time || 1000;
    var tween = game.add.tween({
      num: start
    });
    tween.to({
      num: end
    }, time, function (step) {
      var result = Math.floor((end - start) * step + start);
      self.change(result);
      return step;
    }, false);

    if (typeof onComplete === 'function') {
      tween.onComplete.add(function () {
        onComplete();
      }, this);
    }
    tween.start();
  };

  return {
    getHostName: getHostName,
    checkDomainName: checkDomainName,
    parseQueryString: parseQueryString,
    decodeURI: decodeURI,
    ImageNumber: ImageNumber,
    getRandomIntInclusive: getRandomIntInclusive,
    getHost: function () {
      return 'http://' + window.location.hostname + ':3000';
    }
  };

});