define(function (require, exports, module) {

  var FontFaceObserver = require('FontFaceObserver');

  /**
   * 设置初始状态和禁用状态
   * @param frame
   * @returns {Phaser.Button}
   */
  Phaser.Button.prototype.setDisableFrame = function (frame) {
    this._onDisableFrame = frame;
    return this;
  };

  /**
   * 设置按钮是否可用
   * @param enable
   */
  Object.defineProperty(Phaser.Button.prototype, 'enabled', {
    set: function (value) {
      if (value) {
        this.frameName = this._onUpFrame;
        this.freezeFrames = false;
        this.inputEnabled = true;
      } else {
        this.freezeFrames = true;
        this.inputEnabled = false;
        this.frameName = this._onDisableFrame;
      }
    }
  });

  Phaser.Loader.prototype.webfont = function (key, fontName, url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
    this.addToFileList('webfont', key, fontName);
    return this;
  };

  Phaser.Loader.prototype.loadFileOld = Phaser.Loader.prototype.loadFile;
  Phaser.Loader.prototype.loadFile = loadFileEx;

  function loadFileEx(file) {
    if (file.type !== 'webfont') {
      Phaser.Loader.prototype.loadFileOld.call(this, file);
    } else {
      var _this = this;
      var font = new FontFaceObserver(file.url);
      //3000毫秒超时
      font.load(null, 3000).then(function () {
        _this.asyncComplete(file);
      }, function () {
        _this.asyncComplete(file, 'Error loading font ' + file.url);
      });
    }
  }

  Phaser.ScaleManager.prototype.setShowAll = function (expanding) {
    var bounds = this.getParentBounds(this._tempBounds);
    var width = bounds.width;
    var height = bounds.height;
    var multiplier;
    if (expanding) {
      multiplier = Math.max((height / this.game.height), (width / this.game.width));
    } else {
      multiplier = Math.min((height / this.game.height), (width / this.game.width));
    }
    this.width = Math.round(this.game.width * multiplier);
    /*显示footbar*/
    this.height = Math.round(this.game.height * multiplier) - 28;
  };

  String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
  };

});