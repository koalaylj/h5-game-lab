define(function (require, exports, module) {

  var net = require('./net.js');
  var cache = require('cache');
  var reel = require('./reel.js');

  var _root;
  var _btnGroup;
  var MAX_LINE = 20;
  var _betArr = [];
  var _lines = [];

  var style_txt_font = {
    font: "bold 30px zcool",
    fill: "#63ed08",
    align: 'left',
    stroke: "#352f43",
    strokeThickness: 4,
  };
  var LINE_NUMS = [4, 2, 20, 16, 10, 1, 11, 17, 3, 5, 14, 12, 9, 18, 6, 7, 19, 8, 13, 15];
  var LINE_POS = [520, 30, 510, 500, 20, 20, 60, 930, 0, 500,
    500, 550, 510, 500, 500, 0, 560, 500, 0, 900
  ];

  var _btnBetAdd;
  var _btnBetSub;
  var _btnLineAdd;
  var _btnLineSub;
  var _btnMaxBet;
  var _btnSpin;
  var _btnAutoPlay;
  var _btnPaytable;

  var _txtWin;
  var _txtBalance;
  var _txtTotalBet;
  var _txtBetMoney;
  var _txtLineCount;

  var _payOut;
  var _userMoney;
  var _totalBet
  var _betMoney;
  var _lineCount;


  var spinEvent = new Phaser.Signal();
  var autoPlayEvent = new Phaser.Signal();
  var payTableEvent = new Phaser.Signal();



  this.create = function () {

    _root = game.add.group();
    _root.visible = false;
    _root.position.y = -20;
    var bg = game.add.image(game.width / 2, game.height - 100, "i18n", "ui_toolbar");
    bg.anchor.setTo(0.5);
    _root.addChild(bg);
    _btnGroup = game.add.group(_root);
    _btnGroup.position.x = game.width / 2;
    _btnGroup.position.y = game.height - 100;
    // 减少投注
    _btnBetSub = game.add.button(-660, -40, "main",
      function () {
        this.reduceBet();
      }, this, "btn_minus_pass", "btn_minus_default", "btn_minus_push", "btn_minus_default", _btnGroup);
    _btnBetSub.anchor.setTo(0.5, 0.5);
    _btnBetSub.setDisableFrame("btn_minus_no");
    //增加投注
    _btnBetAdd = game.add.button(-480, -40, "main",
      function () {
        this.addBet();
      }, this, "btn_plus_pass", "btn_plus_default", "btn_plus_push", "btn_plus_default", _btnGroup);
    _btnBetAdd.anchor.setTo(0.5, 0.5);
    _btnBetAdd.setDisableFrame("btn_plus_no");

    // 线-
    _btnLineSub = game.add.button(-660, 35, "main",
      function () {
        this.reduceLine();
      }, this, "btn_minus_pass", "btn_minus_default", "btn_minus_push", "btn_minus_default", _btnGroup);
    _btnLineSub.anchor.setTo(0.5, 0.5);
    _btnLineSub.setDisableFrame("btn_minus_no");
    //线+
    _btnLineAdd = game.add.button(-480, 35, "main",
      function () {
        this.addLine();
      }, this, "btn_plus_pass", "btn_plus_default", "btn_plus_push", "btn_plus_default", _btnGroup);
    _btnLineAdd.anchor.setTo(0.5, 0.5);
    _btnLineAdd.setDisableFrame("btn_plus_no");

    //
    _btnMaxBet = game.add.button(-127, 0, "i18n",
      function () {
        _lineCount = MAX_LINE;
        this.updataBetInfo();

        this.spin();
      }, this, "btn_maxbet_pass", "btn_maxbet_default", "btn_maxbet_push", "btn_maxbet_default", _btnGroup);
    _btnMaxBet.anchor.setTo(0.5, 0.5);
    _btnMaxBet.setDisableFrame("btn_maxbet_no");

    _btnSpin = game.add.button(15, -8, "main",
      function () {
        this.spin();

      }, this, "btn_spin_pass", "btn_spin_default", "btn_spin_push", "btn_spin_default", _btnGroup);
    _btnSpin.anchor.setTo(0.5, 0.5);
    _btnSpin.setDisableFrame("btn_spin_no");

    _btnAutoPlay = game.add.button(156, 1, "i18n",
      function () {
        autoPlayEvent.dispatch();
      }, this, "btn_autoplay_pass", "btn_autoplay_default", "btn_autoplay_push", "btn_autoplay_default", _btnGroup);
    _btnAutoPlay.anchor.setTo(0.5, 0.5);
    _btnAutoPlay.setDisableFrame("btn_autoplay_no");

    _btnPaytable = game.add.button(579, 32, "i18n",
      function () {
        payTableEvent.dispatch();
      }, this, "btn_paytable_pass", "btn_paytable_default", "btn_paytable_push", "btn_paytable_default", _btnGroup);
    _btnPaytable.anchor.setTo(0.5, 0.5);
    _btnPaytable.setDisableFrame("btn_paytable_no");

    //txts
    _txtBetMoney = _root.add(game.add.text(400, 850, "100", style_txt_font));
    _txtLineCount = _root.add(game.add.text(400, 925, "100", style_txt_font));
    _txtTotalBet = _root.add(game.add.text(650, 900, "100", style_txt_font));
    _txtWin = _root.add(game.add.text(1330, 900, "100", style_txt_font));
    _txtBalance = _root.add(game.add.text(1550, 850, "100", style_txt_font));

    this.disable();
    //lines    
    for (var i = 0; i < LINE_NUMS.length; i++) {
      var line = new Line({
        button: {
          x: i < LINE_NUMS.length / 2 ? 470 : 1525,
          y: 280 + (i % (LINE_NUMS.length / 2)) * 40,
          atlas: "main",
          over: "num_" + LINE_NUMS[i] + "_hover",
          down: "num_" + LINE_NUMS[i] + "_press",
          out: "num_" + LINE_NUMS[i] + "_leave",
          up: "num_" + LINE_NUMS[i] + "_press",
          id: i
        },
        line: {
          x: 1000,
          y: LINE_POS[i],
          atlas: "line",
          key: "line_" + LINE_NUMS[i]
        }
      });
      _lines.push(line);
    }
  }

  //spin  
  this.spin = function () {
    // spinEvent.dispatch();
    // alert(start)

    require(['./start.js'], function (start) {

      reel.start();

      cache.remove('spin');

      net.reqSpin({
          "userID": 0, //[Number] user id
          "loginCode": "", //[String] code from server
          "gameMoney": 1, //[Number] 底注 
          "lineCount": 5 //[Number] 线数
        })
        .then(function (res) {
          cache.set('spin', res.data);

          // controller.enable();
          // controller.ready(res.data);

        }).catch(function (res) {
          console.error('request game info error --->', res);
        });


    })

    // start.spin();
  }
  //line +
  this.addLine = function () {
    _lineCount++;
    this.updataBetInfo();
  }
  //line -
  this.reduceLine = function () {
    _lineCount--;
    this.updataBetInfo();
  }
  //bet +  
  this.addBet = function () {
    if (_betArr.indexOf(_betMoney) < _betArr.length - 1) {
      _betMoney = _betArr[_betArr.indexOf(_betMoney) + 1];
    }
    this.updataBetInfo();
  }
  //bet-  
  this.reduceBet = function () {
    if (_betArr.indexOf(_betMoney) > 0) {
      _betMoney = _betArr[_betArr.indexOf(_betMoney) - 1];
    }
    this.updataBetInfo();
  }

  //bet info
  this.updataBetInfo = function () {
    _txtLineCount.text = _lineCount;
    _txtBetMoney.text = _betMoney;

    _txtLineCount.text = _lineCount;
    _txtTotalBet.text = (_betMoney * _lineCount).toFixed(2);

    var _betIndex = _betArr.indexOf(_betMoney);
    _btnBetAdd.enabled = _betIndex !== _betArr.length - 1;
    _btnBetSub.enabled = _betIndex !== 0;

    _btnLineAdd.enabled = _lineCount !== MAX_LINE;
    _btnLineSub.enabled = _lineCount !== 1;
  }


  this.enable = function () {
    for (var i = 0; i < _btnGroup.children.length; i++) {
      var child = _btnGroup.getChildAt(i);
      child.enabled = true;
    }
  }
  this.disable = function () {
    for (var i = 0; i < _btnGroup.children.length; i++) {
      var child = _btnGroup.getChildAt(i);
      child.enabled = false;
    }
  }


  var Line = function (options) {

    var root = game.add.group();

    this.button = game.add.button(options.button.x, options.button.y, options.button.atlas,
      function () {},
      this, options.button.over, options.button.out, options.button.down, options.button.up, root);
    if (options.button.id < 2) {
      this.button.x = this.button.x - 10;
    };

    this.button.anchor.setTo(0.5);
    this.button.onInputOver.add(function () {
      this.show();
    }, this);
    this.button.onInputOut.add(function () {
      this.hide();
    }, this);
    this.line = game.add.sprite(options.line.x, options.line.y, options.line.atlas, options.line.key);
    this.line.anchor.setTo(0.5, 0);
    root.addChild(this.button);
    root.addChild(this.line);
    _root.addChild(root);


    this.show = function () {
      this.line.visible = true;
    };
    this.hide = function () {
      this.line.visible = false;
    };

    this.hide();
  };



  this.hideAll = function () {
    _lines.forEach(function (e) {
      e.hide();
    });

  }
  this.showAll = function () {
    _lines.forEach(function (e) {
      e.show();
    });
  }

  /**
   * 显示ids指定线
   * @param  {[Array or Number]} ids [要显示的线的id或者id数组]
   */
  this.show = function (ids) {
    // if (ids instanceof Array) {
    //   ids.forEach(function (id) {
    //     _lines[getLineIndex(id)].show();
    //   });
    // } else {
    //   _lines[getLineIndex(ids)].show();
    // }
    ids.forEach(function (id) {
      _lines[getLineIndex(id)].show();
    });
  }

  this.getLineIndex = function (id) {
    for (var i = 0; i < LINE_NUMS.length; i++) {
      if (LINE_NUMS[i] === id) {
        return i;
      }
    }

    throw "bad line id" + id;
  }

  /**
   * 隐藏indexs指定线
   * @param  {[Array or Number]} indexs [要隐藏的线的index或者index数组]
   */
  this.hide = function (index) {
    _lines[index].hide();
  }

  this.setLayer = function (layer) {
    layer.addChild(_root);
  }
  this.ready = function (gameInfo) {
    _lineCount = gameInfo.betLines || MAX_LINE;
    _betMoney = gameInfo.betMoney;
    _payOut = gameInfo.allWin;
    _userMoney = gameInfo.balance;
    _betArr = gameInfo.betArr;
    _totalBet = _betMoney * _lineCount;

    _txtWin.text = _payOut;
    _txtBalance.text = _userMoney;
    this.updataBetInfo();

  }
  this.show = function () {
    _root.visible = true;
  }
  this.hide = function () {
    _root.visible = false;
  }

  this.showWinMoney = function (win) {
    _payOut = win;
    _txtWin.text = _payOut.toFixed(2);
  }
  this.rest = function () {
    _payOut = 0;
    _txtWin.text = "0";
  }

  return this;
});