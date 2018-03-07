define(function (require, exports, module) {

  var assets = require('assets');

  var _root = game.add.group();
  var _frameGroup = game.add.group();
  var _symbolGroup = game.add.group();

  _root.addChild(_symbolGroup);
  _root.addChild(_frameGroup);

  var _bonusSymbol;
  var _clawSymbol;

  function createSymbol(x, y, name) {

    var atlas = "atlas_name_error";
    var animName = name;

    switch (name) {
      case "SYM1_1":
        atlas = "wild";
        animName = "SYM1_1";
        break;
      case "SYM1_2":
        atlas = "wild";
        animName = "SYM1_2";
        break;
      case "SYM1_3":
        atlas = "wild";
        animName = "SYM1_3";
        break;
      case "SYM1_4":
        atlas = "wild";
        animName = "SYM1_4";
        break;
      case "SYM0":
        atlas = "special_symbols";
        break;
      case "SYM2":
        _bonusSymbol.x = x;
        _bonusSymbol.y = y;
        return _bonusSymbol;
      case "SYM13":
        _clawSymbol.x = x;
        _clawSymbol.y = y;
        return _clawSymbol;
      case "SYM3":
      case "SYM4":
      case "SYM5":
      case "SYM6":
      case "SYM7":
        atlas = "medium_win";
        break;
      case "SYM8": //A
      case "SYM9": //k
      case "SYM10": //q
      case "SYM11": //j
      case "SYM12": //10
        atlas = "low_win";
        animName = "win";
        break;
    }

    var symbol = game.add.image(x, y, atlas, name);
    symbol.anchor.setTo(0.5, 0.5);

    _symbolGroup.addChild(symbol);

    return symbol;
  }

  return {
    create: function () {
      return;
      for (var i = 0; i < 15; i++) {
        var col = Math.floor(i / assets.config.reels.rows);
        var row = i % assets.config.reels.rows;
        var pos = assets.config.reels.position[col][row];
        var frame = game.add.spine(pos[0], pos[1], 'win_frame');
        frame.visible = false;
        _frameGroup.addChild(frame);
      }

      _bonusSymbol = game.add.spine(-200, -200, 'special_symbols');
      _bonusSymbol.data = "SYM2";
      _bonusSymbol.visible = false;

      _clawSymbol = game.add.spine(-200, -200, 'special_symbols');
      _clawSymbol.data = "SYM13";
      _clawSymbol.visible = false;

      _symbolGroup.addChild(_bonusSymbol);
      _symbolGroup.addChild(_clawSymbol);

    },
    setLayer: function (layer) {
      layer.addChild(_root);
    },
    createSymbol: createSymbol,
    getFrame: function (index) {
      return _frameGroup.getChildAt(index);
    }
  };
});