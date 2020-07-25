import { Button } from '@material-ui/core'
import React, { FunctionComponent } from 'react'

type Props = {
  onClick: () => void
  inProgress: boolean
}

export const ButtonMore: FunctionComponent<Props> = ({
  onClick,
  inProgress,
}) => {
  return (
    <Button
      disabled={inProgress}
      onClick={() => {
        if (inProgress) return
        onClick()
      }}
      variant={'outlined'}
    >
      {inProgress ? '読み込み中...' : 'さらに読み込む'}
    </Button>
  )
}
