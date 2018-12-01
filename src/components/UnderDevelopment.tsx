import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'

interface Props {
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
    root: { paddingLeft: spacing.unit * 1.5, paddingRight: spacing.unit * 1.5 },
    icon: { display: 'block', margin: 'auto', fontSize: 80 },
    title: { marginTop: spacing.unit * 2, fontWeight: 'bold' }
  }
})

export default UnderDevelopment
