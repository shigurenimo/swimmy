import MenuIcon from "@mui/icons-material/MenuRounded"
import {
  AppBar,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material"
import { FC } from "react"

type Props = {
  onLogin(): void
  onLogout(): void
  onOpenDrawer(): void
}

export const BoxHeader: FC<Props> = (props) => {
  const trigger = useScrollTrigger({
    target: typeof window !== "undefined" ? window : undefined,
  })

  return (
    <>
      <Slide appear={false} direction={"down"} in={!trigger}>
        <AppBar
          position={"sticky"}
          sx={{
            background: (theme) => theme.palette.background.default,
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ width: "100%" }}
              alignItems={"center"}
            >
              <Typography fontSize={"xs"} fontWeight={"bold"} component={"div"}>
                {"スイミー電子掲示板"}
              </Typography>
              <IconButton
                color={"primary"}
                aria-label={"メニュー"}
                component={"span"}
                onClick={props.onOpenDrawer}
                size={"small"}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
      </Slide>
    </>
  )
}
