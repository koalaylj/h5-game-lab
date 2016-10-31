var renderer = PIXI.autoDetectRenderer(1280, 760);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader
  .add('punch', 'required/assets/spine/punchBagGame.json')
  .load(onAssetsLoaded);

stage.interactive = true;

function onAssetsLoaded(loader, res) {
  var punch = new PIXI.spine.Spine(res.punch.spineData);

  // set the position
  punch.position.x = 640;
  punch.position.y = 360;

  punch.state.setAnimation(0, 'idle', true);

  stage.addChild(punch);

  stage.on('click', function() {
    punch.state.setAnimation(0, 'hitBag', false);
  });
}

requestAnimationFrame(animate);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
}
