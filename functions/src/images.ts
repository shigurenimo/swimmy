import { storage } from 'firebase-admin'
import { region } from 'firebase-functions'
import { tmpdir } from 'os'
import { join } from 'path'
import sharp from 'sharp'
import { US_CENTRAL1 } from './constants/region'
import { toFit } from './modules/image/toFit'
import { toHeight } from './modules/image/toHeight'
import { toWidth } from './modules/image/toWidth'
import { ImageQuery } from './modules/image/types/imageQuery'

const functionBuilder = region(US_CENTRAL1)

module.exports = functionBuilder.https.onRequest(async (req, resp) => {
  if (req.path === '/' || req.path === '/images/') {
    return resp.status(404).end()
  }

  const fileId = req.path.replace('/images/', '').replace('/', '')

  const filePath = `posts/${fileId}`

  const destination = join(tmpdir(), fileId)

  const file = storage().bucket('umfzwkzvrtpe.appspot.com').file(filePath)

  await file.download({ destination })

  let image = await sharp(destination)

  const query: ImageQuery = req.query

  image = image.resize({
    fit: toFit(query),
    width: toWidth(query),
    height: toHeight(query),
  })

  if (query.fm === 'png') {
    resp.set('Content-Type', 'image/png')
    image = image.png()
  }

  if (query.fm === 'jpg') {
    resp.set('Content-Type', 'image/jpeg')
    image = image.jpeg()
  }

  if (req.query.fm !== 'png' && req.query.fm !== 'jpg') {
    resp.set('Content-Type', 'image/webp')
    image = image.webp()
  }

  const buffer = await image.toBuffer()

  resp.set('cache-control', 'public, max-age=31536000')

  resp.send(buffer)
})
