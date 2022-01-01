import CloseIcon from "@mui/icons-material/CloseRounded"
import { Box, Button, Stack, Typography } from "@mui/material"
import React, { FunctionComponent } from "react"

type Props = {
  title: string
  onClose?(): void
}

export const BoxAside: FunctionComponent<Props> = (props) => {
  return (
    <Stack
      component={"aside"}
      position={"sticky"}
      width={"100%"}
      height={(theme) => {
        return {
          xs: "auto",
          sm: "100vh",
        }
      }}
      sx={{
        top: 0,
        py(theme) {
          return {
            xs: theme.spacing(0),
            sm: theme.spacing(2),
          }
        },
        pr(theme) {
          return {
            xs: theme.spacing(0),
            sm: theme.spacing(2),
            md: theme.spacing(0),
          }
        },
        maxWidth(theme) {
          return {
            md: theme.spacing(40),
            lg: theme.spacing(60),
          }
        },
        minWidth(theme) {
          return {
            md: theme.spacing(40),
            lg: theme.spacing(48),
          }
        },
      }}
    >
      <Stack
        sx={{
          height: "100%",
          borderRadius: 1,
          borderWidth(theme) {
            return {
              xs: 0,
              sm: 1,
            }
          },
          borderStyle: "solid",
          borderColor(theme) {
            return theme.palette.divider
          },
          overflowY: "scroll",
          background: "rgba(0,0,0,0.2)",
          // background: (theme) => theme.palette.background.paper,
        }}
      >
        <Stack
          direction={"row"}
          px={2}
          pt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ fontWeight: "bold" }}>{props.title}</Typography>
          {props.onClose && (
            <Button
              variant={"outlined"}
              endIcon={<CloseIcon />}
              size={"small"}
              onClick={props.onClose}
            >
              {"閉じる"}
            </Button>
          )}
          {!props.onClose && <Box sx={{ p: 1.92 }} />}
        </Stack>
        {props.children}
      </Stack>
    </Stack>
  )
}
