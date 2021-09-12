import { Avatar, Box } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

export const ImageLogo: FunctionComponent = () => {
  return (
    <Box display={'grid'} alignContent={'center'}>
      <Link to={'/'}>
        <Avatar alt={'swimmy'} src={'/images/app.png'} />
      </Link>
    </Box>
  )
}
