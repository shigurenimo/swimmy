import { Box, Button, ButtonProps, Stack, Typography } from "@mui/material"
import { FC } from "react"

type Props = ButtonProps

export const ButtonLoginWithGoogle: FC<Props> = (props) => {
  return (
    <Button
      variant={"contained"}
      size={"small"}
      sx={{ width: "100%", p: 0, background: "white" }}
      color={"inherit"}
      {...props}
    >
      <Stack direction={"row"} alignItems={"center"} sx={{ width: "100%" }}>
        <Box
          component={"img"}
          src={"/google/btn_google_light_normal_ios.svg"}
        />
        <Stack flex={1} alignItems={"center"}>
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              sx={{
                color: (theme) => theme.palette.grey[900],
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
              {"Googleでログイン"}
            </Typography>
            <Box sx={{ width: 46, height: 46 }}></Box>
          </Stack>
        </Stack>
      </Stack>
    </Button>
  )
}
