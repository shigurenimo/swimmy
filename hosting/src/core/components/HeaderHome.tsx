import FlightIcon from '@mui/icons-material/Flight'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Fade,
  IconButton,
  Slide,
  Toolbar,
  useScrollTrigger,
  useTheme,
} from '@mui/material'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useState } from 'react'
import { DialogMenu } from 'src/core/components/DialogMenu'
import { ImageLogo } from 'src/core/components/ImageLogo'
import { detectStandalone } from 'src/core/utils/detectStandalone'

export const HeaderHome: FunctionComponent = () => {
  const theme = useTheme()

  const [openDialog, setOpenDialog] = useState(false)

  const isStandalone = detectStandalone()

  const trigger = useScrollTrigger({ threshold: 100 })

  const triggerElevation = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  })

  const triggerFlight = useScrollTrigger({
    disableHysteresis: true,
    threshold: 600,
  })

  const onScroll = () => {
    logEvent(getAnalytics(), 'tap_to_scroll_top')
    document.body.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Slide appear={false} direction={'down'} in={!trigger}>
      <AppBar
        color={'inherit'}
        elevation={triggerElevation ? 1 : 0}
        sx={{
          paddingTop: 'env(safe-area-inset-top)',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            paddingLeft: {
              md: theme.spacing(40 + 3),
            },
          }}
        >
          <ImageLogo />
          <Box>
            {isStandalone ? (
              <Fade in={triggerFlight}>
                <IconButton onClick={onScroll}>
                  <FlightIcon color={'action'} />
                </IconButton>
              </Fade>
            ) : (
              <IconButton onClick={() => setOpenDialog(true)}>
                <MenuIcon fontSize={'inherit'} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        <DialogMenu open={openDialog} onClose={() => setOpenDialog(false)} />
      </AppBar>
    </Slide>
  )
}
