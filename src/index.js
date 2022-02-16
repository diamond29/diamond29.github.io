import _ from 'lodash';
import * as PIXI from 'pixi.js'

async function loadFileFromServer(fileLocation) {
  return fetch(window.location.toString() + fileLocation + "?" + Date.now())
    .then(response => response.text())
}

async function main() {
  const desertMapXmlDoc = new DOMParser().parseFromString(await loadFileFromServer("images/level/desert.tmx"), "text/xml")
  const tileMetadataFileName = desertMapXmlDoc.getElementsByTagName("map")[0].getElementsByTagName("tileset")[0].getAttribute("source")
  const tileListRaw = desertMapXmlDoc.getElementsByTagName("map")[0].getElementsByTagName("layer")[0].getElementsByTagName("data")[0].innerHTML
  const splitTileList = tileListRaw.split("\n")
  const tileList = []
  for (const row of splitTileList.slice(1, splitTileList.length - 1)) {
    let splitRow = row.split(",")
    if (splitRow[splitRow.length - 1] === "") {
      splitRow = splitRow.slice(0, splitRow.length - 1)
    }
    tileList.push(splitRow)
  }

  const metadataXml = new DOMParser().parseFromString(await loadFileFromServer("images/level/" + tileMetadataFileName), "text/xml")
  const tileSheetMetadata = metadataXml.getElementsByTagName("tileset")[0]

  const tileWidth = tileSheetMetadata.getAttribute("tileWidth")
  const tileHeight = tileSheetMetadata.getAttribute("tileWidth")
  const tileSpacing = tileSheetMetadata.getAttribute("spacing")
  const tileColumns = tileSheetMetadata.getAttribute("columns")
  const tileSheetFileName = tileSheetMetadata.getElementsByTagName("image")[0].getAttribute("source")

  const tileCollisionMapById = {}
  for (const tile of tileSheetMetadata.getElementsByTagName("tile")) {
    const id = tile.getAttribute("id")
    const tileCollisions = tile.getElementsByTagName("objectgroup")
    if (tileCollisions.length === 0) continue;
    for (const collisionRect of tile.getElementsByTagName("objectgroup")[0].getElementsByTagName("object")) {
      if (tileCollisionMapById[id] === undefined) tileCollisionMapById[id] = []
      const rect = {
        x: Math.round(parseFloat(collisionRect.getAttribute("x"))),
        y: Math.round(parseFloat(collisionRect.getAttribute("y"))),
        width: Math.round(parseFloat(collisionRect.getAttribute("width"))),
        height: Math.round(parseFloat(collisionRect.getAttribute("height"))),
      }
      tileCollisionMapById[id].push(rect)
    }
  }

//Aliases
const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    AnimatedSprite = PIXI.AnimatedSprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    Rectangle = PIXI.Rectangle,
    Texture = PIXI.Texture;

//Create a Pixi Application
const app = new Application({ 
    width: 512, 
    height: 512,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
)

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add("images/treasureHunter.json")
  .add("images/level/" + tileSheetFileName)
  .load(setup);

//Define variables that might be used in more 
//than one function
let state, treasure, blobs, chimes, exit, dungeon,
    door, healthBar, message, gameScene, gameOverScene, enemies, id, animations;

let directions = ['left', 'right', 'up', 'down']
let maxPlayerVelocity = 5
let acceleration = .6
let reverseAccelerationFactor = 4

  //Capture the keyboard arrow keys
const leftKey = keyboard(37),
    upKey = keyboard(38),
    rightKey = keyboard(39),
    downKey = keyboard(40),
    spaceKey = keyboard(32);



function setDirectionToAnySingleKeyThatIsCurrentlyDown(player) {
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

function getSpriteFromId(id) {
  id -= 1
  const rowNumber = Math.floor(id / tileColumns)
  const columnNumber = id - rowNumber * tileColumns

  const horizontalSpacing = 1 + columnNumber
  const verticalSpacing = 1 + rowNumber

  const xPosition = horizontalSpacing + columnNumber * 32
  const yPosition = verticalSpacing + rowNumber * 32

  return new Sprite(new Texture(resources["images/level/tmw_desert_spacing.png"].texture, new Rectangle(xPosition, yPosition, 32, 32)))
}

const world = {
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
      currentAnimation:  null,
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

function setupPlayerSprites(player) {
  const c = new Container()
  player.spriteContainer = c

  for (const d of directions) {
    const walkAnimation = new AnimatedSprite(animations["walk" + d])
    walkAnimation.animationSpeed = .15
    walkAnimation.visible = false
    walkAnimation.width = walkAnimation.width * player.sizeModifier
    walkAnimation.height = walkAnimation.height * player.sizeModifier

    c.addChild(walkAnimation)

    const faceSprite = new Sprite(id["face" + d + ".png"])
    faceSprite.visible = false
    faceSprite.width = faceSprite.width * player.sizeModifier
    faceSprite.height = faceSprite.height * player.sizeModifier
    c.addChild(faceSprite)

    player.spriteDirections[d] = { face: faceSprite, walk: walkAnimation }
  }

  player.currentAnimation = player.spriteDirections['up'].face
  player.currentAnimation.visible = true
  
  // draw rect around player
  if (true) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFF0000);
    graphics.drawRect(0, 0, player.width, player.height);

    const footCollisionRect = player.getFootCollisionRect()
    graphics.drawRect(0, player.footCollisionYOffset, player.width, player.height - player.footCollisionYOffset)
    c.addChild(graphics);
  }
}


function setup() {

  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);

  //Make the sprites and add them to the `gameScene`
  //Create an alias for the texture atlas frame ids
  id = resources["images/treasureHunter.json"].textures;
  animations = resources["images/treasureHunter.json"].spritesheet.animations

  function createCollisionRect({x, y, width, height}) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFF0000);
    graphics.drawRect(x, y, width, height);
    return graphics
  }

  let yPosition = 0
  for (const tRow of tileList) {
    let xPosition = 0
    for (const tileId of tRow) {        
      const tile = {}
      const spriteContainer = new Container()
      tile.sprite = spriteContainer
      tile.x = xPosition
      tile.y = yPosition

      world.tiles.push(tile)

      gameScene.addChild(spriteContainer)

      spriteContainer.addChild(getSpriteFromId(parseInt(tileId)))
      const newTileId = (parseInt(tileId) - 1).toString()
      let rects = tileCollisionMapById[newTileId]
      if (rects !== undefined) {
        for (const r of rects) {
          spriteContainer.addChild(createCollisionRect(r))
          world.collisionRects.push({x: r.x + xPosition, y: r.y + yPosition, width: r.width, height: r.height})
        }
      }

      xPosition += 32
    }
    yPosition += 32
  }

  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  //Create the `gameOver` scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);

  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;

  //Create the text sprite and add it to the `gameOver` scene
  const style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });

  message = new Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  leftKey.press = function() {
    world.player.direction = 'left'
  };

  //Right
  rightKey.press = function() {
    world.player.direction = 'right'
  };

  //Up
  upKey.press = function() {
    world.player.direction = 'up'
  };

  //Down
  downKey.press = function() {
    world.player.direction = 'down'
  };

  spaceKey.press = () => { world.player.attacking = true }

  //Set the game state
  state = play;
 
  app.ticker.deltaTime = 4
  //Start the game loop 
  app.ticker.add((delta) => gameLoop(delta));

  setupPlayerSprites(world.player)
  gameScene.addChild(world.player.spriteContainer)

}

function gameLoop(delta) {
  state(delta);
}

function setPlayerAnimation(player) {
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

function setNewPlayerVelocityBasedOnKeys(player) {
  if (leftKey.isDown) {
    if (player.vx <= 0) {
      if (Math.abs(player.vx - acceleration ) < maxPlayerVelocity) {
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
      if (Math.abs(player.vy - acceleration ) < maxPlayerVelocity) {
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

function play(delta) {
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
    weaponWidth = 20
    weaponLength = 30
    actualWidth = 0
    actualHeight = 0

    if (player.attackingFrame == 0) {
      weaponX = 0
      weaponY = 0

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

      graphics = new PIXI.Graphics();
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

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
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

//The `keyboard` helper function
function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}
}

main()

