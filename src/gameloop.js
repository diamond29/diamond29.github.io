import { world } from './world'
import {
  setDirectionToAnySingleKeyThatIsCurrentlyDown,
  setPlayerAnimation,
  setNewPlayerVelocityBasedOnKeys
} from './player/player'
import { Graphics } from 'pixi.js'

export function play(delta) {
    const player = world.player
    setDirectionToAnySingleKeyThatIsCurrentlyDown(player)
    setNewPlayerVelocityBasedOnKeys(player)
    setPlayerAnimation(player)

    //use the player's velocity to make it move
    const previousX = player.x
    const previousY = player.y
    player.x += player.vx;
    player.y += player.vy;

    //Contain the player inside the area of the dungeon
    for (const r of world.collisionRects) {
        if (hitTestRectangle(player.getFootCollisionRect(), r)) {
            player.x = previousX
            player.y = previousY
        }
    }

    if (player.attacking) {
        const weaponWidth = 20
        const weaponLength = 30
        let actualWidth = 0
        let actualHeight = 0

        if (player.attackingFrame == 0) {
            let weaponX = 0
            let weaponY = 0

            if (player.direction == 'left' || player.direction == 'right') {
                actualWidth = weaponLength
                actualHeight = weaponWidth

                weaponY = player.height / 2 - actualHeight / 2

                if (player.direction == 'left') {
                    weaponX = -1 * actualWidth
                } else {
                    weaponX = player.width
                }
            } else {
                actualWidth = weaponWidth
                actualHeight = weaponLength

                weaponX = player.width / 2 - actualWidth / 2

                if (player.direction == 'up') {
                    weaponY = -1 * actualHeight
                } else {
                    weaponY = player.height
                }
            }

            const graphics = new Graphics();
            graphics.beginFill(0xFF0000);
            graphics.drawRect(weaponX, weaponY, actualWidth, actualHeight);
            graphics.endFill()
            player.attackingSprite = graphics
            player.spriteContainer.addChild(graphics)
        }
        player.attackingFrame++

        if (player.attackingFrame > 10) {
            player.attackingSprite.parent.removeChild(player.attackingSprite)
            player.attackingSprite = null
            player.attacking = false
            player.attackingFrame = 0
        }
    }


    world.camera.x = player.x - (256) + player.width / 2
    world.camera.y = player.y - (256) + player.height / 2

    for (const tile of world.tiles) {
        tile.sprite.x = tile.x - Math.round(world.camera.x)
        tile.sprite.y = tile.y - Math.round(world.camera.y)
    }
    player.spriteContainer.x = player.x - world.camera.x
    player.spriteContainer.y = player.y - world.camera.y
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {
    if (r1.x + r1.width <= r2.x) {
        return false
    }

    if (r1.x >= r2.x + r2.width) {
        return false
    }

    if (r1.y >= r2.y + r2.height) {
        return false
    }

    if (r1.y + r1.height <= r2.y) {
        return false
    }

    return true
};


//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
