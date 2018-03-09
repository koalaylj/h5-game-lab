# Performance Test.

## Iphone 6s
* System
	* OS: IOS 11.2.6(15D100)
	* Model: A1688
	* Size: 4.7 inch
	* Resolution: 750 * 1334 pixel at 326 ppi
	* Chip: A9 64bit

* Render
	* Canvas
		* safari
		
			| framework | version  |   FPS   |
			|:--------- | -------- | ------- |
			| phaser-ce | 2.6.14   |  54~60  |
			| phaser3   | 3.0.10   | 流畅 |
			| pixi      | 3.5.5    | 58~60 |
		
		* chrome()

			| framework | version  |   FPS   |
			|:--------- | -------- | ------- |
			| phaser-ce | 2.6.14   | 58~60   |
			| phaser3   | 3.0.10   | 流畅 |
			| pixi      | 3.5.5    | 55~60 |
		
	* WebGL
		* safari

			| framework | version  |   FPS   | 备注 |
			|:--------- | -------- | ------- |---------- |
			| phaser-ce | 2.6.14   | 18~23   | 去掉mask帧率在32左右 |
			| phaser3   | 3.0.10 | 流畅 |  |
			| pixi      | 3.5.5    | 58~60 |  |
		
		* chrome()

			| framework | version  |   FPS   | 备注 |
			|:--------- | -------- | ------- |---------- |
			| phaser-ce | 2.6.14   | 21~23   | 去掉mask帧率在32~34左右 |
			| phaser3   | 3.0.10   | 流畅 |  |
			| pixi      | 3.5.5    | 55~60 |  |

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

* WebGL
  * safari

    | framework | version  |   FPS   |
    |:--------- | -------- | ------- |
    | phaser-ce | 2.6.14   | 6~7   |
    | phaser3   | 3.0.10   | 流畅 |
    | pixi      | 3.5.5    | 58~60 |



## Samsung 
* System
	* OS: Android 6.0
	* Model: S6


* Render
	* canvas
		* chrome()		

			| framework | version  |  FPS  |
			|:--------- | -------- | ----- |
			| phaser-ce | 2.6.14   | 59~60 |
			| phaser3   | 3.0.10   | 流畅 |
			| pixi      | 3.5.5    |   |

	* webgl
		* chrome()

			| framework | version  |  FPS  |
			|:--------- | -------- | ----- |
			| phaser-ce | 2.6.14   | 25~32 |
			| phaser3   | 3.0.10   | 流畅 |
			| pixi      | 3.5.5    |   |
