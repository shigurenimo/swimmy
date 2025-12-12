import DescriptionIcon from "@mui/icons-material/DescriptionRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import QuickreplyIcon from "@mui/icons-material/QuickreplyRounded"
import SecurityIcon from "@mui/icons-material/SecurityRounded"
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
import { useRouter } from "next/router"
import { FC } from "react"

type Props = {
  isDense: boolean
}

export const BoxNavigation: FC<Props> = (props) => {
  const router = useRouter()

  const onRoute = (path: string) => {
    router.push(path)
  }

  const listItems = [
    {
      primary: "ホーム",
      icon: <HomeIcon />,
      href: "/",
      isDisabled: false,
      isActive: router.pathname === "/",
    },
    // {
    //   primary: "マイスペース",
    //   icon: <LockIcon />,
    //   href: "/feed",
    //   isDisabled: !isLoggedIn,
    //   isActive: router.pathname.startsWith("/feed"),
    // },
    {
      primary: "スレッド",
      icon: <QuickreplyIcon />,
      href: "/threads",
      isDisabled: false,
      isActive: router.pathname.startsWith("/threads"),
    },
    // {
    //   primary: "フォト",
    //   icon: <PhotoIcon />,
    //   href: "/photos",
    //   isDisabled: false,
    //   isActive: router.pathname.startsWith("/photos"),
    // },
    // {
    //   primary: "設定",
    //   icon: <SettingsIcon />,
    //   href: "/preferences",
    //   isDisabled: true,
    //   isActive: router.pathname.startsWith("/preferences"),
    // },
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
    <>
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
          <List dense>
            {listItems.map((item) => (
              <ListItem
                key={item.primary}
                sx={{ pl: 0, pr: props.isDense ? 0 : 2 }}
              >
                <ListItemButton
                  disabled={item.isDisabled}
                  selected={item.isActive}
                  onClick={() => {
                    onRoute(item.href)
                  }}
                  sx={{
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
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
            ))}
          </List>
        </Box>
      </Stack>
    </>
  )
}
