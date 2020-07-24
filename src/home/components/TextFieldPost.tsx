import { Button, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useCreatePost } from '../hooks/useCreatePost'
import { usePlaceholder } from '../hooks/usePlaceholder'

const TextFieldPost: FunctionComponent = () => {
  const classes = useStyles()

  const [text, setText] = useState('')

  const [inProgressPost, createPost] = useCreatePost(
    {
      fileIds: [],
      replyPostId: '',
      text,
    },
    () => {
      setText('')
    }
  )

  const placeholder = usePlaceholder()

  const inProgress = inProgressPost

  const disabled = inProgress || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <TextField
        size={'small'}
        classes={{ root: classes.textField }}
        disabled={inProgress}
        fullWidth
        multiline
        onChange={event => {
          if (inProgress) return
          setText(event.target.value)
        }}
        placeholder={placeholder}
        value={text}
        variant={'outlined'}
      />
      {text.length !== 0 && (
        <div className={classes.actions}>
          <Button
            aria-label={'Send a post'}
            className={classes.submitButton}
            color={'primary'}
            disabled={disabled}
            onClick={createPost}
            variant={'contained'}
          >
            {inProgressPost ? '書き込み中..' : '書き込む'}
          </Button>
        </div>
      )}
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right', paddingRight: spacing(1.5) },
    root: {
      display: 'grid',
      gridRowGap: spacing(1),
      paddingTop: spacing(1),
    },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
    textField: { paddingLeft: spacing(1.5), paddingRight: spacing(1.5) },
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

export default TextFieldPost
