import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import { useCreateResponse } from 'src/thread/hooks/useCreateResponse'

type Props = { threadId: string }

export const TextFieldResponse: FunctionComponent<Props> = ({ threadId }) => {
  const classes = useStyles()

  const [text, setText] = useState('')

  const createResponse = useCreateResponse()

  const onCreateResponse = async () => {
    try {
      await createResponse.mutateAsync({
        fileIds: [],
        replyPostId: threadId,
        text,
      })
      setText('')
    } catch (error) {
      console.error(error)
    }
  }

  const isDisabled = createResponse.isLoading || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <TextField
        disabled={createResponse.isLoading}
        fullWidth
        multiline
        onChange={(event) => {
          if (createResponse.isLoading) return
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
        disabled={isDisabled}
        onClick={onCreateResponse}
        variant={'contained'}
      >
        {createResponse.isLoading ? <CircularProgress size={24} /> : <NearMe />}
      </Button>
    </section>
  )
}

const useStyles = makeStyles<Theme>((theme) => {
  return {
    actions: { textAlign: 'right' },
    buttonRoot: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
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
      columnGap: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    submitButton: { position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      width: '100%',
    },
  }
})
