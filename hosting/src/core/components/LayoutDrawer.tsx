import { Drawer, useTheme } from '@mui/material'
import React, { FunctionComponent } from 'react'

export const LayoutDrawer: FunctionComponent = ({ children }) => {
  const theme = useTheme()

  return (
    <Drawer
      open={true}
      PaperProps={{
        elevation: 1,
        sx: {
          width: theme.spacing(40),
        },
      }}
      variant={'persistent'}
      sx={{
        display: {
          xs: 'none',
          md: 'block',
        },
        overflow: 'hidden',
        width: theme.spacing(40),
      }}
    >
      {children}
    </Drawer>
  )
}
