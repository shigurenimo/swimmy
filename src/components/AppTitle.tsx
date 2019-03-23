import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

const AppTitle: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Link to={'/'}>
        <IconButton aria-label={'Go home page'} className={classes.button}>
          <img alt={'swimmy'} className={classes.img} src={'/images/app.png'} />
        </IconButton>
      </Link>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    button: { padding: 0 },
    img: { height: spacing.unit * 3 + spacing.unit * 3 },
    root: { flexGrow: 1 }
  }
})

export default AppTitle
