import IconButton from '@material-ui/core/IconButton/IconButton'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { Link } from 'react-router-dom'

const AppTitle = ({ classes }) => (
  <div className={classes.root}>
    <Link to={'/'}>
      <IconButton className={classes.button}>
        <img className={classes.img} src={'/images/app.png'} alt={'swimmy'} />
      </IconButton>
    </Link>
  </div>
)

const styles = () => ({
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

export default withStyles(styles)(AppTitle)
