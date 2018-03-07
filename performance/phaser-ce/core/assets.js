define(function (require, exports, module) {

  var event = require('event');
  var cache = require('cache');
  var sound = require('sound');

  function preload() {
    var config = cache.get('__config');
    config.assets.forEach(function (asset) {
      switch (asset.type) {
        case 'webfont':
          game.load.webfont(asset.key, asset.name, asset.path);
          break;
        case 'image':
          game.load.image(asset.key, asset.path);
          break;
        case 'spritesheet':
          game.load.spritesheet(asset.key, asset.texture, asset.width, asset.height, asset.total);
          break;
        case 'atlas':
          if (asset.i18n) {
            var lang = cache.get('__language');
            game.load.atlas(asset.key, asset['i18n'][lang].texture, asset['i18n'][lang].atlas);
          } else {
            game.load.atlas(asset.key, asset.texture, asset.atlas);
          }
          break;
        case 'bitmapfont':
          game.load.bitmapFont(asset.key, asset.bitmap, asset.font);
          break;
        case 'audio':
          sound.preload(asset.key, asset.tag);
          game.load.audio(asset.key, asset.path);
          break;
        case 'video':
          game.load.video(asset.key, asset.path);
          break;
        case 'dragonbones':
          game.load.json(asset.atlas.key, asset.atlas.path);
          game.load.image(asset.texture.key, asset.texture.path);
          game.load.json(asset.ske.key, asset.ske.path);
          break;
        default:
          console.error("无法加载资源", asset);
          break;
      }
    });
  }

  /**
   * 增加一个图片
   * @param {"key":,"x":,"y":....} section [assets.json 资源配置节对象]
   */
  function addImage(target) {
    var atlas = target.atlas || cache.get('__config').default.atlas;
    var image = game.add.image(target.x, target.y, atlas, target.key);
    var anchor = target.anchor || [0, 0];
    image.anchor.setTo(anchor[0], anchor[1]);
    return image;
  }

  function addSprite(target) {
    var atlas = target.atlas || cache.get('__config').default.atlas;
    var sprite = game.add.sprite(target.x, target.y, atlas, target.key);
    var anchor = target.anchor || [0, 0];
    sprite.anchor.setTo(anchor[0], anchor[1]);
    return sprite;
  }

  function addText(target) {
    var style = target.style || cache.get('__config').default.style;
    var text = game.add.text(target.x, target.y, target.text, cache.get('__config').styles[style]);
    var anchor = target.anchor || [0, 0];
    text.anchor.setTo(anchor[0], anchor[1]);
    return text;
  }

  function addButton(target, action, context, group) {
    var atlas = target.atlas || cache.get('__config').default.atlas;

    var button = game.add.button(target.x, target.y, atlas,
      action,
      context, target.over, target.out, target.down, target.up, group || game.world);
    button.setDisableFrame(target.disable);
    var anchor = target.anchor || [0, 0];
    button.anchor.setTo(anchor[0], anchor[1]);
    return button;
  }

  // var mgr = new Loader();

  //////// new API
  var factory = {
    /**
     * 新增一个按钮
     * @param  {[type]} target  [description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    button: function (target, group, action, context) {
      var atlas = target.atlas || cache.get('__config').default.atlas;
      // var group = groups[target.group];

      var button = game.add.button(target.x, target.y, atlas,
        action,
        context, target.over, target.out, target.down, target.up, group);
      button.setDisableFrame(target.disable);
      var anchor = target.anchor || [0, 0];
      button.anchor.setTo(anchor[0], anchor[1]);
      return button;
    },

    /**
     * 新增图片
     * @param  {[type]} target  [description]
     * @return {[type]}         [description]
     */
    image: function (target) {
      var atlas = target.atlas || cache.get('__config').default.atlas;
      var image = game.add.image(target.x, target.y, atlas, target.key);
      var anchor = target.anchor || [0, 0];
      image.anchor.setTo(anchor[0], anchor[1]);
      return image;
    },

    text: function (target) {
      var style = target.style || cache.get('__config').default.style;
      var text = game.add.text(target.x, target.y, target.text, cache.get('__config').styles[style]);
      var anchor = target.anchor || [0, 0];
      text.anchor.setTo(anchor[0], anchor[1]);
      return text;
    }
  };

  return {
    preload: preload,
    addImage: addImage,
    addSprite: addSprite,
    addText: addText,
    addButton: addButton,
    add: factory
  };
});