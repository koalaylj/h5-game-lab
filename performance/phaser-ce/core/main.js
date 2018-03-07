//         ┌─┐       ┌─┐
//      ┌──┘ ┴───────┘ ┴──┐
//      │                 │
//      │       ───       │
//      │  ─┬┘       └┬─  │
//      │                 │
//      │       ─┴─       │
//      │                 │
//      └───┐         ┌───┘
//          │         │
//          │         │
//          │         │
//          │         └──────────────┐
//          │                        │
//          │                        ├─┐
//          │                        ┌─┘
//          │                        │
//          └─┐  ┐  ┌───────┬──┐  ┌──┘
//            │ ─┤ ─┤       │ ─┤ ─┤
//            └──┴──┘       └──┴──┘
//              神兽保佑 代码无BUG!
//Code is far away from bug with the animal protection

define(function (require, exports, module) {

    //should require all engine module here.
    var event = require('event');
    var assets = require('assets');
    var extend = require('extend');
    var channel = require('channel');
    // var reel = require('reel');
    var line = require('line');
    var util = require('util');
    var cache = require('cache');
    var sound = require('sound');
    var i18n = require('i18n');

    window.game = new Phaser.Game(1200, 900, Phaser.AUTO, 'game');

    /**
     * bootstrap the game
     * boot --> load --> play
     */
    function boot() {
        this.preload = function () {
            //download loading assets
            game.load.spritesheet('__loading__', 'assets/preloader.png', 120, 130);

            //download game config file
            game.load.json('__config', cache.get('__game').config);

            game.stage.disableVisibilityChange = true;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.parentIsWindow = true;
            game.scale.setMaximum();
        };

        this.create = function () {
            //cache game config
            var config = game.cache.getJSON('__config');
            cache.set('__config', config);

            //resize the game canvas
            game.scale.setGameSize(config.meta.width, config.meta.height);
            game.state.start('load');
        };
    }

    function load() {
        this.preload = function () {
            //download i18n file
            var conf = cache.get('__config').i18n;
            var lang = i18n.detectLanguage(conf);
            var uri = i18n.getLanguageFileUri(conf.directory, lang);
            cache.set('__language', lang);
            game.load.json('__i18n', uri);
        };

        this.create = function () {
            //cache i18n data
            var __i18n = game.cache.getJSON('__i18n');
            cache.set('__i18n', __i18n);
            console.log('i18n', i18n.get('ui.spin.win', {
                money: 19
            }));
            game.state.start('play');
        };
    }

    function play() {

        var arc;

        this.preload = function () {
            //draw loading animation
            game.add.sprite(game.width / 2, game.height / 2, '__loading__', 1).anchor.set(0.5);
            var loadingBar = game.add.sprite(game.width / 2, game.height / 2, '__loading__', 0);
            loadingBar.anchor.setTo(0.5);
            arc = game.add.graphics(loadingBar.x - 40, loadingBar.y - 50);
            loadingBar.mask = arc;
            assets.preload();
        };

        this.loadUpdate = function () {
            arc.clear();
            arc.beginFill(0xFFFF00, 1);
            arc.lineStyle(0, 0xff0000);
            arc.arc(42, 42, 50, -Math.PI / 2, -Math.PI / 2 + (this.load.progress / 100) * Math.PI * 2, true);
            arc.endFill();
        };

        this.create = function () {
            var config = cache.get('__config');

            //load the specified game.（load the game entrance script.）
            require([config.main], function () {
                sound.create();
                event.createEvent.dispatch();
            });
        };

        this.update = function () {
            event.updateEvent.dispatch();
        };

        this.render = function () {
            event.renderEvent.dispatch();
        };
    }

    game.state.add('boot', boot);
    game.state.add('load', load);
    game.state.add('play', play);

    //todo
    var id = util.parseQueryString().id;
    var uri = util.getHost() + '/gate/';
    var msg = {
        gameId: id
    };

    //reqServerInfo -> reqGameInfo -> start('boot')
    channel.post(uri, msg, {
            'X-Game': JSON.stringify({
                InterfaceID: 90001,
                LoginCode: "",
                PassPort: "",
                SPECIALID: "",
                SinCode: "",
                GameLoginCode: ""
            })
        })
        .then(function (res) {
            cache.set('__server', res.data);

            //request game info
            channel.post(uri, msg, {
                    'X-Game': JSON.stringify({
                        InterfaceID: 90002,
                        LoginCode: "",
                        PassPort: "",
                        SPECIALID: "",
                        SinCode: "",
                        GameLoginCode: ""
                    })
                })
                .then(function (res) {
                    cache.set('__game', res.data);
                    game.state.start('boot');
                }).catch(function (res) {
                    console.error('can not connect server', res);
                });

        }).catch(function (res) {
            console.error('can not connect server', res);
        });

});