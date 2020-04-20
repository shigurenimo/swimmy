import {
  AppBar,
  Fade,
  IconButton,
  Slide,
  Theme,
  Toolbar,
  useScrollTrigger,
} from '@material-ui/core'
import FlightIcon from '@material-ui/icons/Flight'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { FunctionComponent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { detectStandalone } from '../web/detectStandalone'
import DialogMenu from './DialogMenu'
import ImgLogo from './ImgLogo'

const AppBarDefault: FunctionComponent = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const classes = useStyles()

  const isStandalone = detectStandalone()

  const history = useHistory()

  const isFirst =
    history.length === 0 ||
    history.location.pathname === '/' ||
    history.location.pathname === '/images' ||
    history.location.pathname === '/others' ||
    history.location.pathname === '/threads'

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
    analytics().logEvent('tap_to_scroll_top')
    document.body.scrollIntoView({ behavior: 'smooth' })
  }

  const onGoBack = () => {
    analytics().logEvent('tap_to_go_back')
    history.goBack()
  }

  return (
    <Slide appear={false} direction={'down'} in={!trigger}>
      <AppBar
        className={classes.appBar}
        color={'inherit'}
        elevation={triggerElevation ? 1 : 0}
      >
        <Toolbar className={classes.toolbar}>
          <ImgLogo disabled={!isFirst} />
          {!isFirst && (
            <IconButton onClick={onGoBack}>
              <KeyboardReturnIcon />
            </IconButton>
          )}
          {isStandalone ? (
            <Fade in={triggerFlight}>
              <IconButton onClick={onScroll}>
                <FlightIcon color={'action'} />
              </IconButton>
            </Fade>
          ) : (
            <IconButton onClick={() => setOpenDialog(true)}>
              <MenuIcon />
            </IconButton>
          )}
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
    toolbar: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      justifyItems: 'right',
      [breakpoints.up('md')]: { paddingLeft: spacing(40 + 3) },
    },
  }
})

export default AppBarDefault
