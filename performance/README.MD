# HTML5 游戏框架性能测试(移动设备).

## 前言

> 说明：本性能测试主要针对移动设备上Phaser-CE, Phaser3, Pixi三个框架在Canvas和WebGL两种模式下的性能，还有使用龙骨和spine(有无mesh)动画时候的性能。
>
> 测试设备：Iphone6s， Ipad4，三星S6。
>
> 环境搭建：搭建http server，移动设备上访问 `performance`目录下相应页面即可，页面可看到FPS。
>
> 例外：dragonbones phaser SDK不支持mesh，不支持Phaser3，所以本次测试不包括相关测试用例。

## 结论

* Phaser-CE：
  * WebGL模式在移动设备上性能极差，卡顿严重，无法在生产环境下使用。
  * Canvas模式在移动设备上性能优良，可流畅播放动画。
  * Phaser-CE + Dragonbones canvas下流畅，webgl卡顿(应该和dragonbones关系不大)。
* Phaser3 
  * WebGL和Canvas模式在移动设备上性能很好，可流畅播放动画。
* PIXI
  * WebGL和Canvas模式在移动设备上性能都很好，可流畅播放动画。
  * PIXI+ dragonbones(无mesh) canvas和webgl都很流畅。
  * PIXI + dragonbones(有mesh) canvas下令人发指的卡顿(5~6fps)，webgl流畅。

## 建议

- Phaser-CE ：
  - 移动设备上只能用canvas模式，webgl模式无法使用，非常卡顿。
  - dragonbones动画可以流畅播放(注：dragonbones phaser sdk目前不支持mesh)。
- Phaser3
  - 移动设备上canvas和webgl模式都非常流畅。
  - dragonbones无法使用(注：dragonbones phaser sdk目前不支持phaser3)。
- PIXI
  - 移动设备上canvas和webgl模式都非常流畅。
  - dragonbones无mesh动画在canvas和webgl下都可以流畅播放。
  - dragonbones有mesh动画在webgl下可以流畅播放，canvas下卡顿严重。

## Iphone 6s

* System
	* OS: IOS 11.2.6(15D100)
	* Model: A1688
	* Size: 4.7 inch
	* Resolution: 750 * 1334 pixel at 326 ppi
	* Chip: A9 64bit

* 浏览器
  * Safari

    | Framework | Version  |   Canvas FPS   | WebGL FPS |
    |---------- | -------- | ------- |---------- |
    | phaser-ce | 2.6.14   |  54~60  | 21~23(去mask 32) |
    | phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
    | pixi      | 3.5.5    | 58~60 | 58~60 |
    | phaser-ce + dragonbones | dragonbones 5.6.2 | 55~60 | 20~22 |
    | phaser-ce + spine |  |  |  |
    | phaser-ce + spine(mesh) |  |  |  |
    | phaser3 + spine |  |  |  |
    | phaser3 + spine(mesh) |  |  |  |
    | pixi + dragonbones | dragonbones 5.6.2 | 58~60 | 58~60 |
    | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 4~5 | 58~60 |
    | pixi + spine |  |  |  |

  * Chrome

  	| Framework | Version  |   Canvas FPS   | WebGL FPS |
  	|:--------- | -------- | ------- |---------- |
  	| phaser-ce | 2.6.14   | 58~60   | 21~23(去mask 32~34) |
  	| phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
  	| pixi      | 3.5.5    | 55~60 | 55~60 |
  | phaser-ce + dragonbones | dragonbones 5.6.2 | 58~60 | 21~23 |
  | phaser-ce + spine |  |  |  |
  | phaser-ce + spine(mesh) |  |  |  |
  | phaser3 + spine |  |  |  |
  | phaser3 + spine(mesh) |  |  |  |
  | pixi + dragonbones | dragonbones 5.6.2 | 58~60 | 58~60 |
  | pixi + dragonbones(mesh) | dragonbones 5.6.2 | 5 | 58~60 |
  | pixi + spine |  |  |  |
  | pixi + spine(mesh) |  |  |  |

## Ipad 4 LTE
* System
	* OS: IOS 10.3.1(14E304)
	* Model: A1460
	* Size: 9.7 inch
	* Resolution: 2048 * 1536 pixel at 264 ppi
	* Chip: A6X

* 浏览器
  * safari

    | Framework | Version  |   Canvas FPS   | WebGL FPS |
    |:--------- | :------: | :------ | ------- |
    | phaser-ce | 2.6.14   |  57~60(multiTexture:true 33~37)  | 6~7 |
    | phaser3   | 3.0.10   | 流畅(无mask) |流畅(无mask)|
    | pixi      | 3.5.5    | 37~49 |58~60|
  | phaser-ce + dragonbones | dragonbones 5.6.2 |  ||
  | phaser-ce + spine |  |  ||
  | phaser-ce + spine(mesh) |  |  ||
  | phaser3 + spine |  |  ||
  | phaser3 + spine(mesh) |  |  ||
  | pixi + dragonbones |  |  ||
  | pixi + dragonbones(mesh) |  |  ||
  | pixi + spine |  |  ||
  | pixi + spine(mesh) |  |  ||


## Samsung S6 
* System
  * OS: Android 6.0

* 浏览器
  * chrome	

  | Framework | Version |  Cavnas FPS  | WebGL FPS |
  |:--------- | -------- | ----- |---------- |
  | phaser-ce | 2.6.14   | 59~60 | 25~32 |
  | phaser3   | 3.0.10   | 流畅(无mask) | 流畅(无mask) |
  | pixi      | 3.5.5    |   |  |
  | phaser-ce + dragonbones | dragonbones 5.6.2 |  |  |
  | phaser-ce + spine |  |  |  |
  | phaser-ce + spine(mesh) |  |  |  |
  | phaser3 + spine |  |  |  |
  | phaser3 + spine(mesh) |  |  |  |
  | pixi + dragonbones |  |  |  |
  | pixi + dragonbones(mesh) |  |  |  |
  | pixi + spine |  |  |  |
  | pixi + spine(mesh) |  |  |  |