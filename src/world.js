export const world = {
    collisionRects: [],
    player: {
      sizeModifier: .75,
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      spriteContainer: null,
      spriteDirections: {},
      direction: 'up',
      currentAnimation: null,
      height: 48,
      width: 26,
      footCollisionYOffset: 32,
      attacking: false,
      attackingFrame: 0,
      getFootCollisionRect() {
        return {
          x: this.x,
          width: this.width,
          y: this.footCollisionYOffset + this.y,
          height: this.height - this.footCollisionYOffset,
        }
      },
    },
    camera: {
      x: 0,
      y: 0,
    },
    tiles: []
  }
