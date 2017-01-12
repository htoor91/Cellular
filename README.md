# Cellular

[Cellular live][live]

[live]: http://www.hassantoor.com/Cellular/index.html

Cellular is a browser-based interactive game that is built using JavaScript and jQuery.

## Background

You are a cell.  You have been granted the gift of life.  There's only one problem: the petri dish you've been born into is infested with organisms that want to eat you.  You must survive at all costs.

![image of standard](/docs/production_images/standard.png)

Luckily, you've been gifted with a few powers to aid you in your quest. You have `speed` and `absorbtion`. Your fleet footing will allow you to escape and maneuver larger cells.  Your ability to absorb smaller cells will help you grow and survive.  Use these powers wisely.

## How to Play

### Standard Mode

You control the black cell. Use the arrow keys to move.  Attack cells that are smaller than you.  Avoid cells that are larger than you.  Move on the next level by eliminating all but one cell.  

![image of second standard](/docs/production_images/standard2.png)

### Survival Mode

You've been born into a petri dish with rabid organisms.  Your mere existence sends all nearby organisms into a blinding rage.  Death is inevitable. Survive as long as you can.

![image of high score](/docs/production_images/high-score.png)

### Two Player

You and your evil brother have been born into the same petri dish.  There's only room for one semi-conscious, speedy, all-consuming cell in this part of town.  

Player one moves with W A S D.  Player two moves with the arrow keys.

![image of multiplayer](/docs/production_images/multiplayer.gif)

## Code Implementation

### 2D Rendering

2D rendering is accomplished using HTML5 Canvas.

```javascript
draw(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });
}
```

### Physics Engine

Simple physics engine for movement in a 2D coordinate system was created.  Velocity and friction were accounted for to implement a smooth control system.  Wrapping was enabled using position checks on 2D coordinate system.

``` javascript
move(timeDelta) {
  if(this.game.survival) {
    this.vel[0] *= 1.01;
    this.vel[1] *= 1.01;
  }
  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  if (this.game.isOutOfBounds(this.pos)) {
    if (this.isWrappable) {
      this.pos = this.game.wrap(this.pos);
    } else {
      this.remove();
    }
  }
}
```

A collision detection system was implemented using position and element size comparisons.
``` javascript
collideWith(otherObject) {
  if (otherObject.radius < this.radius){
    otherObject.remove();
    this.radius += (0.2 * otherObject.radius);
    return true;
  } else if (otherObject.radius > this.radius){
    this.remove();
    otherObject.radius += (0.2 * this.radius);
    return true;
  }
}

isCollidedWith(otherObject) {
  const centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
}
```
