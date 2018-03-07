define(function (require, exports, module) {

  var _ = require('lodash');

  var event = require('event');
  var assets = require('assets');
  var cache = require('cache');
  var util = require('util');
  var sound = require('sound');

  var controller = require('./controller.js');


  var reel = require('./reel.js');
  var net = require('./net.js');


  // console.log("renderType", game.renderType, Phaser.CANVAS, Phaser.WEBGL)

  var _root = game.add.group();
  var _scatterSymbols = game.add.group();
  // var _backGroup = game.add.group();

  /**
   * 游戏层级
   */
  var _layer = {
    "back": game.add.group(),
    "ui": game.add.group(),

    "reel": game.add.group(),

    "animation": game.add.group(),
    "effect": game.add.group(),

    "games": game.add.group(),
    "menu": game.add.group(),
  };

  // var hideLines = _.debounce(line.hideAll, 1000);

  var style_light = {
    font: "bold 20px zcool",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  };

  var style_light_small = {
    font: "bold 14px zcool",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  };

  var _frameControl = 120;

  var MODE_NORMAL = 0;
  var MODE_AUTO = 1;
  var _playMode = MODE_NORMAL;

  var STATE_NORMAL = 0;
  var STATE_SPIN = 1;
  var STATE_WIN = 2;
  var STATE_CLAW = 4;
  var STATE_BONUS = 5;
  var STATE_SCATTER = 6;
  var STATE_BIG_WIN = 7;
  var STATE_ANIMATION = 8;
  var _state = STATE_NORMAL;

  event.createEvent.add(createEventHandler, this);


  reel.finishEvent.add(finishEventHandler, this);

  function setLayers() {

    controller.setLayer(_layer.ui);
    reel.setLayer(_layer.reel);
  }

  event.renderEvent.add(function () {
    dragonBones.PhaserFactory.factory.dragonBones.advanceTime(-1.0); // update.
  });

  function finishEventHandler() {}

  function createEventHandler() {

    var bg = game.add.image(game.width / 2, game.height / 2, "bg");
    bg.anchor.setTo(0.5);
    _layer.back.addChild(bg);

    var reelBg = game.add.image(game.width / 2, game.height / 2, "main", "reelBg");
    reelBg.anchor.setTo(0.5);
    _layer.back.addChild(reelBg);

    // sound.play('ambienceGeneral', true);
    controller.create();
    reel.create();

    setLayers();

    controller.show();
    reel.show();
    showAnimation();

    net.reqLogin({})
      .then(function (res) {
        cache.set('login', res.data);
        controller.enable();
        controller.ready(res.data);

        var symbolIds = stand(res.data.symbols);
        var symbols = getSymbolsByIds(symbolIds);
        reel.setSymbols(symbols);

      }).catch(function (res) {
        console.error('request game info error --->', res);
      });
  }
  //左边萤火虫粒子动画 
  function showAnimation() {

    //tengman
    var tmSp = game.add.sprite(350, -100, "main", "tengman");
    tmSp.anchor.setTo(0.5, 0);
    _layer.back.addChild(tmSp);
    timer = game.time.create(false);
    timer.loop(10000, function () {
      game.add.tween(tmSp).to({
        angle: 0.5
      }, 1000, Phaser.Easing.Quadratic.Out, true, 0, 2, true);
    }, this);

    timer.start();

    //leaves
    var leaves = game.add.image(0, 0, "main", "leaves");
    leaves.anchor.setTo(0);
    _layer.back.addChild(leaves);

    var stone1 = game.add.sprite(177, 682, "main", "ston1");
    stone1.anchor.setTo(0);
    stone1.alpha = 0;
    game.add.tween(stone1).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true, 800, 1000, true);
    _layer.back.addChild(stone1);

    var stone2 = game.add.sprite(70, 620, "main", "ston2");
    stone2.anchor.setTo(0);
    stone2.alpha = 0;
    game.add.tween(stone2).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    _layer.back.addChild(stone2);

    //emitter
    var emitter = game.add.emitter(200, 700, 0);
    _layer.back.addChild(emitter);
    emitter.makeParticles("main", "yinghuochong");
    emitter.setRotation(Math.random() * 180, Math.random() * 180);
    emitter.setAlpha(0.8, 1, 1000);
    emitter.setScale(0, 0.2, 0, 0.2, 200);
    emitter.gravity = (0, -1);
    emitter.setXSpeed = (1, 5),
      emitter.setYSpeed = (1, 5),
      emitter.start(false, 2000, 500, 0);


    //左侧人物动画
    dragonBones.PhaserFactory.init(game);

    var factory = dragonBones.PhaserFactory.factory;
    factory.parseDragonBonesData(game.cache.getJSON("man_ske"));
    factory.parseTextureAtlasData(game.cache.getJSON("man_json"), game.cache.getImage("man_tex", true).base);
    var armatureDisplay = factory.buildArmatureDisplay("man", "man");
    armatureDisplay.animation.play("idle");
    armatureDisplay.x = 340.0;
    armatureDisplay.y = 660.0;
    _layer.menu.addChild(armatureDisplay);
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

  return {
    spin: function () {},

  };


});