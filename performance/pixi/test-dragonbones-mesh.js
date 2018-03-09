var count = 0;

//layers
var layer = {
  back: new PIXI.Container(),
  reel: new PIXI.Container(),
  effect: new PIXI.Container(),
  menu: new PIXI.Container(),
  front: new PIXI.Container()
};

var FPS = new PIXI.Text("");
FPS.x = 30;
FPS.y = 90;
layer.menu.addChild(FPS);

for (var key in layer) {
  app.stage.addChild(layer[key]);
}

var counter = 0;

var bg = PIXI.Sprite.fromImage("../assets/background.png");
bg.anchor.set(0.5);
bg.x = app.screen.width / 2;
bg.y = app.screen.height / 2;
layer.back.addChild(bg);

// Stop application wait for load to finish
app.stop();

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

const loader = new PIXI.loaders.Loader();
loader
  .add("main", "../assets/main.json")
  .add("i18n", "../assets/en.json")
  .add("pig_atlas", "../assets/dragonbones/pig_tex.json")
  .add("pig_tex", "../assets/dragonbones/pig_tex.png")
  .add("pig_ske", "../assets/dragonbones/pig_ske.json")
  .use(function(res, next) {
    //Convert JOSN(Array) to JSON(Hash)
    if (res.name === "i18n" || res.name === "main") {
      var map = {};
      var frames = {};

      res.data.frames.forEach(function(e, i) {
        map[i] = e.filename;
        frames[e.filename] = e;
      });
      res.data.frames = frames;

      var textures = {};
      for (var i in res.textures) {
        textures[map[i]] = res.textures[i];
      }
      res.textures = textures;
    }

    next();
  })
  .load(function(loader, res){
    //controller
    var controller = new Controller(res);
    controller.create();
    controller.setLayer(layer.menu);
    controller.show();

    //reel
    var reelManager = new ReelManager(res);
    reelManager.create();
    reelManager.setLayer(layer.reel);
    reelManager.show();
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
    reelManager.setSymbols(symbols);
    reelManager.start();

    app.ticker.add(function(delta) {
      reelManager.update();
      if (counter++ % 10 === 0) {
        FPS.text = "FPS:" + app.ticker.FPS;
      }
      if (counter > 10000000000) {
        counter = 0;
      }
    });

    //dragonbones
    var factory = dragonBones.PixiFactory.factory;
    factory.parseDragonBonesData(res["pig_ske"].data);
    factory.parseTextureAtlasData(
      res["pig_atlas"].data,
      res["pig_tex"].texture
    );
    var armatureDisplay = factory.buildArmatureDisplay("pig", "pig");
    armatureDisplay.animation.play("idle");
    armatureDisplay.x = 300;
    armatureDisplay.y = 600.0;
    layer.front.addChild(armatureDisplay);

    app.start();
  });

