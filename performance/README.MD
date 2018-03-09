# HTML5 游戏框架性能测试(移动设备).

## 前言

> 说明：本性能测试主要针对移动设备上Phaser-CE, Phaser3, Pixi三个框架在Canvas和WebGL两种模式下的性能，还有使用龙骨和spine(有无mesh)动画时候的性能。
>
> 测试设备：Iphone6s， Ipad4，三星S6。
>
> 环境搭建：搭建http server，移动设备上访问 `performance`目录下相应页面即可，页面可看到FPS。
>
> 例外1：dragonbones phaser SDK不支持mesh，不支持Phaser3，本次测试不包括相关测试用例。
>
> 例外2：spine sdk不支持phaser3，本次测试不包括相关测试用例。
>
> FPS: 帧率超过30即可接受，认为可以流畅播放。

## 建议

- Phaser-CE ：
  - 移动设备上只能用canvas模式，webgl模式无法使用，非常卡顿。
  - dragonbones动画可以流畅播放(注：dragonbones phaser sdk目前不支持mesh)。
  - ios spine无mesh动画在canvas下播放流畅，在webgl下播放卡顿。
  - ios  spine有mesh动画在canvas和webgl下都播放卡顿，无法使用。
  - android 下 Spine动画有无mesh在canvas和webgl下都播放流畅。
  - Spine动画关于颜色渐变和alpha渐变动画无法播放。
  - canvas模式下，multiTexture 要设置为false。否则影响帧率(下降20FPS左右)。
- Phaser3
  - 移动设备上canvas和webgl模式都非常流畅。
  - dragonbones无法使用(注：dragonbones phaser sdk目前不支持phaser3)。
  - spine无法使用(注：spine phaser sdk目前不支持phaser3)。
- PIXI
  - 移动设备上canvas和webgl模式都非常流畅。
  - dragonbones无mesh动画在canvas和webgl下都可以流畅播放。
  - dragonbones有mesh动画在webgl下可以流畅播放，canvas下卡顿严重。
  - spine无mesh动画在canvas和webgl下都可流畅播放。
  - spine有mesh动画在webgl下流畅播放，canvas下卡顿，但是android上canvas模式还能接受。

## Iphone 6s

* System
	* OS: IOS 11.2.6(15D100)
	* Model: A1688
	* Size: 4.7 inch
	* Resolution: 750 * 1334 pixel at 326 ppi
	* Chip: A9 64bit

* 浏览器
  * Safari

    | Framework | SDK Version |   Canvas FPS   | WebGL FPS |
    |---------- | -------- | ------- |---------- |
    | phaser-ce | 2.6.14   |  54~60  | 21~23(去mask 32) |
    | phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
    | pixi      | 3.5.5    | 58~60 | 58~60 |
    | phaser-ce + dragonbones | dragonbones 5.6.2 | 55~60 | 20~22 |
    | phaser-ce + spine | spine  4.0.0-alpha1 | 60 | 20~21 |
    | phaser-ce + spine(mesh) | spine  4.0.0-alpha1 | 6~7 | 20~21 |
    | pixi + dragonbones | dragonbones 5.6.2 | 58~60 | 58~60 |
    | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 4~5 | 58~60 |
    | pixi + spine | spine  4.0.0-alpha1 | 58~60 | 58~60 |
    | pixi + spine(mesh) | spine  4.0.0-alpha1 | 7~8 | 58~60 |

  * Chrome

  	| Framework | SDK Version |   Canvas FPS   | WebGL FPS |
  	|:--------- | -------- | ------- |---------- |
  	| phaser-ce | 2.6.14   | 58~60   | 21~23(去mask 32~34) |
  	| phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
  	| pixi      | 3.5.5    | 55~60 | 55~60 |
  | phaser-ce + dragonbones | dragonbones 5.6.2 | 58~60 | 21~23 |
  | phaser-ce + spine | spine  4.0.0-alpha1 | 60 | 20~21 |
  | phaser-ce + spine(mesh) | spine  4.0.0-alpha1 | 7 | 20~21 |
  | pixi + dragonbones | dragonbones 5.6.2 | 58~60 | 58~60 |
  | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 5 | 58~60 |
  | pixi + spine | spine  4.0.0-alpha1 | 58~60 | 58~60 |
  | pixi + spine(mesh) | spine  4.0.0-alpha1 | 8 | 55~60 |

## Ipad 4 LTE
* System
	* OS: IOS 10.3.1(14E304)
	* Model: A1460
	* Size: 9.7 inch
	* Resolution: 2048 * 1536 pixel at 264 ppi
	* Chip: A6X

* 浏览器
  * safari

    | Framework | SDK Version |   Canvas FPS   | WebGL FPS |
    |:--------- | :------- | :------ | ------- |
    | phaser-ce | 2.6.14   |  57~60  | 6~7 |
    | phaser3   | 3.0.10   | 流畅(无mask) |流畅(无mask)|
    | pixi      | 3.5.5    | 37~49 |58~60|
    | phaser-ce + dragonbones | dragonbones 5.6.2 | 32~37 |7|
    | phaser-ce + spine | spine  4.0.0-alpha1 | 32~36 |7|
    | phaser-ce + spine(mesh) | spine  4.0.0-alpha1 | 5 |7|
    | pixi + dragonbones | dragonbones 5.6.2 | 31~44 |55~60|
    | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 4 |58~60|
    | pixi + spine | spine  4.0.0-alpha1 | 35~45 |58~60|
    | pixi + spine(mesh) | spine  4.0.0-alpha1 | 6 |58~60|


## Samsung S6 
* System
  * OS: Android 6.0

* 浏览器
  * chrome	

  | Framework | SDK Version |  Cavnas FPS  | WebGL FPS |
  |:--------- | -------- | ----- |---------- |
  | phaser-ce | 2.6.14   | 59~60 | 25~32 |
  | phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
  | pixi      | 3.5.5    | 45~60 | 58~60 |
  | phaser-ce + dragonbones | dragonbones 5.6.2 | 58~60 | 22~26 |
  | phaser-ce + spine | spine  4.0.0-alpha1 | 54~60 | 58~60 |
  | phaser-ce + spine(mesh) | spine  4.0.0-alpha1 | 39~45 | 60 |
  | pixi + dragonbones | dragonbones 5.6.2 | 58~60 | 58~60 |
  | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 20~60 | 51~60 |
  | pixi + spine | spine  4.0.0-alpha1 | 58~60 | 57~60 |
  | pixi + spine(mesh) | spine  4.0.0-alpha1 | 29~60 | 57~60 |