var Main = {};

Main.Boot = function() {};

Main.Boot.prototype.constructor = Main.Boot;

Main.Boot.prototype = {
  preload: function() {
    //allow inspect fps.
    // game.time.advancedTiming = true;

    this.load.atlas("main", "../assets/main.png", "../assets/main.json");
    this.load.image("background", "../assets/background.png");
    this.load.atlas("i18n", "../assets/en.png", "../assets/en.json");
  },

  create: function() {
    //layers
    var layers = {
      back: this.add.group(),
      reel: this.add.group(),
      effect: this.add.group(),
      menu: this.add.group()
    };

    // debugger;
    //background image
    var background = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      "background"
    );
    Phaser.Actions.SetXY(
      background,
      game.config.width / 2,
      game.config.height / 2
    );
    Phaser.Actions.SetOrigin(background, 0, 0);
    layers.back.add(background);

    this.reelManager = new ReelManager(this);
    this.reelManager.create();
    this.reelManager.setLayer(layers.reel);

    //initialize
    var controller = new Controller(this);
    controller.create();
    controller.setLayer(layers.menu);

    //show
    controller.show();
    this.reelManager.show();

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
    this.reelManager.setSymbols(symbols);
    this.reelManager.start();
  },

  // render: function () {
  //     game.debug.text('fps:' + game.time.fps || '--', 20, 40, "#00ff00");
  // },

  update: function() {
    this.reelManager.update();
  }
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

