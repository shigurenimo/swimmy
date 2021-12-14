import DescriptionIcon from "@mui/icons-material/DescriptionRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import LockIcon from "@mui/icons-material/LockRounded"
import LoginIcon from "@mui/icons-material/LoginRounded"
import LogoutIcon from "@mui/icons-material/LogoutRounded"
import PhotoIcon from "@mui/icons-material/PhotoRounded"
import QuickreplyIcon from "@mui/icons-material/QuickreplyRounded"
import SecurityIcon from "@mui/icons-material/SecurityRounded"
import SettingsIcon from "@mui/icons-material/SettingsRounded"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { Link, useRouter, useSession } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  isDense: boolean
  onLogin(): void
  onLogout(): void
}

export const BoxNavigation: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const router = useRouter()

  const isLoggedIn = session.userId != null

  const listItems = [
    {
      primary: "ホーム",
      icon: <HomeIcon />,
      href: "/",
      isDisabled: false,
      isActive: router.pathname === "/",
    },

    {
      primary: "マイスペース",
      icon: <LockIcon />,
      href: "/feed",
      isDisabled: !isLoggedIn,
      isActive: router.pathname.startsWith("/feed"),
    },
    {
      primary: "スレッド",
      icon: <QuickreplyIcon />,
      href: "/threads",
      isDisabled: false,
      isActive: router.pathname.startsWith("/threads"),
    },
    {
      primary: "フォト",
      icon: <PhotoIcon />,
      href: "/photos",
      isDisabled: false,
      isActive: router.pathname.startsWith("/photos"),
    },
    {
      primary: "設定",
      icon: <SettingsIcon />,
      href: "/preferences",
      isDisabled: true,
      isActive: router.pathname.startsWith("/preferences"),
    },
    {
      primary: "利用規約",
      icon: <DescriptionIcon />,
      href: "/terms",
      isDisabled: false,
      isActive: router.pathname === "/terms",
    },
    {
      primary: "個人情報保護方針",
      icon: <SecurityIcon />,
      href: "/privacy",
      isDisabled: false,
      isActive: router.pathname === "/privacy",
    },
  ]

  return (
    <Stack
      component={"nav"}
      width={"100%"}
      minWidth={(theme) => {
        return props.isDense ? theme.spacing(11) : theme.spacing(32)
      }}
      maxWidth={(theme) => {
        return props.isDense ? theme.spacing(11) : theme.spacing(32)
      }}
    >
      <Box position={"sticky"} top={0}>
        {!props.isDense && (
          <Stack px={2} pt={2}>
            <Typography
              sx={{
                fontWeight: (theme) => theme.typography.fontWeightBold,
                fontSize: (theme) => theme.typography.pxToRem(14),
              }}
            >
              {"スイミー電子掲示板"}
            </Typography>
          </Stack>
        )}
        <List component={"nav"} dense>
          {listItems.map((item) => (
            <Link href={item.href} key={item.primary}>
              <ListItem
                key={item.primary}
                sx={{ pl: 0, pr: props.isDense ? 0 : 2 }}
              >
                <ListItemButton
                  sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
                  disabled={item.isDisabled}
                  selected={item.isActive}
                >
                  <ListItemIcon sx={{ minWidth: (theme) => theme.spacing(5) }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      props.isDense ? item.primary.slice(0, 1) : item.primary
                    }
                    primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
          {!isLoggedIn && (
            <ListItem sx={{ pl: 0, pr: props.isDense ? 0 : 2 }}>
              <ListItemButton
                sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
                onClick={props.onLogin}
              >
                <ListItemIcon sx={{ minWidth: (theme) => theme.spacing(5) }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText
                  primary={props.isDense ? "ロ" : "ログイン"}
                  primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && (
            <ListItem sx={{ pl: 0, pr: props.isDense ? 0 : 2 }}>
              <ListItemButton
                sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
                onClick={props.onLogout}
              >
                <ListItemIcon sx={{ minWidth: (theme) => theme.spacing(5) }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={props.isDense ? "ロ" : "ログアウト"}
                  primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Stack>
  )
}
