function main() {
  this.init = function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  };

  this.preload = function() {
    // var isWebGL = game.config.renderer == 2;

    console.log("useMesh", useMesh);

    game.plugins.add(PhaserSpine.SpinePlugin, {
      // debugRendering:true,
      triangleRendering: useMesh
    });

    //allow inspect fps.
    game.time.advancedTiming = true;

    game.load.atlas("main", "../assets/main.png", "../assets/main.json");
    game.load.image("background", "../assets/background.png");
    game.load.atlas("i18n", "../assets/en.png", "../assets/en.json");

    game.load.spine("ugly", "../assets/spine/xqz.json");
  };

  this.create = function() {
    //layers
    var layers = {
      back: game.add.group(),
      reel: game.add.group(),
      effect: game.add.group(),
      menu: game.add.group(),
      front: game.add.group()
    };

    //background image
    var background = game.add.image(
      game.width / 2,
      game.height / 2,
      "background"
    );
    background.anchor.setTo(0.5, 0.5);
    layers.back.addChild(background);

    //controller
    controller.create();
    controller.setLayer(layers.menu);
    controller.show();

    //reel
    reel.create();
    reel.setLayer(layers.reel);
    reel.show();

    var symbols = getSymbolsByIds([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      10,
      10,
      10,
      10,
      11,
      11,
      11,
      11,
      11
    ]);
    reel.setSymbols(symbols);
    reel.start();

    //左侧人物动画
    var ugly = game.add.spine(0, 0, "ugly");
    ugly.setAnimationByName(0, "animation", true);
    ugly.setToSetupPose();
    layers.front.addChild(ugly);
  };

  this.render = function() {
    game.debug.text("fps:" + game.time.fps, 20, 40, "#00ff00");
  };

  this.update = function() {
    reel.update();
  };

  function getSymbolsByIds(symbolIds) {
    var symbols = [];
    _.each(symbolIds, function(symbolId) {
      var symbol = _.find(cache.symbols, function(item) {
        return item.id === symbolId;
      });
      symbols.push(symbol);
    });

    return symbols;
  }
}