var ReelManager = function(boss) {
  var _root;

  var _reelGroup;

  /**
   * 滚动次数计数器
   */
  var _scrollCounter = 0;

  // var finishEvent = new Phaser.Signal();

  /************** 老虎机的一个轴 ***************/
  var Reel = function(index, conf) {
    Phaser.GameObjects.Group.call(this, game);

    // this.x = conf.pos[0];
    // this.y = conf.pos[1];

    // Phaser.Actions.SetXY(this,conf.pos[0],conf.pos[1]);

    //轴是否停止旋转
    this.stoped = true;

    this.conf = conf;
    this.index = index;

    // this.initMask();
  };

  Reel.prototype = Object.create(Phaser.GameObjects.Group.prototype);
  Reel.prototype.constructor = Reel;

  /**
   * 初始化遮罩（图标显示区域）
   */
  Reel.prototype.initMask = function() {
    var self = this;
    var mask = boss.make.graphics({
      x: self.conf.mask.x,
      y: self.conf.mask.y
    });

    mask.fillStyle(0x000000);
    mask.fillRect(0, 0, this.conf.mask.w, this.conf.mask.h);

    // if (this.mask !== null) {
    //   this.mask.destroy();
    // }
    this.mask =  new Phaser.Display.Masks.GeometryMask(boss, mask);
  };

  //轴滚动
  Reel.prototype.scroll = function() {
    if (!this.stoped) {
      var bottomSymbol = this.children.entries[0];
      if (bottomSymbol.y >= this.conf.maxY) {
        this.remove(bottomSymbol);
        bottomSymbol.destroy();
        var prepare = this.conf.prepare;
        var symbol = this.randomSymbol();
        this.addSymbol(prepare[0], prepare[1], symbol.key, symbol.blur);
      }

      for (var i = 0; i < this.children.entries.length; i++) {
        this.children.entries[i].y += this.conf.speed;
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
    var symbol = boss.add.sprite(x, y, atlas, frame);
    // symbol.anchor.setTo(0.5, 0.5);
    this.add(symbol);
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
    this.clear(true);
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

    for (var i = 0; i < _reelGroup.children.entries.length; i++) {
      var reel = _reelGroup.children.entries[i];
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
          // finishEvent.dispatch();
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
    _root = boss.add.group();
    _root.visible = false;

    var bg = boss.add.image(
      game.config.width / 2,
      game.config.height / 2,
      "main",
      "reelBg"
    );
    _root.add(bg);

    _reelGroup = boss.add.group(_root);
    Phaser.Actions.SetXY(
      _reelGroup,
      game.config.width / 2,
      game.config.height / 2
    );

    _root.add(_reelGroup);

    var logo = boss.add.image(
      game.config.width / 2,
      game.config.height / 2 - 370,
      "i18n",
      "reel_logo"
    );
    // logo.anchor.setTo(0.5);
    _root.add(logo);

    for (var i = 0; i < cache.reels.length; i++) {
      var reelConf = cache.reels[i];
      var reel = new Reel(i, reelConf);
      _reelGroup.add(reel);
    }
  }

  return {
    create: create,

    setLayer: function(layer) {
      layer.add(_root);
    },

    show: function() {
      _root.visible = true;
    },

    hide: function() {
      _root.visible = false;
    },

    update: update,

    setSymbols: function(symbols) {
      _.each(_reelGroup.children.entries, function(reel, i) {
        reel.setSymbols(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    start: function() {
      _scrollCounter = 0;

      _.each(_reelGroup.children.entries, function(reel, i) {
        reel.start();
      });

      //   for (var i = 0; i < _reelGroup.length; i++) {
      //     _reelGroup.children[i].start();
      //   }
      _started = true;
    },

    /**
     * 停止Reel
     */
    stop: function() {
      var symbolIds = stand(cache.get("spin").symbols);
      var symbols = getSymbolsByIds(symbolIds);
      _.each(_reelGroup.children.entries, function(reel, i) {
        reel.stop(symbols.slice(i * 3, (i + 1) * 3));
      });
    }

    // finishEvent: finishEvent
  };
};

//control panel for slot machine.
var Controller = function(boss) {
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
    _root = boss.add.group();
    _root.visible = false;
    Phaser.Actions.SetXY(_root, 0, -20);
    // _root.position.y = -20;

    var bg = boss.add.image(
      game.config.width / 2,
      game.config.height - 100,
      "i18n",
      "ui_toolbar"
    );
    // bg.anchor.setTo(0.5);
    _root.add(bg);

    // _btnGroup = boss.add.group();
    // _root.add(_btnGroup);
    // Phaser.Actions.SetXY(_btnGroup, game.config.width / 2, game.config.height - 100);

    // // 减少投注
    // _btnBetSub = boss.add
    //   .image(-660+game.config.width , -40, "main", "btn_minus_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnBetSub);
    // // _btnBetSub.anchor.setTo(0.5, 0.5);

    // //增加投注
    // _btnBetAdd = boss.add
    //   .image(-480, -40, "main", "btn_plus_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnBetAdd);
    // // _btnBetAdd.anchor.setTo(0.5, 0.5);

    // // 线-
    // _btnLineSub = boss.add
    //   .image(-660, 35, "main", "btn_minus_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnLineSub);
    // // _btnLineSub.anchor.setTo(0.5, 0.5);

    // //线+
    // _btnLineAdd = boss.add
    //   .image(-480, 35, "main", "btn_plus_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnLineAdd);
    // // _btnLineAdd.anchor.setTo(0.5, 0.5);

    // //
    // _btnMaxBet = boss.add
    //   .image(-127, 0, "i18n", "btn_maxbet_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnMaxBet);
    // // _btnMaxBet.anchor.setTo(0.5, 0.5);

    // _btnSpin = boss.add.image(15, -8, "main", "btn_spin_pass").setInteractive();
    // _btnGroup.add(_btnSpin);
    // // _btnSpin.anchor.setTo(0.5, 0.5);

    // _btnAutoPlay = boss.add
    //   .image(156, 1, "i18n", "btn_autoplay_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnAutoPlay);
    // // _btnAutoPlay.anchor.setTo(0.5, 0.5);

    // _btnPaytable = boss.add
    //   .image(game.config.width - 200, game.config.height - 100, "i18n", "btn_paytable_pass")
    //   .setInteractive();
    // _btnGroup.add(_btnPaytable);
    // _btnPaytable.anchor.setTo(0.5, 0.5);
  }

  function spin() {}

  return {
    setLayer: function(layer) {
      layer.add(_root);
    },
    create: create,
    show: function() {
      _root.visible = true;
    }
  };
};

//game config data
var cache = {
  reels: [
    {
      pos: [-490, -290],
      maxY: 700,
      times: 30,
      speed: 60,
      prepare: [380, 0],
      symbols: [[380, 210], [380, 410], [380, 610]],
      mask: {
        x: 310,
        y: 130,
        w: 180,
        h: 600
      }
    },
    {
      pos: [-294, -290],
      maxY: 700,
      times: 50,
      speed: 60,
      prepare: [600, 0],
      symbols: [[600, 210], [600, 410], [600, 610]],
      mask: {
        x: 510,
        y: 130,
        w: 180,
        h: 600
      }
    },
    {
      pos: [-94, -290],
      maxY: 700,
      times: 70,
      speed: 60,
      prepare: [800, 0],
      symbols: [[800, 210], [800, 410], [800, 610]],
      mask: {
        x: 710,
        y: 130,
        w: 180,
        h: 600
      }
    },
    {
      pos: [106, -290],
      maxY: 700,
      times: 90,
      speed: 60,
      prepare: [1000, 0],
      symbols: [[1000, 210], [1000, 410], [1000, 610]],
      mask: {
        x: 910,
        y: 130,
        w: 180,
        h: 600
      }
    },
    {
      pos: [306, -290],
      maxY: 700,
      times: 120,
      speed: 60,
      prepare: [1200, 0],
      symbols: [[1200, 210], [1200, 410], [1200, 610]],
      mask: {
        x: 1110,
        y: 130,
        w: 180,
        h: 600
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

game.scene.add("Boot", Main.Boot, true);

// game.scene.start('main');
