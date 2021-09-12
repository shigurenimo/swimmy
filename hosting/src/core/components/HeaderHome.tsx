import {
  AppBar,
  Box,
  Fade,
  IconButton,
  Slide,
  Theme,
  Toolbar,
  useScrollTrigger,
  useTheme,
} from '@material-ui/core'
import FlightIcon from '@material-ui/icons/Flight'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/styles'
import { getAnalytics, logEvent } from 'firebase/analytics'
import React, { FunctionComponent, useState } from 'react'
import { DialogMenu } from 'src/core/components/DialogMenu'
import { ImageLogo } from 'src/core/components/ImageLogo'
import { detectStandalone } from 'src/core/utils/detectStandalone'

export const HeaderHome: FunctionComponent = () => {
  const theme = useTheme()

  const [openDialog, setOpenDialog] = useState(false)

  const classes = useStyles()

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
        className={classes.appBar}
        color={'inherit'}
        elevation={triggerElevation ? 1 : 0}
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

const useStyles = makeStyles<Theme>(({ breakpoints, spacing, palette }) => {
  return {
    appBar: {
      paddingTop: 'env(safe-area-inset-top)',
      backgroundColor: palette.background.default,
    },
    actions: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridColumnGap: spacing(1),
    },
  }
})
