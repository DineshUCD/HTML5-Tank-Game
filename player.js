var TankBody = {
  init: function(pos, last, stats, tankSpeed) {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.last = {
      x: last.x,
      y: last.y
    };
    this.stats = stats;
    this.tankSpeed = tankSpeed;
  },
  draw: function() {
    context.clearRect(this.pos.x + this.stats.cy,
      this.pos.y + this.stats.cy,
      this.stats.w - this.stats.cx,
      this.stats.w - this.stats.cy);
    __drawRotatedImage(context, this.stats, spriteSheets['players.png'],
      this.pos.x, this.pos.y, this.angle, UNIFORM_MASS);
  },
  rotate: function(angle) {
    this.angle = (this.angle + angle) % 360;
  },
  moveX: function(newPosX) {
    this.pos.x += newPosX;
  },
  moveY: function(newPosY) {
    this.pos.y += newPosY;
  },
  angle: 0,
  pos: {
    x: 0,
    y: 0
  },
  last: {
    x: 0,
    y: 0
  },
  stats: null,
  tankSpeed: PLAYER_SPEED
} //TankBody Class

var TankGun = {
  init: function(pos, last, stats, fireRate) {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.last = {
      x: last.x,
      y: last.y
    };
    this.stats = stats;
    this.fireRate = fireRate;
  },
  draw: function() {
    this.pos.x = TankBody.pos.x + 45;
    this.pos.y = TankBody.pos.y - 10;
    __drawRotatedImage(context, this.stats, spriteSheets['players.png'],
      this.pos.x, this.pos.y, this.angle, {
        x: 0,
        y: -25
      });
  },
  rotate: function(angle) {
    this.angle = (this.angle + angle) % 360;
  },
  setAngle: function(angle) {
    this.angle = angle;
  },
  isSeconaryFired: function() {
    return this.secondaryFirePressed;
  },
  setSecondaryFire: function(isPressed) {
    this.secondaryFirePressed = isPressed;
  },
  setSecondaryFireDirection: function() {
    var hypotenuse = 47; //Experimental
    this.secondaryBullet[0] = this.pos.x + this.gunOffset.x - (hypotenuse *
      Math.cos((this.angle - UNIT_CIRCLE_OFFSET) * TO_RADIANS));
    this.secondaryBullet[1] = this.pos.y + this.gunOffset.y - (hypotenuse *
      Math.sin((this.angle - UNIT_CIRCLE_OFFSET) * TO_RADIANS));
  },
  angle: 0,
  pos: {
    x: 0,
    y: 0
  },
  last: {
    x: 0,
    y: 0
  },
  bullets: new Array(),
  stats: null,
  fireRate: RATE_OF_FIRE,
  secondaryFiredPressed: false,
  primaryFirePressed: false,
  secondaryFireStats: null,
  primaryFireStats: null,
  secondaryBullet: [0, 0],
  primaryBullet: [0, 0],
  gunOffset: {  //Experimental
    x: 0,
    y: 20
  }
} //TankGun class

var Tank = {
  init: function(body, gun) {
    this.body = TankBody;
    this.gun = TankGun;
    this.body.init({
      x: 100,
      y: 100
    }, {
      x: 100,
      y: 100
    },
    SpriteSheetClass.getStats("players.png", "tankBody.png"),
    PLAYER_SPEED);
    this.gun.init({
      x: (this.body.pos.x * .35) + this.body.pos.x,
      y: (TankBody.pos.y * .90)
    }, {
      x: (this.body.pos.x * .35) + this.body.pos.x,
      y: (this.body.pos.y * .90)
    },
    SpriteSheetClass.getStats("players.png", "tankGun.png"),
    RATE_OF_FIRE);
    this.gun.secondaryFireStats = SpriteSheetClass.getStats("others.png", "bullet.png");
    Queue.init(this.gun.bullets);
  },
  draw: function() {
    this.body.draw();
    this.gun.draw();
    if (this.gun.bullets.length) {
      for (var shells = 0; shells < this.gun.bullets.length; shells++) {
        __drawRotatedImage(context, this.gun.secondaryFireStats, spriteSheets[
            'others.png'],
          this.gun.bullets[shells].position.x, this.gun.bullets[shells].position.y,
          this.gun.bullets[shells].position.angle + REVERSE_ANGLE, UNIFORM_MASS);
      } //for
    } //if
  },
  rotateBody: function(bodyAngle) {
    this.body.rotate(bodyAngle);
  },
  rotateGun: function(gunAngle) {
    this.gun.rotate(gunAngle);
  },
  moveX: function(newPosX) {
    this.body.moveX(newPosX);
  },
  moveY: function(newPosY) {
    this.body.moveY(newPosY);
  },
  rotateGun: function(angle) {
    this.gun.setAngle(angle);
  },
  switchSecondaryFire: function(state) {
    this.gun.setSecondaryFire(state);
  },
  isCollision: function(obstacle) {
    for (var point = 0; point < 3; point++) {
      if (collides(this.bumperX[point], this.bumperY[point], this.bumperX[
            point], this.bumperY[point],
          obstacle.positionX, obstacle.positionY,
          obstacle.widthEdge,
          obstacle.heightEdge)) {
            this.body.pos.x = this.body.last.x;
            this.body.pos.y = this.body.last.y;
            this.gun.pos.x  = this.gun.last.x;
            this.gun.pos.y  = this.gun.last.y;
            return true;
      }
    }
    return false;
  },
  setBumper: function() {
    var centerX = this.gun.pos.x + 25;
    var centerY = this.gun.pos.y + 55;
    var radius = 65; //Experimental
    //Minimum 2 points for a line
    this.bumperX[0] = centerX + radius * Math.cos((this.body.angle - 25) *
      TO_RADIANS);
    this.bumperY[0] = centerY + radius * Math.sin((this.body.angle - 25) *
      TO_RADIANS);
    this.bumperX[1] = centerX + radius * Math.cos((this.body.angle) *
      TO_RADIANS);
    this.bumperY[1] = centerY + radius * Math.sin((this.body.angle) *
      TO_RADIANS);
    this.bumperX[2] = centerX + radius * Math.cos((this.body.angle + 25) *
      TO_RADIANS);
    this.bumperY[2] = centerY + radius * Math.sin((this.body.angle + 25) *
      TO_RADIANS);
  },
  handleInput: function(delta) {
    moveTankBody(delta);
    moveTankGun(delta);
  },
  getPosition: function() {
    return  [this.gun.pos.x, this.gun.pos.y];
  },
  body: null,
  gun: null,
  bumperX: [0, 0, 0],
  bumperY: [0, 0, 0]
} //Tank Class

