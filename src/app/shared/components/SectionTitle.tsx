import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { AuthContext } from 'app/shared/contexts/authContext'
import { px } from 'app/shared/styles/px'
import React, { FunctionComponent, useContext } from 'react'

type Props = {
  title: string
  description: string
  hide?: boolean
}

const SectionTitle: FunctionComponent<Props> = ({
  title,
  description,
  hide = true
}) => {
  const classes = useStyles({})
  const { isLogged, isLoggingIn } = useContext(AuthContext)

  if (hide && (isLoggingIn || isLogged)) {
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

const useStyles = makeStyles<Theme>(({ spacing, palette }) => {
  return {
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    root: {
      backgroundColor: palette.primary.main,
      color: 'white',
      display: 'grid',
      gridRowGap: px(spacing(1)),
      padding: spacing(2)
    }
  }
})

export default SectionTitle
