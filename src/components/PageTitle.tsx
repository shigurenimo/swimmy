import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import { px } from '../libs/styles/px'

interface Props {
  title: string
  description: string
  hide?: boolean
}

const PageTitle: FunctionComponent<Props> = ({
  title,
  description,
  hide = true
}) => {
  const classes = useStyles({})

  const { isLogged, isLoggingIn } = useContext(AuthContext)

  if (hide && isLoggingIn) return null

  if (hide && isLogged) return null

  return (
    <div className={classes.root}>
      <Typography variant={'h5'} component={'h1'} color="inherit">
        {title}
      </Typography>
      <Typography
        color={'inherit'}
        variant={'caption'}
        className={classes.description}
      >
        {description}
      </Typography>
    </div>
  )
}

const useStyles = makeStyles(({ spacing, palette }) => {
  return {
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit),
      padding: spacing.unit * 2,
      backgroundColor: palette.primary.main,
      color: 'white'
    },
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' }
  }
})

export default PageTitle