function moveTankBody(delta) {
  Tank.body.last.x = Tank.body.pos.x;
  Tank.body.last.y = Tank.body.pos.y;
  Tank.gun.last.x = Tank.gun.pos.x;
  Tank.gun.last.y = Tank.gun.pos.y;
  if (actions['move-down']) {
    if (TankBody.angle == 90)
      Tank.moveY(TankBody.tankSpeed * delta);
    else if (TankBody.angle <= 270 && TankBody.angle > 90)
      Tank.rotateBody(-5);
    else if (TankBody.angle > 270 && TankBody.angle <= 360)
      Tank.rotateBody(5);
    else if (TankBody.angle >= 0 && TankBody.angle < 90)
      Tank.rotateBody(5);
  } else if (actions['move-up']) {
    if (TankBody.angle == 270 || TankBody.angle == -90)
      Tank.moveY(-TankBody.tankSpeed * delta);
    else if (TankBody.angle >= 90 && TankBody.angle < 270)
      Tank.rotateBody(5);
    else if (TankBody.angle > 270 && TankBody.angle <= 360)
      Tank.rotateBody(-5);
    else if (TankBody.angle < 90 && TankBody.angle >= 0) {
      Tank.rotateBody(-5);
      if (TankBody.angle < 0)
        TankBody.angle += 360;
    }
  }
  if (actions['move-right']) {
    if (TankBody.angle == 0 || TankBody.angle == 360)
      Tank.moveX(TankBody.tankSpeed * delta);
    else if (TankBody.angle <= 180)
      Tank.rotateBody(-5);
    else if (TankBody.angle > 180)
      Tank.rotateBody(5);
  } else if (actions['move-left']) {
    if (TankBody.angle == 180)
      Tank.moveX(-TankBody.tankSpeed * delta);
    else if (TankBody.angle > 180)
      Tank.rotateBody(-5);
    else if (TankBody.angle <= 180)
      Tank.rotateBody(5);
  }
  if (actions['move-down'] && actions['move-right']) {
    if (TankBody.angle == 45) {
      Tank.moveY(TankBody.tankSpeed * delta);
      Tank.moveX(TankBody.tankSpeed * delta);
    } else if (TankBody.angle <= 225 && TankBody.angle > 45)
      Tank.rotateBody(-5);
    else if (TankBody.angle >= 0 && TankBody.angle < 45)
      Tank.rotateBody(5);
    else if (TankBody.angle > 225)
      Tank.rotateBody(5);
  } else if (actions['move-down'] && actions['move-left']) {
    if (TankBody.angle == 135) {
      Tank.moveY(TankBody.tankSpeed * delta);
      Tank.moveX(-TankBody.tankSpeed * delta);
    } else if (TankBody.angle <= 315 && TankBody.angle > 135)
      Tank.rotateBody(-5);
    else if (TankBody.angle > 315)
      Tank.rotateBody(5);
    else if (TankBody.angle < 135)
      Tank.rotateBody(5);
  }
  if (actions['move-up'] && actions['move-right']) {
    if (TankBody.angle == 315) {
      Tank.moveY(-TankBody.tankSpeed * delta);
      Tank.moveX(TankBody.tankSpeed * delta);
    } else if (TankBody.angle >= 135 && TankBody.angle < 315)
      Tank.rotateBody(5);
    else if (TankBody.angle > 315)
      Tank.rotateBody(-5);
    else if (TankBody.angle < 135) {
      Tank.rotateBody(-5);
      if (TankBody.angle < 0)
        TankBody.angle += 360;
    }
  } else if (actions['move-up'] && actions['move-left']) {
    if (TankBody.angle == 225) {
      Tank.moveY(-TankBody.tankSpeed * delta);
      Tank.moveX(-TankBody.tankSpeed * delta);
    } else if (TankBody.angle < 225 && TankBody.angle >= 45)
      Tank.rotateBody(5);
    else if (TankBody.angle > 225)
      Tank.rotateBody(-5);
    else if (TankBody.angle < 45) {
      Tank.rotateBody(-5);
      if (TankBody.angle < 0)
        TankBody.angle += 360;
    }
  }
}

