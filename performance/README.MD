# HTML5游戏框架性能测试(移动设备).

## 结论

* Phaser-CE：
  * WebGL模式在移动设备上性能极差，无法在生产环境下使用。
  * Canvas模式在移动设备上性能优良。
* Phaser3 
  * WebGL和Canvas模式在移动设备上性能都很好。
* PIXI
  * WebGL和Canvas模式在移动设备上性能都很好。

## IPHONE 6s

* System
	* OS: IOS 11.2.6(15D100)
	* Model: A1688
	* Size: 4.7 inch
	* Resolution: 750 * 1334 pixel at 326 ppi
	* Chip: A9 64bit

* Render
  * Canvas
    * Safari

      | Framework | Version  |   FPS   |
      |---------- | -------- | ------- |
      | phaser-ce | 2.6.14   |  54~60  |
      | phaser3   | 3.0.10   | 流畅 |
      | pixi      | 3.5.5    | 58~60 |
      | phaser-ce + dragonbones |  | 55~60 |
      | phaser-ce + spine |  |  |
      | phaser-ce + spine(mesh) |  |  |
      | phaser3 + dragonbones | 不支持 | 龙骨目前不支持phaser3 |
      | phaser3 + spine |  |  |
      | phaser3 + spine(mesh) |  |  |
      | pixi + dragonbones |  |  |
      | pixi + dragonbones(mesh) |  |  |
      | pixi + spine |  |  |
      | pixi + spine(mesh) |  |  |

    * Chrome

    	| Framework | Version  |   FPS   |
    	|:--------- | -------- | ------- |
    	| phaser-ce | 2.6.14   | 58~60   |
    	| phaser3   | 3.0.10   | 流畅 |
    	| pixi      | 3.5.5    | 55~60 |
		| phaser-ce + dragonbones |  | 58~60 |
		| phaser-ce + spine |  |  |
		| phaser-ce + spine(mesh) |  |  |
		| phaser3 + dragonbones |  |  |
		| phaser3 + spine |  |  |
		| phaser3 + spine(mesh) |  |  |
		| pixi + dragonbones |  |  |
		| pixi + dragonbones(mesh) |  |  |
		| pixi + spine |  |  |
		| pixi + spine(mesh) |  |  |

  * WebGL
  	* safari

  		| Framework | Version |   FPS   | 备注 |
  		|:--------- | -------- | ------- |---------- |
  		| phaser-ce | 2.6.14   | 21~23   | 去掉mask帧率在32左右 |
  		| phaser3   | 3.0.10 | 流畅 |  |
  		| pixi      | 3.5.5    | 58~60 |  |
		| phaser-ce + dragonbones | 5.6.2 | 20~22 ||
		| phaser-ce + spine |  |  ||
		| phaser-ce + spine(mesh) |  |  ||
		| phaser3 + dragonbones | 不支持 |  ||
		| phaser3 + spine |  |  ||
		| phaser3 + spine(mesh) |  |  ||
		| pixi + dragonbones |  |  ||
		| pixi + dragonbones(mesh) |  |  ||
		| pixi + spine |  |  ||
		| pixi + spine(mesh) |  |  ||

  	* chrome

  		| Framework | Version  |   FPS   | 备注 |
  		|:--------- | -------- | ------- |---------- |
  		| phaser-ce | 2.6.14   | 21~23   | 去掉mask帧率在32~34左右 |
  		| phaser3   | 3.0.10   | 流畅 |  |
  		| pixi      | 3.5.5    | 55~60 |  |
		| phaser-ce + dragonbones |  | 21~23 ||
		| phaser-ce + spine |  |  ||
		| phaser-ce + spine(mesh) |  |  ||
		| phaser3 + dragonbones |  |  ||
		| phaser3 + spine |  |  ||
		| phaser3 + spine(mesh) |  |  ||
		| pixi + dragonbones |  |  ||
		| pixi + dragonbones(mesh) |  |  ||
		| pixi + spine |  |  ||
		| pixi + spine(mesh) |  |  ||

## Ipad 4 LTE
* System
	* OS: IOS 10.3.1(14E304)
	* Model: A1460
	* Size: 9.7 inch
	* Resolution: 2048 * 1536 pixel at 264 ppi
	* Chip: A6X

* Canvas
  * safari

    | framework | version  |   FPS   | 备注     |
    |:--------- | -------- | ------- | ------- |
    | phaser-ce | 2.6.14   |  57~60  | multiTexture:true fps 33~37 |
    | phaser3   | 3.0.10   | 流畅 ||
    | pixi      | 3.5.5    | 37~49 ||
	| phaser-ce + dragonbones |  |  |
	| phaser-ce + spine |  |  |
	| phaser-ce + spine(mesh) |  |  |
	| phaser3 + dragonbones |  |  |
	| phaser3 + spine |  |  |
	| phaser3 + spine(mesh) |  |  |
	| pixi + dragonbones |  |  |
	| pixi + dragonbones(mesh) |  |  |
	| pixi + spine |  |  |
	| pixi + spine(mesh) |  |  |
* WebGL
  * safari

    | framework | version  |   FPS   |
    |:--------- | -------- | ------- |
    | phaser-ce | 2.6.14   | 6~7   |
    | phaser3   | 3.0.10   | 流畅 |
    | pixi      | 3.5.5    | 58~60 |
	| phaser-ce + dragonbones |  |  |
	| phaser-ce + spine |  |  |
	| phaser-ce + spine(mesh) |  |  |
	| phaser3 + dragonbones |  |  |
	| phaser3 + spine |  |  |
	| phaser3 + spine(mesh) |  |  |
	| pixi + dragonbones |  |  |
	| pixi + dragonbones(mesh) |  |  |
	| pixi + spine |  |  |
	| pixi + spine(mesh) |  |  |


## Samsung 
* System
	* OS: Android 6.0
	* Model: S6

* Render
	* canvas
		* chrome()		

		| Framework | Version |  FPS  |
		|:--------- | -------- | ----- |
		| phaser-ce | 2.6.14   | 59~60 |
		| phaser3   | 3.0.10   | 流畅 |
		| pixi      | 3.5.5    |   |
		| phaser-ce + dragonbones |  |  |
		| phaser-ce + spine |  |  |
		| phaser-ce + spine(mesh) |  |  |
		| phaser3 + dragonbones |  |  |
		| phaser3 + spine |  |  |
		| phaser3 + spine(mesh) |  |  |
		| pixi + dragonbones |  |  |
		| pixi + dragonbones(mesh) |  |  |
		| pixi + spine |  |  |
		| pixi + spine(mesh) |  |  |

	* webgl
		* chrome()

		| framework | version  |  FPS  |
		|:--------- | -------- | ----- |
		| phaser-ce | 2.6.14   | 25~32 |
		| phaser3   | 3.0.10   | 流畅 |
		| pixi      | 3.5.5    |   |
		| phaser-ce + dragonbones |  |  |
		| phaser-ce + spine |  |  |
		| phaser-ce + spine(mesh) |  |  |
		| phaser3 + dragonbones |  |  |
		| phaser3 + spine |  |  |
		| phaser3 + spine(mesh) |  |  |
		| pixi + dragonbones |  |  |
		| pixi + dragonbones(mesh) |  |  |
		| pixi + spine |  |  |
		| pixi + spine(mesh) |  |  |