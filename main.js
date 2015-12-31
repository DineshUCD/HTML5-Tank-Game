var loadAtlas = function(atlasSheet, jsonArray) {
  SpriteSheetClass.load(atlasSheet, jsonArray);
} //loadAtlas

var loadEntity = function(entity) {
  entity.init();
}

var setup = function() {
  var body            = document.getElementById("main");
  var canvasContainer = document.createElement("div");
  canvasContainer.setAttribute("id", "canvasContainer");

  canvas              = document.createElement("canvas");
  canvasMap           = document.createElement("canvas");

  canvas.width        = canvasMap.width  = window.innerWidth;
  canvas.height       = canvasMap.height = window.innerHeight;

  body.appendChild(canvasContainer);

  canvasContainer.appendChild(canvasMap);
  canvasContainer.appendChild(canvas);

  context             = canvas.getContext('2d');
  contextMap          = canvasMap.getContext('2d');

  Grid.partition();
  Grid.generateTestMap();
  loadAtlas("others.png", "others.json");
  loadAtlas("players.png", "players.json");
  loadAtlas("landscape.png", "landscape.json");
  MapClass.draw("landscape.png", "cactus.png", 300, 300);
  InputEngineClass.setup();
  Tank.init();

  main();
}

//Render
function main() {
  requestAnimationFrame(main);
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    update(1/interval);
    render();
  }

}

function update(delta) {
  var pressed = handleInput(delta);
  updateEntities();
  checkCollisions(Tank);
  Grid.highlight(Tank.bumperX[1], Tank.bumperY[1]);
}

function handleInput(delta) {
  Tank.handleInput(delta);
}

function updateEntities() {
  updateTank();
}

// collides takes the coordinates for the top/left and bottom/right
// corners for both 'boxes' to find any gaps.
function collides(x, y, r, b, x2, y2, r2, b2) {
  return !(r <= x2 || x > r2 || b <= y2 || y > b2);
}

function checkCollisions(entity) {
  var length = MapClass.mapObjects.length;
 console.log(length);
  for (var obstacle = 0; obstacle < length; obstacle++) {
    if (entity.isCollision(MapClass.mapObjects[obstacle]))
      return true;
  }
  return false;
}

function render() {
  Tank.draw();
}

setup();
