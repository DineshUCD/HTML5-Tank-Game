var MapClass = {
  mapObjects: new Array(),
  mapItem: function(positionX, positionY, width, height, description) {
    this.positionX = positionX || 0;
    this.positionY = positionY || 0;
    this.widthEdge =  width || 0;
    this.heightEdge = height || 0;
    this.description = description || "";
  },
  addToMap: function(spt, posX, posY) {
    this.mapObjects.push(new this.mapItem(posX, posY, posX + spt.w, posY +
      spt.h, spt.id));
    },
  __draw: function(spt, sheet, posX, posY, angle, centerOfMass) {

    alert("Images Finished");
    this.addToMap(spt, posX, posY);
    alert("Images Finished");
    __drawRotatedImage(contextMap, spt, sheet, posX, posY, angle, centerOfMass);
  },
  draw: function(imageName, terrainName, posX, posY) {
    var spt = spriteSheets[imageName].spt;
    for (var find = 0; find < spt.length; find++) {
      if (spt[find].id == terrainName) {
        this.__draw(spt[find], spriteSheets[imageName], posX, posY, 0,
        UNIFORM_MASS);
        break;
      }
    }
  }
} //Map Class

/*
Space Parition :

A Space Parition represents a subdivision of 2-dimensional space into
convex subspaces. It is a process which takes a subspace and paritions it into
cells of fixed size.
The result is a grid layout that can be further paritioned by recursive
application of the method.

The game map:
+-----------+      +-----+-----+
|           |      |     |     |
|           |      |-----|-----|
|           |      |     |     |
|           |  ->  |-----|-----|
|           |      |     |     |
|           |      |-----|-----|
|           |      |     |     |
+-----------+      +-----+-----+


Rules:
1. Use only lines parallel to the X or Y axis, and that we will divide
the space equally at each node.
*/



var Grid = {
  sector: {},
  dimension: PARTITION_SIZE,
  gridItems: GRID_ITEMS,
  dimMult: SECTOR_SIZE_MULT,
  highlight: function(x, y) {
    var wrapDim = this.dimension * this.dimMult;
    var subGrid = [Math.floor(x / wrapDim) * wrapDim, Math.floor(y / wrapDim) * wrapDim];
    var obstacle = this.sector[subGrid[0]][subGrid[1]].items;
    var unit = this.sector[subGrid[0]][subGrid[1]].unit;
    this.drawSquare(unit.positionX, unit.positionY, unit.width, unit.height, 'orange');
    for (var set = 0; set < obstacle.length; set++) {
      this.drawSquare(obstacle[set].positionX, obstacle[set].positionY,
        obstacle[set].widthEdge - obstacle[set].positionX, obstacle[set].heightEdge - obstacle[set].positionY, 'green');
    }
    return this.sector[subGrid[0]][subGrid[1]].items;
  },
  drawSquare: function(x, y, width, height, color) {
    contextMap.beginPath();
    contextMap.rect(x, y, width, height);
    contextMap.lineWidth = 7;
    contextMap.strokeStyle = color.toString();
    contextMap.stroke();
  },
  square: function(positionX, positionY, sideLength) {
    this.positionX   = positionX || 0;
    this.positionY   = positionY || 0;
    this.width       = sideLength || 0;
    this.height      = sideLength || 0;
    this.topLeft     = { x: positionX,              y: positionY };
    this.topRight    = { x: positionX + sideLength, y: positionY };
    this.bottomLeft  = { x: positionX,              y: positionY + sideLength };
    this.bottomRight = { x: positionX + sideLength, y: positionY + sideLength };
  },
  partition: function() {
    var offset = this.dimension * this.dimMult;
    for (var xPosition = 0; xPosition < canvas.width; xPosition += offset) {
      this.sector[xPosition] = {};
      for ( var yPosition = 0; yPosition < canvas.height; yPosition += offset) {
        this.sector[xPosition][yPosition] = {unit: new this.square(xPosition, yPosition, this.dimension * this.dimMult), items: []};
        this.drawSquare(xPosition, yPosition, offset, offset, 'black');
      }
    }
  },
  //Each edge is a pair (v, w), where v, w is an element of V. Edges are sometimes referred to
  //as arcs.
  putEdge: function(posX, posY, length) {  //positionX, positionY

    var v = this.getVertex(posX, posY, this.dimension); //v[0] = pointX, v[1] = pointY
    var orientation = Math.floor((Math.random() * 2) + 1);

    var width  = this.dimension;
    var height = this.dimension;

    if(orientation == 1) { //horizontal
      width = length;
    } else {
      height = length;
    }

    var obstacle = new MapClass.mapItem(v[0], v[1], v[0] + width, v[1] + height, "edge");
    MapClass.mapObjects.push(obstacle);

    var wrapDim = this.dimension * this.dimMult;
    var subGrid = [Math.floor(v[0] / wrapDim) * wrapDim, Math.floor(v[1] / wrapDim) * wrapDim];

    if (this.sector[subGrid[0]] != undefined && this.sector[subGrid[0]][subGrid[1]] != undefined) {
      this.sector[subGrid[0]][subGrid[1]].items.push(obstacle);
    }
    this.drawSquare(subGrid[0], subGrid[1], this.dimension  * this.dimMult, this.dimension  * this.dimMult, 'purple');
    this.drawSquare(v[0], v[1], width, height, 'blue');
  },
  getVertex: function(posX, posY, size) {
    pointX = size * Math.floor((posX + (size/2)) / size);
    pointY = size * Math.floor((posY + (size/2)) / size);
    return [pointX, pointY];
  },
  generateTestMap: function() {
    //DisjSets.init(this.gridItems*3);
    for(var wall = 0; wall < this.gridItems; wall++) {
      var positionX = Math.floor((Math.random() * canvas.width) + 0);
      var positionY = Math.floor((Math.random() * canvas.height) + 0);
      var length    = this.dimension;
      this.putEdge(positionX, positionY, length);
    } //for
  }
};
