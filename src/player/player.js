import {
    leftKey, rightKey, downKey, upKey, spaceKey
} from './keyboard'
import { world } from '../world'
import { AnimatedSprite } from 'pixi.js'

let maxPlayerVelocity = 5
let acceleration = .6
let reverseAccelerationFactor = 4

export function setDirectionToAnySingleKeyThatIsCurrentlyDown(player) {
    let count = 0
    count += leftKey.isDown ? 1 : 0
    count += rightKey.isDown ? 1 : 0
    count += downKey.isDown ? 1 : 0
    count += upKey.isDown ? 1 : 0

    if (count > 1) {
        return
    }

    if (leftKey.isDown) {
        player.direction = "left"
    } else if (rightKey.isDown) {
        player.direction = "right"
    } else if (upKey.isDown) {
        player.direction = "up"
    } else if (downKey.isDown) {
        player.direction = "down"
    }
}

export function setPlayerAnimation(player) {
    const directionalChoice = player.spriteDirections[world.player.direction]
    let newAnimation;

    if (player.vx != 0 || player.vy != 0) {
        newAnimation = directionalChoice.walk
    } else {
        newAnimation = directionalChoice.face
    }

    if (newAnimation === player.currentAnimation) {
        return
    }

    player.currentAnimation.visible = false
    if (player.currentAnimation instanceof AnimatedSprite) {
        player.currentAnimation.stop()
    }

    newAnimation.visible = true
    if (newAnimation instanceof AnimatedSprite) {
        newAnimation.gotoAndPlay(0)
    }

    player.currentAnimation = newAnimation
}

export function setNewPlayerVelocityBasedOnKeys(player) {
    if (leftKey.isDown) {
        if (player.vx <= 0) {
            if (Math.abs(player.vx - acceleration) < maxPlayerVelocity) {
                player.vx -= acceleration
            }
        } else {
            player.vx -= acceleration * reverseAccelerationFactor
        }
    }

    if (rightKey.isDown) {
        if (player.vx >= 0) {
            if (Math.abs(player.vx + acceleration) < maxPlayerVelocity) {
                player.vx += acceleration
            }
        } else {
            player.vx += acceleration * reverseAccelerationFactor
        }
    }

    //if not attempting to move, try to reverse direction and get back to zero
    if (leftKey.isUp && rightKey.isUp && player.vx != 0) {
        if (player.vx > 0) {
            if (player.vx - acceleration * reverseAccelerationFactor < 0) {
                player.vx = 0
            } else {
                player.vx -= acceleration * reverseAccelerationFactor
            }
        } else {
            if (player.vx + acceleration * reverseAccelerationFactor > 0) {
                player.vx = 0
            } else {
                player.vx += acceleration * reverseAccelerationFactor
            }
        }
    }

    if (upKey.isDown) {
        if (player.vy <= 0) {
            if (Math.abs(player.vy - acceleration) < maxPlayerVelocity) {
                player.vy -= acceleration
            }
        } else {
            player.vy -= acceleration * reverseAccelerationFactor
        }
    }

    if (downKey.isDown) {
        if (player.vy >= 0) {
            if (Math.abs(player.vy + acceleration) < maxPlayerVelocity) {
                player.vy += acceleration
            }
        } else {
            player.vy += acceleration * reverseAccelerationFactor
        }
    }

    //if not attempting to move, try to reverse direction and get back to zero
    if (upKey.isUp && downKey.isUp && player.vy != 0) {
        if (player.vy > 0) {
            if (player.vy - acceleration * reverseAccelerationFactor < 0) {
                player.vy = 0
            } else {
                player.vy -= acceleration * reverseAccelerationFactor
            }
        } else {
            if (player.vy + acceleration * reverseAccelerationFactor > 0) {
                player.vy = 0
            } else {
                player.vy += acceleration * reverseAccelerationFactor
            }
        }
    }
}

