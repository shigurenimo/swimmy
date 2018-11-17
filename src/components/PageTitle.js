import createStyles from '@material-ui/core/es/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import { px } from '../libs/styles/px'

const Component = ({ classes, title, description, hide = true }) => {
  const { isLogged, isLoggingIn } = useContext(AuthContext)

  if (hide && isLoggingIn) return null

  if (hide && isLogged) return null

  return (
    <div className={classes.root}>
      <Typography variant={'h5'} component={'h1'} color="inherit">
        {title}
      </Typography>
      <Typography color="inherit" variant={'caption'}>
        {description}
      </Typography>
      {hide && (
        <Typography color="inherit" variant={'caption'}>
          ※この説明はログインすると消えます。
        </Typography>
      )}
    </div>
  )
}

const styles = ({ spacing, palette }) =>
  createStyles({
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit),
      padding: spacing.unit * 2,
      backgroundColor: palette.primary.main,
      color: 'white'
    },
    typography: {}
  })

export const PageTitle = withStyles(styles)(Component)
