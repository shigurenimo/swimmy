import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import { px } from '../libs/styles/px'

type Props = {
  title: string
  description: string
  hide?: boolean
}

const ViewTitle: FunctionComponent<Props> = ({
  title,
  description,
  hide = true
}) => {
  const classes = useStyles({})
  const { isLogged, isLoggingIn } = useContext(AuthContext)

  if (hide && isLoggingIn) {
    return null
  }

  if (hide && isLogged) {
    return null
  }

  return (
    <div className={classes.root}>
      <Typography color={'inherit'} component={'h1'} variant={'h5'}>
        {title}
      </Typography>
      <Typography
        className={classes.description}
        color={'inherit'}
        variant={'caption'}
      >
        {description}
      </Typography>
    </div>
  )
}

const useStyles = makeStyles(({ spacing, palette }) => {
  return {
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    root: {
      backgroundColor: palette.primary.main,
      color: 'white',
      display: 'grid',
      gridRowGap: px(spacing.unit),
      padding: spacing.unit * 2
    }
  }
})

export default ViewTitle
