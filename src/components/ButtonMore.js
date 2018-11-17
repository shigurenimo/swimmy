import Button from '@material-ui/core/Button/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'

const Component = ({ classes, onClick, inProgress }) => {
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

const styles = ({ spacing }) =>
  createStyles({
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
  })

export const ButtonMore = withStyles(styles)(Component)
