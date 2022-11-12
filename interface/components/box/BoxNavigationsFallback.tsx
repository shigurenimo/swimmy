import DescriptionIcon from "@mui/icons-material/DescriptionRounded"
import HomeIcon from "@mui/icons-material/HomeRounded"
import LoginIcon from "@mui/icons-material/LoginRounded"
import QuickreplyIcon from "@mui/icons-material/QuickreplyRounded"
import SecurityIcon from "@mui/icons-material/SecurityRounded"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { FC } from "react"

export const BoxNavigationsFallback: FC = (props) => {
  const listItems = [
    { primary: "ホーム", icon: <HomeIcon /> },
    { primary: "スレッド", icon: <QuickreplyIcon /> },
    // { primary: "マイスペース", icon: <LockIcon /> },
    // { primary: "設定", icon: <SettingsIcon /> },
    { primary: "利用規約", icon: <DescriptionIcon /> },
    { primary: "個人情報保護方針", icon: <SecurityIcon /> },
  ]

  return (
    <List component={"nav"} dense>
      {listItems.map((item) => (
        <ListItem key={item.primary} disablePadding sx={{ pt: 1 }}>
          <ListItemButton
            sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
          >
            <ListItemIcon sx={{ minWidth: (theme) => theme.spacing(5) }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.primary}
              primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem disablePadding sx={{ pt: 1 }}>
        <ListItemButton
          sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
        >
          <ListItemIcon sx={{ minWidth: (theme) => theme.spacing(5) }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText
            primary={"読込中"}
            primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
