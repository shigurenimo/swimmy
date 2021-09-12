import { Avatar, Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = { disabled: boolean }

export const ImageLogo: FunctionComponent<Props> = ({ disabled }) => {
  const classes = useStyles()

  return (
    <Box display={'grid'} alignContent={'center'}>
      <Link
        className={classes.root}
        to={'/'}
        style={{ display: disabled ? 'none' : 'block' }}
      >
        <Avatar alt={'swimmy'} src={'/images/app.png'} />
      </Link>
    </Box>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    button: { padding: 0 },
    img: { height: spacing(3 + 3) },
  }
})
