//Vector Class
function distance(x2, y2, x1, y1) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function Vector(x, y, angle) {
  this.x = x || 0;
  this.y = y || 0;
  this.angle = angle || 0;
  this.initx = x || 0;
  this.inity = y || 0;
};

Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
};

Vector.prototype.getMagnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};

//Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function(angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle * Math.PI / 180), magnitude *
  Math.sin(angle * Math.PI / 180));
};

Vector.prototype.copy = function(other) {
  this.x = other.x;
  this.y = other.y;
  return this;
};

Vector.prototype.perp = function() {
  var x = this.x;
  this.x = this.y;
  this.y = -x;
  return this;
};

Vector.prototype.rotate = function(angle) {
  var x = this.x
  var y = this.y;
  this.x = x * Math.cos(angle) - y * Math.sin(angle);
  this.y = x * Math.sin(angle) + y * Math.cos(angle);
  return this;
};

Vector.prototype.reverse = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

Vector.prototype.normalize = function() {
  var d = distance(this.x, this.y, this.initx, this.inity);
  if (d > 0) {
    this.x = this.x / d;
    this.y = this.y / d;
  }
  return this;
};

Vector.prototype.dot = function(other) {
  return this.x * other.x + this.y * other.y;
};

Vector.prototype.project = function(other) {
  var amt = this.dot(other) / (Math.pow(other.x - other.initx, 2) + Math.pow(
  other.y - other.inity, 2));
  this.x = amt * other.x;
  this.y = amt * other.y;
  return this;
};

//Bullet Class
function Bullet(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);
}
Bullet.prototype.move = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
};
