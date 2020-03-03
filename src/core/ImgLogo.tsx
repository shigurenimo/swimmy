import { IconButton, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = { disabled: boolean }

const ImgLogo: FunctionComponent<Props> = ({ disabled }) => {
  const classes = useStyles()

  return (
    <Link
      className={classes.root}
      to={'/'}
      style={{ display: disabled ? 'none' : 'block' }}
    >
      <IconButton aria-label={'Go home page'} className={classes.button}>
        <img alt={'swimmy'} className={classes.img} src={'/images/app.png'} />
      </IconButton>
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    button: { padding: 0 },
    img: { height: spacing(3 + 3) },
  }
})

export default ImgLogo
