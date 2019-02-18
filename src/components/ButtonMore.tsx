import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

interface Props {
  onClick: () => void
  inProgress: boolean
}

const ButtonMore: FunctionComponent<Props> = ({ onClick, inProgress }) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Button onClick={onClick} className={classes.button}>
        MORE
        {inProgress && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </Button>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
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
