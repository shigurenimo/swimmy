import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useCreatePost } from '../../post/hooks/useCreatePost'

export const TextFieldPhoto: FunctionComponent = () => {
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

  const disabled = loading || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <TextField
        disabled={loading}
        fullWidth
        multiline
        onChange={event => {
          if (loading) return
          setText(event.target.value)
        }}
        placeholder={'テキスト'}
        size={'small'}
        value={text}
        variant={'outlined'}
      />
      {text.trim().length !== 0 && (
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
      )}
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      paddingLeft: spacing(1.5),
      paddingRight: spacing(1.5),
    },
    buttonRoot: { paddingLeft: 8, paddingRight: 8, minWidth: 0 },
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