var reel = (function() {
  var _root;

  var _reelGroup;

  /**
   * 滚动次数计数器
   */
  var _scrollCounter = 0;

  var finishEvent = new Phaser.Signal();

  /************** 老虎机的一个轴 ***************/
  var Reel = function(index, conf) {
    Phaser.Group.call(this, game);

    this.x = conf.pos[0];
    this.y = conf.pos[1];

    //轴是否停止旋转
    this.stoped = true;

    this.conf = conf;
    this.index = index;

    this.initMask();
  };

  Reel.prototype = Object.create(Phaser.Group.prototype);
  Reel.prototype.constructor = Reel;

  /**
   * 初始化遮罩（图标显示区域）
   */
  Reel.prototype.initMask = function() {
    var mask = game.add.graphics(
      this.conf.mask.x + _reelGroup.position.x,
      this.conf.mask.y + _reelGroup.position.y
    );
    mask.beginFill(0x000000);
    mask.drawRect(0, 0, this.conf.mask.w, this.conf.mask.h);
    if (this.mask !== null) {
      this.mask.destroy();
    }
    this.mask = mask;
  };

  //轴滚动
  Reel.prototype.scroll = function() {
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
  Reel.prototype.start = function() {
    this.stoped = false;
    var prepare = this.conf.prepare;
    var symbol = this.randomSymbol();
    this.addSymbol(prepare[0], prepare[1], symbol.key, symbol.blur);
  };

  //轴停止转动
  Reel.prototype.stop = function(symbols) {
    this.stoped = true;
    this.setSymbols(symbols);
    // emitter.reelStopSignal.dispatch(this.index);
  };

  //往轴内添加一个图标
  Reel.prototype.addSymbol = function(x, y, atlas, frame) {
    var symbol = game.add.sprite(x, y, atlas, frame);
    symbol.anchor.setTo(0.5, 0.5);
    this.addChild(symbol);
    // symbol.inputEnabled = true;
    // symbol.input.enableDrag(true);
    return symbol;
  };

  //随机产生一个图标(配置信息，并非真正的sprite)
  Reel.prototype.randomSymbol = function(blur) {
    return _.sample(cache.symbols);
  };

  //设置本轴所有图标
  Reel.prototype.setSymbols = function(symbols) {
    this.removeAll(true);
    for (var j = this.conf.symbols.length - 1; j >= 0; j--) {
      var symbolConf = this.conf.symbols[j];
      var symbol = symbols[j];
      this.addSymbol(symbolConf[0], symbolConf[1], symbol.key, symbol.frame);
    }
  };

  /*******************************************/

  var _started = false;

  function update() {
    if (!_started) {
      return;
    }
    _scrollCounter++;

    for (var i = 0; i < _reelGroup.children.length; i++) {
      var reel = _reelGroup.getChildAt(i);
      reel.scroll();

      var canStop = false; // _scrollCounter >= reel.conf.times;

      if (!reel.stoped && canStop) {
        var symbolIds = stand(cache.get("spin").symbols);
        var symbols = getSymbolsByIds(symbolIds);

        reel.stop(symbols.slice(i * 3, (i + 1) * 3));

        var allStoped = _.every(
          _reelGroup.children,
          function(e) {
            return e.stoped;
          },
          this
        );

        if (allStoped) {
          _started = false;
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
    var symbols = [];
    _.each(symbolIds, function(symbolId) {
      var symbol = _.find(cache.symbols, function(item) {
        return item.id === symbolId;
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

    var bg = game.add.image(game.width / 2, game.height / 2, "main", "reelBg");
    bg.anchor.setTo(0.5);
    _root.addChild(bg);

    _reelGroup = game.add.group(_root);
    _reelGroup.x = game.width / 2;
    _reelGroup.y = game.height / 2;

    _root.addChild(_reelGroup);

    var logo = game.add.image(
      game.width / 2,
      game.height / 2 - 370,
      "i18n",
      "reel_logo"
    );
    logo.anchor.setTo(0.5);
    _root.addChild(logo);

    for (var i = 0; i < cache.reels.length; i++) {
      var reelConf = cache.reels[i];
      var reel = new Reel(i, reelConf);
      _reelGroup.add(reel);
    }
  }

  return {
    create: create,

    setLayer: function(layer) {
      layer.addChild(_root);
    },

    show: function() {
      _root.visible = true;
    },

    hide: function() {
      _root.visible = false;
    },

    update: update,

    setSymbols: function(symbols) {
      _.each(_reelGroup.children, function(reel, i) {
        reel.setSymbols(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    start: function() {
      _scrollCounter = 0;

      for (var i = 0; i < _reelGroup.length; i++) {
        _reelGroup.children[i].start();
      }
      _started = true;
    },

    /**
     * 停止Reel
     */
    stop: function() {
      var symbolIds = stand(cache.get("spin").symbols);
      var symbols = getSymbolsByIds(symbolIds);
      _.each(_reelGroup.children, function(reel, i) {
        reel.stop(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    finishEvent: finishEvent
  };
})();

//control panel for slot machine.
var controller = (function() {
  var _root;
  var _btnGroup;

  var _btnBetAdd;
  var _btnBetSub;
  var _btnLineAdd;
  var _btnLineSub;
  var _btnMaxBet;
  var _btnSpin;
  var _btnAutoPlay;
  var _btnPaytable;

  function create() {
    _root = game.add.group();
    _root.visible = false;
    _root.position.y = -20;

    var bg = game.add.image(
      game.width / 2,
      game.height - 100,
      "i18n",
      "ui_toolbar"
    );
    bg.anchor.setTo(0.5);
    _root.addChild(bg);

    _btnGroup = game.add.group(_root);
    _btnGroup.position.x = game.width / 2;
    _btnGroup.position.y = game.height - 100;

    // 减少投注
    _btnBetSub = game.add.button(
      -660,
      -40,
      "main",
      function() {},
      this,
      "btn_minus_pass",
      "btn_minus_default",
      "btn_minus_push",
      "btn_minus_default",
      _btnGroup
    );
    _btnBetSub.anchor.setTo(0.5, 0.5);

    //增加投注
    _btnBetAdd = game.add.button(
      -480,
      -40,
      "main",
      function() {},
      this,
      "btn_plus_pass",
      "btn_plus_default",
      "btn_plus_push",
      "btn_plus_default",
      _btnGroup
    );
    _btnBetAdd.anchor.setTo(0.5, 0.5);

    // 线-
    _btnLineSub = game.add.button(
      -660,
      35,
      "main",
      function() {},
      this,
      "btn_minus_pass",
      "btn_minus_default",
      "btn_minus_push",
      "btn_minus_default",
      _btnGroup
    );
    _btnLineSub.anchor.setTo(0.5, 0.5);

    //线+
    _btnLineAdd = game.add.button(
      -480,
      35,
      "main",
      function() {},
      this,
      "btn_plus_pass",
      "btn_plus_default",
      "btn_plus_push",
      "btn_plus_default",
      _btnGroup
    );
    _btnLineAdd.anchor.setTo(0.5, 0.5);

    //
    _btnMaxBet = game.add.button(
      -127,
      0,
      "i18n",
      function() {},
      this,
      "btn_maxbet_pass",
      "btn_maxbet_default",
      "btn_maxbet_push",
      "btn_maxbet_default",
      _btnGroup
    );
    _btnMaxBet.anchor.setTo(0.5, 0.5);

    _btnSpin = game.add.button(
      15,
      -8,
      "main",
      function() {
        spin();
      },
      this,
      "btn_spin_pass",
      "btn_spin_default",
      "btn_spin_push",
      "btn_spin_default",
      _btnGroup
    );
    _btnSpin.anchor.setTo(0.5, 0.5);

    _btnAutoPlay = game.add.button(
      156,
      1,
      "i18n",
      function() {},
      this,
      "btn_autoplay_pass",
      "btn_autoplay_default",
      "btn_autoplay_push",
      "btn_autoplay_default",
      _btnGroup
    );
    _btnAutoPlay.anchor.setTo(0.5, 0.5);

    _btnPaytable = game.add.button(
      579,
      32,
      "i18n",
      function() {},
      this,
      "btn_paytable_pass",
      "btn_paytable_default",
      "btn_paytable_push",
      "btn_paytable_default",
      _btnGroup
    );
    _btnPaytable.anchor.setTo(0.5, 0.5);
  }

  function spin() {}

  return {
    setLayer: function(layer) {
      layer.addChild(_root);
    },
    create: create,
    show: function() {
      _root.visible = true;
    }
  };
})();

//game config data
var cache = {
  reels: [
    {
      pos: [-490, -290],
      maxY: 630,
      times: 30,
      speed: 60,
      prepare: [91, -100],
      symbols: [[91, 90], [91, 275], [91, 460]],
      mask: {
        x: -490,
        y: -290,
        w: 180,
        h: 550
      }
    },
    {
      pos: [-294, -290],
      maxY: 630,
      times: 50,
      speed: 60,
      prepare: [91, -90],
      symbols: [[91, 90], [91, 275], [91, 460]],
      mask: {
        x: -294,
        y: -290,
        w: 180,
        h: 550
      }
    },
    {
      pos: [-94, -290],
      maxY: 630,
      times: 70,
      speed: 60,
      prepare: [91, -90],
      symbols: [[91, 90], [91, 275], [91, 460]],
      mask: {
        x: -94,
        y: -290,
        w: 180,
        h: 550
      }
    },
    {
      pos: [106, -290],
      maxY: 630,
      times: 90,
      speed: 60,
      prepare: [91, -90],
      symbols: [[91, 90], [91, 275], [91, 460]],
      mask: {
        x: 106,
        y: -290,
        w: 180,
        h: 550
      }
    },
    {
      pos: [306, -290],
      maxY: 630,
      times: 120,
      speed: 60,
      prepare: [91, -90],
      symbols: [[91, 90], [91, 275], [91, 460]],
      mask: {
        x: 306,
        y: -290,
        w: 180,
        h: 550
      }
    }
  ],
  symbols: [
    {
      key: "main",
      frame: "sym_wild",
      blur: "sym_wild_blur",
      id: 8
    },
    {
      key: "main",
      frame: "sym_scatter",
      blur: "sym_scatter_blur",
      id: 9
    },
    {
      key: "main",
      frame: "sym_bonus",
      blur: "sym_bonus_blur",
      id: 10
    },
    {
      key: "main",
      frame: "sym_pet",
      blur: "sym_pet_blur",
      id: 5
    },
    {
      key: "main",
      frame: "sym_ugly",
      blur: "sym_ugly_blur",
      id: 6
    },
    {
      key: "main",
      frame: "sym_hot",
      blur: "sym_hot_blur",
      id: 7
    },
    {
      key: "main",
      frame: "sym_korean",
      blur: "sym_korean_blur",
      id: 4
    },
    {
      key: "main",
      frame: "sym_fire",
      blur: "sym_fire_blur",
      id: 3
    },
    {
      key: "main",
      frame: "sym_egg",
      blur: "sym_egg_blur",
      id: 2
    },
    {
      key: "main",
      frame: "sym_statue",
      blur: "sym_statue_blur",
      id: 1
    },
    {
      key: "main",
      frame: "sym_bone",
      blur: "sym_bone_blur",
      id: 0
    }
  ]
};

game.state.add("main", main);
game.state.start("main");
