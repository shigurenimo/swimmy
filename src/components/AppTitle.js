import createStyles from '@material-ui/core/es/styles/createStyles'
import IconButton from '@material-ui/core/IconButton/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { Link } from 'react-router-dom'

const Component = ({ classes }) => {
  return (
    <div className={classes.root}>
      <Link to={'/'}>
        <IconButton className={classes.button}>
          <img className={classes.img} src={'/images/app.png'} alt={'swimmy'} />
        </IconButton>
      </Link>
    </div>
  )
}

const styles = createStyles({
  root: {
    flexGrow: 1
  },
  button: {
    padding: 0
  },
  img: {
    height: 24 + 24
  }
})

export const AppTitle = withStyles(styles)(Component)
