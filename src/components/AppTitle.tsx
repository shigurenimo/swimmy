import IconButton from '@material-ui/core/IconButton/IconButton'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { SFC } from 'react'
import { Link } from 'react-router-dom'

const AppTitle: SFC = () => {
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
    root: { flexGrow: 1 },
    button: { padding: 0 },
    img: { height: spacing.unit * 3 + spacing.unit * 3 }
  }
})

export default AppTitle
