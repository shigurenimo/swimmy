import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useCreateResponse } from 'src/thread/hooks/useCreateResponse'

type Props = { threadId: string }

export const TextFieldResponse: FunctionComponent<Props> = ({ threadId }) => {
  const classes = useStyles()

  const [text, setText] = useState('')

  const [loading, createResponse] = useCreateResponse(
    {
      fileIds: [],
      replyPostId: threadId,
      text: text,
    },
    () => {
      setText('')
    }
  )

  const inProgress = loading

  const disabled = inProgress || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <TextField
        disabled={inProgress}
        fullWidth
        multiline
        onChange={(event) => {
          if (inProgress) return
          setText(event.target.value)
        }}
        placeholder={'新しいコメント'}
        size={'small'}
        value={text}
        variant={'outlined'}
      />
      <Button
        aria-label={'Send a post'}
        className={classes.submitButton}
        classes={{ root: classes.buttonRoot }}
        color={'primary'}
        disabled={disabled}
        onClick={createResponse}
        variant={'contained'}
      >
        {loading ? <CircularProgress size={24} /> : <NearMe />}
      </Button>
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right' },
    buttonRoot: {
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      minWidth: 0,
    },
    buttonProgress: {
      bottom: 0,
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      top: 0,
    },
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
    submitButton: { position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: `${spacing(2)}px`,
      gridRowGap: `${spacing(2)}px`,
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      width: '100%',
    },
  }
})
