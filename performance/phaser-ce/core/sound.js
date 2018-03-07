define(function (require, exports, module) {

  var event = require('event');
  var cache = require('cache');

  var _audios = {};

  /**
   * 
   * @param {string} name key of sound
   * @param {string} tag music or sound 
   */
  function preload(name, tag) {
    _audios[name] = {
      tag: tag || 'sound' //sound or music
    };
  }


  /**
   * switch music 
   * @param {bool} play: true to play,false to stop。
   */
  function switchMusic(play) {

    if (typeof play !== 'boolean') {
      play = false;
    }

    for (var item in _audios) {
      if (_audios[item].tag === 'music') {
        _audios[item].audioClip.mute = !play;
      }
    }
  }

  /**
   * switch sound effect 
   * @param {bool} play: true to play, false to stop。
   */
  function switchSound(play) {

    if (typeof play !== 'boolean') {
      play = false;
    }

    for (var item in _audios) {
      if (_audios[item].tag === 'sound') {
        _audios[item].audioClip.mute = !play;
      }
    }
  }

  /**
   * play music or sound
   * @param {String} name : name of sound or music
   */
  function play(name, loop) {

    if (typeof name !== 'string') {
      return;
    }

    var audio = _audios[name].audioClip;

    if (typeof loop !== 'boolean') {
      loop = false;
    }

    audio.loop = loop;
    audio.play();
  }

  /**
   * stop music or sound
   * @param {String} name : name of sound or music
   */
  function stop(name) {

    if (typeof name !== 'string') {
      return;
    }

    var audio = _audios[name].audioClip;

    audio.stop();
  }


  return {
    preload: preload,
    create: function () {
      for (var item in _audios) {
        var audio = game.add.audio(item);
        _audios[item].audioClip = audio;
      }
    },

    play: play,
    stop: stop,
    switchMusic: switchMusic,
    switchSound: switchSound
  };
});