var ReelManager = function(res) {
  var _root;

  var _reelGroup;

  /**
   * 滚动次数计数器
   */
  var _scrollCounter = 0;

  /************** 老虎机的一个轴 ***************/
  var Reel = function(index, conf) {
    PIXI.Container.call(this);

    this.x = conf.pos[0];
    this.y = conf.pos[1];

    //轴是否停止旋转
    this.stoped = true;

    this.conf = conf;
    this.index = index;

    this.initMask();
  };

  Reel.prototype = Object.create(PIXI.Container.prototype);
  Reel.prototype.constructor = Reel;

  /**
   * 初始化遮罩（图标显示区域）
   */
  Reel.prototype.initMask = function() {
    var mask = new PIXI.Graphics();
    app.stage.addChild(mask);
    mask.x = this.conf.mask.x + _reelGroup.x;
    mask.y = this.conf.mask.y + _reelGroup.y;
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

      for (var i = 0; i < this.children.length; i++) {
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
    var symbol = new PIXI.Sprite(res[atlas].textures[frame]);
    symbol.x = x;
    symbol.y = y;
    symbol.anchor.set(0.5);
    this.addChild(symbol);
    return symbol;
  };

  //随机产生一个图标(配置信息，并非真正的sprite)
  Reel.prototype.randomSymbol = function(blur) {
    return _.sample(cache.symbols);
  };

  //设置本轴所有图标
  Reel.prototype.setSymbols = function(symbols) {
    this.removeChildren();
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

  /**
   * 初始化滚轮
   */
  function create() {
    _root = new PIXI.Container();
    _root.visible = false;

    var bg = new PIXI.Sprite(res.main.textures["reelBg"]);
    bg.x = app.screen.width / 2;
    bg.y = app.screen.height / 2;
    bg.anchor.set(0.5);
    _root.addChild(bg);

    _reelGroup = new PIXI.Container();
    _reelGroup.x = app.screen.width / 2;
    _reelGroup.y = app.screen.height / 2;
    _root.addChild(_reelGroup);

    var logo = new PIXI.Sprite(res.i18n.textures["reel_logo"]);
    logo.x = app.screen.width / 2;
    logo.y = app.screen.height / 2 - 370;
    logo.anchor.set(0.5);
    _root.addChild(logo);

    for (var i = 0; i < cache.reels.length; i++) {
      var reelConf = cache.reels[i];
      var reel = new Reel(i, reelConf);
      _reelGroup.addChild(reel);
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

    update: update,

    setSymbols: function(symbols) {
      _.each(_reelGroup.children, function(reel, i) {
        reel.setSymbols(symbols.slice(i * 3, (i + 1) * 3));
      });
    },

    start: function() {
      _scrollCounter = 0;

      for (var i = 0; i < _reelGroup.children.length; i++) {
        _reelGroup.children[i].start();
      }
      _started = true;
    },

    stop: function() {
      var symbolIds = stand(cache.get("spin").symbols);
      var symbols = getSymbolsByIds(symbolIds);
      _.each(_reelGroup.children, function(reel, i) {
        reel.stop(symbols.slice(i * 3, (i + 1) * 3));
      });
    }
  };
};

var Controller = function(res) {
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
    _root = new PIXI.Container();
    _root.visible = false;
    _root.x = app.screen.width / 2;
    _root.y = app.screen.height - 100;

    var bg = new PIXI.Sprite(res.i18n.textures["ui_toolbar"]);
    bg.anchor.set(0.5);
    _root.addChild(bg);

    _btnGroup = new PIXI.Container();
    _root.addChild(_btnGroup);

    // 减少投注
    _btnBetSub = new PIXI.Sprite(res.main.textures["btn_minus_pass"]);
    _btnBetSub.buttonMode = true;
    _btnBetSub.x = -660;
    _btnBetSub.y = -40;
    _btnBetSub.anchor.set(0.5);
    _btnGroup.addChild(_btnBetSub);

    //增加投注
    _btnBetAdd = new PIXI.Sprite(res.main.textures["btn_plus_pass"]);
    _btnBetAdd.buttonMode = true;
    _btnBetAdd.x = -480;
    _btnBetAdd.y = -40;
    _btnBetAdd.anchor.set(0.5);
    _btnGroup.addChild(_btnBetAdd);

    // 线-
    _btnLineSub = new PIXI.Sprite(res.main.textures["btn_minus_pass"]);
    _btnLineSub.buttonMode = true;
    _btnLineSub.x = -660;
    _btnLineSub.y = 35;
    _btnLineSub.anchor.set(0.5);
    _btnGroup.addChild(_btnLineSub);

    //线+
    _btnLineAdd = new PIXI.Sprite(res.main.textures["btn_plus_pass"]);
    _btnLineAdd.buttonMode = true;
    _btnLineAdd.x = -480;
    _btnLineAdd.y = 35;
    _btnLineAdd.anchor.set(0.5);
    _btnGroup.addChild(_btnLineAdd);

    //
    _btnMaxBet = new PIXI.Sprite(res.i18n.textures["btn_maxbet_pass"]);
    _btnMaxBet.buttonMode = true;
    _btnMaxBet.x = -127;
    _btnMaxBet.y = 0;
    _btnMaxBet.anchor.set(0.5);
    _btnGroup.addChild(_btnMaxBet);

    _btnSpin = new PIXI.Sprite(res.main.textures["btn_spin_pass"]);
    _btnSpin.buttonMode = true;
    _btnSpin.x = 15;
    _btnSpin.y = -8;
    _btnSpin.anchor.set(0.5);
    _btnGroup.addChild(_btnSpin);

    _btnAutoPlay = new PIXI.Sprite(res.i18n.textures["btn_autoplay_pass"]);
    _btnAutoPlay.buttonMode = true;
    _btnAutoPlay.x = 156;
    _btnAutoPlay.y = 1;
    _btnAutoPlay.anchor.set(0.5);
    _btnGroup.addChild(_btnAutoPlay);

    _btnPaytable = new PIXI.Sprite(res.i18n.textures["btn_paytable_pass"]);
    _btnPaytable.buttonMode = true;
    _btnPaytable.x = 579;
    _btnPaytable.y = 32;
    _btnPaytable.anchor.set(0.5);
    _btnGroup.addChild(_btnPaytable);
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
};

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
