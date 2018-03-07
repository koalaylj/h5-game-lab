/**
 * event manager
 */
define(function (require, exports, module) {

  return {

    /**
     * Phaser state.update callback
     */
    updateEvent: new Phaser.Signal(),

    /**
     * Phaser state.render callback
     */
    renderEvent: new Phaser.Signal(),

    /**
     * 游戏引擎启动完毕事件，可当作state.create 事件
     */
    createEvent: new Phaser.Signal(),

    /**
     * 开始旋转事件
     * 参数：
     * 		@param：[Number] 底注
     *   	@param：[Number] 倍数
     *    @param：[Number] 线数
     */
    spinEvent: new Phaser.Signal(),

    /**
     * 旋转结束事件
     */
    spinFinishEvent: new Phaser.Signal(),

    /**
     * 每个reel 停止事件
     * 	@param:[Number] reelIndex 索引 从0开始
     */
    reelStopEvent: new Phaser.Signal(),

    /**
     * 音效
     *  参数1：[bool] 是否播放音效[true:播放，false:静音]
     */
    // soundChangedEvent: new Phaser.Signal(),

    /**
     * 音乐
     * 	@param:[bool] 是否播放音乐[true:播放，false:静音]
     */
    // musicChangedEvent: new Phaser.Signal(),

    /**
     * 错误事件
     * @param [string] reason of the error.
     */
    errorEvent: new Phaser.Signal()
  };
});