import { Button, CircularProgress, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = {
  onClick: () => void
  inProgress: boolean
}

const ButtonMore: FunctionComponent<Props> = ({ onClick, inProgress }) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Button className={classes.button} onClick={onClick} variant={'outlined'}>
        {'さらに読み込む'}
        {inProgress && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </Button>
    </div>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    button: { position: 'relative' },
    buttonProgress: {
      bottom: 0,
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      top: 0
    },
    root: { display: 'grid', justifyContent: 'center' }
  }
})

export default ButtonMore
