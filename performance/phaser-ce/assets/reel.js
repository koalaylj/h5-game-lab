define(function (require, exports, module) {

  var cache = require('cache');
  var _ = require('lodash');
  var event = require('event');
  var util = require('util');

  var _root;

  var _reelGroup;

  /**
   * 驱动动画的timer
   */
  var _timer;

  /**
   * 滚动次数计数器
   */
  var _scrollCounter = 0;

  var finishEvent = new Phaser.Signal();

  /***************** DEBUG  ****************/
  var colors = [];

  for (var i = 0; i < 5; i++) {
    colors.push(getRandomColor());
  }

  function getRandomColor() {
    var letters = '123456789ABCDEF';
    var color = '#07';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  event.renderEvent.add(function () {

    return;

    // var reels = cache.get('__config').reels;

    // reels.forEach(function (reel, i) {
    //     // var rect = new Phaser.Rectangle(reel.mask.x + reel.pos[0], reel.mask.y + reel.pos[1], reel.mask.w, reel.mask.h);
    //     var rect = new Phaser.Rectangle(reel.pos[0] - game.width / 2, reel.pos[1] - game.height / 2, reel.mask.w, reel.mask.h);
    //     var geom = game.debug.geom(rect, colors[i]);
    // });

    if (_reelGroup) {
      for (var i = 0; i < _reelGroup.children.length; i++) {
        var reel = _reelGroup.getChildAt(i);

        for (var j = 0; j < reel.children.length; j++) {
          var symbol = reel.getChildAt(j);
          game.debug.spriteBounds(symbol);
          // game.debug.text(`${symbol._frame.name} `, symbol.worldPosition.x - 50, symbol.worldPosition.y);
          // game.debug.text(`(${symbol.position.x.toFixed(2)},${symbol.position.y.toFixed(2)})`, symbol.worldPosition.x - 60, symbol.worldPosition.y + 20);
          // game.debug.text(`(${symbol.x.toFixed(2)},${symbol.y.toFixed(2)})`, symbol.worldPosition.x - 60, symbol.worldPosition.y + 40);
        }

      }
    }
  });
  /***************** DEBUG END ****************/


  /************** 老虎机的一个轴 ***************/
  var Reel = function (index, conf) {

    Phaser.Group.call(this, game);

    this.x = conf.pos[0];
    this.y = conf.pos[1];

    //轴是否停止旋转
    this.stoped = true;

    this.conf = conf;
    this.index = index;

    // for (let j = conf.symbols.length - 1; j >= 0; j--) {
    //     var symbolConf = conf.symbols[j];
    //     var symbol = this.randomSymbol();
    //     this.addSymbol(symbolConf[0], symbolConf[1], symbol.key, symbol.frame);
    // }

    this.initMask();
  };

  Reel.prototype = Object.create(Phaser.Group.prototype);
  Reel.prototype.constructor = Reel;

  /**
   * 初始化遮罩（图标显示区域）
   */
  Reel.prototype.initMask = function () {
    var mask = game.add.graphics(
      this.conf.mask.x + _reelGroup.position.x,
      this.conf.mask.y + _reelGroup.position.y);
    mask.beginFill(0x000000);
    mask.drawRect(0, 0, this.conf.mask.w, this.conf.mask.h);
    if (this.mask !== null) {
      this.mask.destroy();
    }
    this.mask = mask;
  };

  //轴滚动
  Reel.prototype.scroll = function () {
    if (!this.stoped) {
      var bottomSymbol = this.children[0];
      if (bottomSymbol.y >= this.conf.maxY) {
        this.removeChildAt(0);
        var prepare = this.conf.prepare;
        var symbol = this.randomSymbol();
        this.addSymbol(prepare[0], prepare[1], symbol.key, symbol.blur);
      }

      for (var i = 0; i < this.length; i++) {
        this.children[i].y += this.conf.speed;
      }
    }
  };

  //轴开始滚动
  Reel.prototype.start = function () {
    this.stoped = false;
    var prepare = this.conf.prepare;
    var symbol = this.randomSymbol();
    this.addSymbol(prepare[0], prepare[1], symbol.key, symbol.blur);
  };

  //轴停止转动
  Reel.prototype.stop = function (symbols) {
    this.stoped = true;
    this.setSymbols(symbols);
    // emitter.reelStopSignal.dispatch(this.index);
  };

  //往轴内添加一个图标
  Reel.prototype.addSymbol = function (x, y, atlas, frame) {
    var symbol = game.add.sprite(x, y, atlas, frame);
    symbol.anchor.setTo(0.5, 0.5);
    this.addChild(symbol);
    // symbol.inputEnabled = true;
    // symbol.input.enableDrag(true);
    return symbol;
  }

  //随机产生一个图标(配置信息，并非真正的sprite)
  Reel.prototype.randomSymbol = function (blur) {
    var config = cache.get('__config');
    return _.sample(config.symbols);
  }

  //设置本轴所有图标
  Reel.prototype.setSymbols = function (symbols) {
    this.removeAll(true);
    for (var j = this.conf.symbols.length - 1; j >= 0; j--) {
      var symbolConf = this.conf.symbols[j];
      var symbol = symbols[j];
      this.addSymbol(symbolConf[0], symbolConf[1], symbol.key, symbol.frame);
    }
  }

  /*******************************************/

  var _started = false;
  event.updateEvent.add(function () {
    if (!_started) {
      return;
    }
    _scrollCounter++;
    var conf = cache.get('__config');

    for (var i = 0; i < _reelGroup.children.length; i++) {

      var reel = _reelGroup.getChildAt(i);
      reel.scroll();

      var msgReceived = cache.get('spin') !== undefined;
      var canStop = msgReceived && _scrollCounter >= reel.conf.times;

      if (!reel.stoped && canStop) {

        var symbolIds = stand(cache.get('spin').symbols);
        var symbols = getSymbolsByIds(symbolIds);

        reel.stop(symbols.slice(i * 3, (i + 1) * 3));

        var allStoped = _.every(_reelGroup.children, function (e) {
          return e.stoped;
        }, this);

        if (allStoped) {
          _started = false;
          _timer.stop(false);
          finishEvent.dispatch();
        }
      }
    }
  });

  function update() {

    return;

    _scrollCounter++;
    var conf = cache.get('__config');

    for (var i = 0; i < _reelGroup.children.length; i++) {

      var reel = _reelGroup.getChildAt(i);
      reel.scroll();

      // continue;
      var canStop = _scrollCounter >= reel.conf.times;

      if (!reel.stoped && canStop) {

        var symbols = cache.get('test');
        reel.stop(symbols.slice(i * 3, (i + 1) * 3));

        var allStoped = _.every(_reelGroup.children, function (e) {
          return e.stoped;
        }, this);

        if (allStoped) {
          _timer.stop(false);
          finishEvent.dispatch();
        }
      }
    }
  }

  /**
   * 把服务器端给的图标竖着表示。
   * 服务器图标是横着表示的,客户端是竖着表示的。手动FUCK!
   */
  function stand(serverSymbols) {
    var clientSymbols = [];
    for (var i = 0; i < serverSymbols.length; i++) {
      var col = i % 5;
      var row = Math.floor(i / 5);
      var pos = col * 3 + row;
      clientSymbols[pos] = serverSymbols[i];
    }
    return clientSymbols;
  }

  function getSymbolsByIds(symbolIds) {
    var conf = cache.get('__config');
    var symbols = [];
    _.each(symbolIds, function (symbolId) {
      var symbol = _.find(conf.symbols, function (item) {
        return item.id === symbolId
      });
      symbols.push(symbol);
    });

    return symbols;
  }

  /**
   * 初始化滚轮
   */
  function create() {

    _root = game.add.group();
    _root.visible = false;


    // var bg = game.add.image(game.width / 2, game.height / 2, "main", "reelBg");
    // bg.anchor.setTo(0.5);
    // // bg.scale.setTo(0.90,0.9);
    // _root.addChild(bg);

    _reelGroup = game.add.group(_root);
    _reelGroup.x = game.width / 2;
    _reelGroup.y = game.height / 2;

    _root.addChild(_reelGroup);

    var logo = game.add.image(game.width / 2, game.height / 2 - 370, "i18n", "reel_logo");
    logo.anchor.setTo(0.5);
    // logo.scale.setTo(0.9,0.9);
    _root.addChild(logo);

    var config = cache.get('__config');

    _timer = game.time.create(false);
    _timer.loop(Phaser.Timer.SECOND * 0.02, function () {
      update();
    }, this);

    for (var i = 0; i < config.reels.length; i++) {
      var reelConf = config.reels[i];
      var reel = new Reel(i, reelConf);
      _reelGroup.add(reel);
    }
  }


  return {

    create: create,

    setLayer: function (layer) {
      layer.addChild(_root);
    },

    show: function () {
      _root.visible = true;
    },

    hide: function () {
      _root.visible = false;
    },

    setSymbols: function (symbols) {
      _.each(_reelGroup.children, function (reel, i) {
        reel.setSymbols(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    start: function () {
      _scrollCounter = 0;

      for (var i = 0; i < _reelGroup.length; i++) {
        _reelGroup.children[i].start();
      }
      _timer.start();
      _started = true;
    },

    /**
     * 停止Reel
     */
    stop: function () {
      var symbolIds = stand(cache.get('spin').symbols);
      var symbols = getSymbolsByIds(symbolIds);
      _.each(_reelGroup.children, function (reel, i) {
        reel.stop(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    finishEvent: finishEvent
  }

});