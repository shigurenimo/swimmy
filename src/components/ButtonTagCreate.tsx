import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Theme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { Fragment, FunctionComponent, useState } from 'react'

type Props = { postId: string }

const ButtonTagCreate: FunctionComponent<Props> = ({ postId }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <Button
        color={'primary'}
        className={classes.root}
        onClick={() => setOpen(true)}
        variant={'outlined'}
      >
        {'＋'}
      </Button>
      <TextField autoFocus placeholder={'イイネ'} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <TextField
            autoFocus
            margin={'dense'}
            placeholder={'イイネ'}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{'やめる'}</Button>
          <Button
            onClick={() => setOpen(false)}
            color={'primary'}
            variant={'contained'}
          >
            {'追加する'}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ palette, spacing }) => {
  return {
    root: {
      minWidth: 0,
      paddingBottom: spacing(0.1),
      paddingTop: spacing(0.1),
    },
  }
})

export default ButtonTagCreate
