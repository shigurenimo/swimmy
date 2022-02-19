import { captureException } from "@sentry/node"
import { getStorage } from "firebase-admin/storage"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { FirebaseAdapter } from "integrations/infrastructure"
import sharp from "sharp"
import { injectable } from "tsyringe"

type Props = {
  fileId: Id
  width: number
  quality: number
}

@injectable()
export class ReadImageQuery {
  constructor(private readonly firebaseAdapter: FirebaseAdapter) {}

  async execute(props: Props) {
    try {
      await this.firebaseAdapter.initialize()

      const bucket = getStorage().bucket()

      const [buffer] = await bucket.file(props.fileId.value).download({
        validation: false,
      })

      return sharp(buffer)
        .resize(props.width)
        .png({ quality: props.quality })
        .toBuffer()
    } catch (error) {
      console.error(error)
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
