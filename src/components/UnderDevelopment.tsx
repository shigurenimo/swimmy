import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = {
  description: string
  title: string
  Icon: any
}

const UnderDevelopment: FunctionComponent<Props> = ({
  description,
  title,
  Icon
}) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Icon className={classes.icon} />
      <Typography
        className={classes.title}
        align={'center'}
        variant={'h6'}
        gutterBottom
      >
        {title}
      </Typography>
      <Typography align={'center'} variant={'body1'}>
        {description}
      </Typography>
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    icon: { display: 'block', margin: 'auto', fontSize: 80 },
    root: { paddingLeft: spacing.unit * 1.5, paddingRight: spacing.unit * 1.5 },
    title: { marginTop: spacing.unit * 2, fontWeight: 'bold' }
  }
})

export default UnderDevelopment
