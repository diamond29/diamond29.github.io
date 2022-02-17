import { Loader } from 'pixi.js'
import { loadTiles } from './tile_loader'
import { setup } from './setup'

(async () => {
  const loader = Loader.shared

  const tileMetadataFileInfo = await loadTiles()

  loader
    .add("images/treasureHunter.json")

  for (const gid in tileMetadataFileInfo) {
    loader.add("images/level/" + tileMetadataFileInfo[gid].imageFileName)
  }

  loader
    .load(setup(tileMetadataFileInfo));
})()
