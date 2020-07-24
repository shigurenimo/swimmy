import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useCreateResponse } from '../hooks/useCreateResponse'

type Props = { threadId: string }

const TextFieldResponse: FunctionComponent<Props> = ({ threadId }) => {
  const classes = useStyles()

  const [text, setText] = useState('')

  const [inProgressPost, createResponse] = useCreateResponse(
    {
      fileIds: [],
      replyPostId: threadId,
      text: text,
    },
    () => {
      setText('')
    }
  )

  const inProgress = inProgressPost

  const disabled = inProgress || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <div>
        <TextField
          disabled={inProgress}
          fullWidth
          multiline
          onChange={event => {
            if (inProgress) return
            setText(event.target.value)
          }}
          placeholder={'新しいコメント'}
          size={'small'}
          value={text}
          variant={'outlined'}
        />
      </div>
      <div className={classes.actions}>
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          color={'primary'}
          disabled={disabled}
          onClick={createResponse}
          variant={disabled ? 'outlined' : 'contained'}
        >
          {'送信'}
          {inProgressPost && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right' },
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
      gridRowGap: `${spacing(1)}px`,
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
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

export default TextFieldResponse
