import { Application, Container, Sprite, Text, TextStyle, Loader, AnimatedSprite, Graphics } from 'pixi.js'
import { createTiles } from './tile_loader'
import { world } from './world'
import { play } from './gameloop'

//Create a Pixi Application
const app = new Application({
    width: 512,
    height: 512,
    antialias: true,
    transparent: false,
    resolution: 1
})

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


export function setup(tileMetadataFileInfo) {
    return () => setupWithMetadata(tileMetadataFileInfo)
}

let animations, id
function setupWithMetadata(tileMetadataFileInfo) {
    //Make the game scene and add it to the stage
    let gameScene = new Container();
    app.stage.addChild(gameScene);

    const tiles = createTiles(tileMetadataFileInfo)
    for (const t of tiles) {
        gameScene.addChild(t.sprite)
    }
    world.tiles = tiles

    //Make the sprites and add them to the `gameScene`
    //Create an alias for the texture atlas frame ids
    id = Loader.shared.resources["images/treasureHunter.json"].textures;
    animations = Loader.shared.resources["images/treasureHunter.json"].spritesheet.animations

    function createCollisionRect({ x, y, width, height }) {
        const graphics = new Graphics();
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawRect(x, y, width, height);
        return graphics
    }

    //Treasure
    let treasure = new Sprite(id["treasure.png"]);
    treasure.x = gameScene.width - treasure.width - 48;
    treasure.y = gameScene.height / 2 - treasure.height / 2;
    gameScene.addChild(treasure);

    //Create the text sprite and add it to the `gameOver` scene
    const style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white"
    });

    app.ticker.deltaTime = 4
    //Start the game loop 
    app.ticker.add((delta) => gameLoop(delta));

    setupPlayerSprites(world.player)
    gameScene.addChild(world.player.spriteContainer)
}

function gameLoop(delta) {
    play(delta);
}

let directions = ['left', 'right', 'up', 'down']
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
        const graphics = new Graphics();
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawRect(0, 0, player.width, player.height);

        const footCollisionRect = player.getFootCollisionRect()
        graphics.drawRect(0, player.footCollisionYOffset, player.width, player.height - player.footCollisionYOffset)
        c.addChild(graphics);
    }
}