function moveTankGun(delta) {
  Tank.switchSecondaryFire(OFF);
  if (actions['fire-up']) {
    Tank.rotateGun(180);
    Tank.switchSecondaryFire(ON);
  } else if (actions['fire-down'] == true) {
    Tank.rotateGun(0);
    Tank.switchSecondaryFire(ON);
  }

  if (actions['fire-right']) {
    Tank.rotateGun(270);
    Tank.switchSecondaryFire(ON);
  } else if (actions['fire-left']) {
    Tank.rotateGun(90);
    Tank.switchSecondaryFire(ON);
  }

  if (actions['fire-up'] && actions['fire-right']) {
    Tank.rotateGun(225);
    Tank.switchSecondaryFire(ON);
  } else if (actions['fire-up'] && actions['fire-left']) {
    Tank.rotateGun(135);
    Tank.switchSecondaryFire(ON);
  }

  if (actions['fire-down'] && actions['fire-right']) {
    Tank.rotateGun(315);
    Tank.switchSecondaryFire(ON);
  } else if (actions['fire-down'] && actions['fire-left']) {
    Tank.rotateGun(45);
    Tank.switchSecondaryFire(ON);
  }
}

function updateTank() {
  Tank.setBumper();
  TankGun.setSecondaryFireDirection();
  var isBulletOnScreen = false;
  var isNewAngle = true;
  var currentTrajectory = new Array(2);
  for (var removeShell = 0; removeShell < TankGun.bullets.length; removeShell++) {
    if (distance(TankGun.bullets[removeShell].position.x,
        TankGun.bullets[removeShell].position.y,
        TankGun.secondaryBullet[0],
        TankGun.secondaryBullet[1]) > FIRE_RANGE) {
      context.clearRect(TankGun.bullets[removeShell].position.x - 10, TankGun.bullets[
        removeShell].position.y, 77, 77); //Experimental
      Queue.dequeue(TankGun.bullets);
    } else {
      break;
    }
  }
  if (TankGun.isSeconaryFired()) {
    for (var check = TankGun.bullets.length - 1; check > 0; check--) {
      if (TankGun.bullets[check].position.angle == TankGun.angle + UNIT_CIRCLE_OFFSET) {
        currentTrajectory[0] = TankGun.bullets[check].position.x;
        currentTrajectory[1] = TankGun.bullets[check].position.y;
        isBulletOnScreen = true;
        isNewAngle = false;
        break;
      }
    }
    updateBullets(currentTrajectory[0], currentTrajectory[1],
      TankGun.secondaryBullet[0], TankGun.secondaryBullet[1],
      isBulletOnScreen, isNewAngle, TankGun.fireRate);
  }
  for (var shells = 0; shells < TankGun.bullets.length; shells++) {
    context.clearRect(TankGun.bullets[shells].position.x - 10, TankGun.bullets[shells].position
      .y, 77, 77); //Experimental
    TankGun.bullets[shells].move();
  }
} //updateTank

function updateBullets(currentX, currentY, startX, startY, isBulletOnScreen,
    isNewAngle, fireRate) {
  if (isBulletOnScreen &&
    distance(currentX, currentY, startX, startY) > fireRate) {
    Queue.enqueue(TankGun.bullets, new Bullet(new Vector(startX, startY, TankGun.angle +
        UNIT_CIRCLE_OFFSET),
      Vector.fromAngle(TankGun.angle + UNIT_CIRCLE_OFFSET, 15))); //Experimental
  }
  if (TankGun.bullets.length == 0 || isNewAngle) {
    Queue.enqueue(TankGun.bullets, new Bullet(new Vector(startX, startY, TankGun.angle +
        UNIT_CIRCLE_OFFSET),
      Vector.fromAngle(TankGun.angle + UNIT_CIRCLE_OFFSET, 15))); //Experimental
  }
} //updateBullets
