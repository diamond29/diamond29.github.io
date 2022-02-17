import {
    Loader,
    Container,
    Sprite,
    Texture,
    Rectangle,
} from 'pixi.js'

async function loadFileFromServer(fileLocation) {
  return fetch(window.location.toString() + fileLocation + "?" + Date.now())
    .then(response => response.text())
}

let tileList = []

export async function loadTiles() {
    const desertMapXmlDoc = new DOMParser().parseFromString(await loadFileFromServer("images/level/desert.tmx"), "text/xml")
    // load world tileset map
    const tileListRaw = desertMapXmlDoc.getElementsByTagName("map")[0].getElementsByTagName("layer")[0].getElementsByTagName("data")[0].innerHTML
    const splitTileList = tileListRaw.split("\n")
    tileList = []
    for (const row of splitTileList.slice(1, splitTileList.length - 1)) {
        let splitRow = row.split(",")
        if (splitRow[splitRow.length - 1] === "") {
            splitRow = splitRow.slice(0, splitRow.length - 1)
        }
        tileList.push(splitRow)
    }
    // start loading tilesets
    const tilesetNodes = desertMapXmlDoc.getElementsByTagName("map")[0].getElementsByTagName("tileset")
    let tileMetadataFileInfo = {}
    let tileSheetMetadata
    for (const node of tilesetNodes) {
        const metadataXml = new DOMParser().parseFromString(await loadFileFromServer("images/level/" + node.getAttribute("source")), "text/xml")
        tileSheetMetadata = metadataXml.getElementsByTagName("tileset")[0]
        tileMetadataFileInfo[node.getAttribute("firstgid")] = {
            SheetName: node.getAttribute("source"),
            tilewidth: tileSheetMetadata.getAttribute("tilewidth"),
            tileheight: tileSheetMetadata.getAttribute("tileheight"),
            tilespacing: tileSheetMetadata.getAttribute("spacing"),
            tilecolumns: tileSheetMetadata.getAttribute("columns"),
            imageFileName: tileSheetMetadata.getElementsByTagName("image")[0].getAttribute("source")
        }
    }

    let tileCollisionMapById = {}
    for (const tile of tileSheetMetadata.getElementsByTagName("tile")) {
        id = tile.getAttribute("id")
        tileCollisions = tile.getElementsByTagName("objectgroup")
        if (tileCollisions.length === 0) continue;
        for (collisionRect of tile.getElementsByTagName("objectgroup")[0].getElementsByTagName("object")) {
            if (tileCollisionMapById[id] === undefined) tileCollisionMapById[id] = []
            rect = {
                x: Math.round(parseFloat(collisionRect.getAttribute("x"))),
                y: Math.round(parseFloat(collisionRect.getAttribute("y"))),
                width: Math.round(parseFloat(collisionRect.getAttribute("width"))),
                height: Math.round(parseFloat(collisionRect.getAttribute("height"))),
            }
        }
    }

    return tileMetadataFileInfo
}

export function createTiles(tileMetadataFileInfo) {
    let yPosition = 0
    let tiles = []
    for (const tRow of tileList) {
        let xPosition = 0
        for (const tileId of tRow) {
            const tile = {}
            const spriteContainer = new Container()
            tile.sprite = spriteContainer
            tile.x = xPosition
            tile.y = yPosition
            spriteContainer.addChild(getSpriteFromId(tileMetadataFileInfo, parseInt(tileId)))

            tiles = [...tiles, tile]
            //newTileId = (parseInt(tileId) - 1).toString()
            //let rects = tileCollisionMapById[newTileId]
            //if (rects !== undefined) {
            //  for (r of rects) {
            //    spriteContainer.addChild(createCollisionRect(r))
            //    world.collisionRects.push({x: r.x + xPosition, y: r.y + yPosition, width: r.width, height: r.height})
            //  }
            //}

            xPosition += 32
        }
        yPosition += 32
    }

    return tiles
}

function getSpriteFromId(tileMetadataFileInfo, gidFromTileList) {
    let tileMetadataToUse = null
    let gidOfTileMetadata = 0

    const gidsFromFileInfos = Object.keys(tileMetadataFileInfo)
    gidsFromFileInfos.sort((a, b) => parseInt(b) - parseInt(a))
    for (const gid of gidsFromFileInfos) {
        if (parseInt(gid) <= parseInt(gidFromTileList)) {
            gidOfTileMetadata = gid
            tileMetadataToUse = tileMetadataFileInfo[gid]
            break
        }
    }

    const idInTilesheet = gidFromTileList - gidOfTileMetadata

    const rowNumber = Math.floor(idInTilesheet / parseInt(tileMetadataToUse.tilecolumns))
    const columnNumber = idInTilesheet - rowNumber * parseInt(tileMetadataToUse.tilecolumns)

    const horizontalSpacing = 1 + columnNumber
    const verticalSpacing = 1 + rowNumber

    const xPosition = horizontalSpacing + columnNumber * 32
    const yPosition = verticalSpacing + rowNumber * 32

    return new Sprite(new Texture(Loader.shared.resources["images/level/" + tileMetadataToUse.imageFileName].texture, new Rectangle(xPosition, yPosition, 32, 32)))
}
