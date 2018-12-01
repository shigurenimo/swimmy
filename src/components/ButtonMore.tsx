import Button from '@material-ui/core/Button/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import { makeStyles } from '@material-ui/styles'
import React, { SFC } from 'react'

interface Props {
  onClick: () => void
  inProgress: boolean
}

const ButtonMore: SFC<Props> = ({ onClick, inProgress }) => {
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
    root: { display: 'grid', justifyContent: 'center' },
    button: { position: 'relative' },
    buttonProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto'
    }
  }
})

export default ButtonMore
