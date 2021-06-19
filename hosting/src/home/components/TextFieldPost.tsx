import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { usePlaceholder } from 'src/home/hooks/usePlaceholder'
import { useCreatePost } from 'src/post/hooks/useCreatePost'

export const TextFieldPost: FunctionComponent = () => {
  const classes = useStyles()

  const [text, setText] = useState('')

  const [loading, createPost] = useCreatePost(
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

  const disabled = loading || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <TextField
        disabled={loading}
        fullWidth
        multiline
        onChange={(event) => {
          if (loading) return
          setText(event.target.value)
        }}
        placeholder={placeholder}
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
        onClick={createPost}
        variant={'contained'}
      >
        {loading ? <CircularProgress size={24} /> : <NearMe />}
      </Button>
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
    buttonRoot: {
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      minWidth: 0,
    },
    submitButton: { position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: spacing(2),
      gridRowGap: spacing(2),
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      width: '100%',
    },
  }
})
