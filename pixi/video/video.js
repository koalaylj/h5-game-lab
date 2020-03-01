var app = new PIXI.Application({
    width: 800,
    height: 600,
    autoResize: true,
    // resolution: window.devicePixelRatio,
    antialias: true,
    transparent: true,
    view: document.querySelector("#game"),
    forceCanvas: false //true:canvas , false:webgl
});

var btn_create = new PIXI.Graphics()
    .beginFill(0x0, 0.5)
    .drawRoundedRect(0, 0, 100, 100, 10)
    .endFill()
// .beginFill(0xffffff)
// .moveTo(36, 30)
// .lineTo(36, 70)
// .lineTo(70, 50);

btn_create.x = app.screen.width - 100;
btn_create.y = app.screen.height - 100;

btn_create.interactive = true;
btn_create.buttonMode = true;


var btn_play = new PIXI.Graphics()
    .beginFill(0x666666, 1)
    .drawRoundedRect(0, 0, 100, 100, 10)
    .endFill()
    .beginFill(0xffffff)
    .moveTo(36, 30)
    .lineTo(36, 70)
    .lineTo(70, 50);

btn_play.x = (app.screen.width - btn_play.width) / 2;
btn_play.y = (app.screen.height - btn_play.height) / 2;

btn_play.interactive = true;
btn_play.buttonMode = true;

// Add to the stage
app.stage.addChild(btn_create);
app.stage.addChild(btn_play);

// Listen for a click/tap event to start playing the video
// this is useful for some mobile platforms. For example:
// ios9 and under cannot render videos in PIXI without a
// polyfill - https://github.com/bfred-it/iphone-inline-video
// ios10 and above require a click/tap event to render videos
// that contain audio in PIXI. Videos with no audio track do
// not have this requirement
btn_create.on('pointertap', create);

btn_play.on('pointertap', playVideo);

var video = document.createElement('video');
document.body.insertBefore(video, document.body.firstChild);

function playVideo() {

    PIXI.loader.add('test.mp4').onComplete.once(() => {
        const res = PIXI.loader.resources['test.mp4'];
        res.texture = PIXI.Texture.fromVideo(res.data);
    });

    // var video = document.createElement('video');
    video.src = 'test.mp4';
    video.autoplay = true;
    video.addEventListener('ended', () => {
        console.log('played over')
        // video.pause()
        // setTimeout(() => {
        //     video.parentNode.removeChild(video);
        //     console.log('played over')
        // }, 10)
    })
}

let count = 0
function create() {

    count += 20

    console.log('count', count)

    for (let i = 0; i < 20; i++) {

        let bunny = PIXI.Sprite.fromImage('bunny.png')

        bunny.anchor.set(0.5);

        bunny.x = Math.random() * app.screen.width;
        bunny.y = Math.random() * app.screen.height;

        app.stage.addChild(bunny);

        app.ticker.add(function (delta) {
            bunny.rotation += 0.1 * delta;
        });
    }

}
