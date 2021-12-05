import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material"
import React, { FunctionComponent } from "react"

type Props = {
  onClose(): void
  isOpen: boolean
  onLogout(): void
}

export const DialogLogout: FunctionComponent<Props> = (props) => {
  return (
    <Dialog
      onClose={props.onClose}
      open={props.isOpen}
      fullWidth={true}
      maxWidth={"xs"}
    >
      <DialogContent sx={{ px: 2 }}>
        <Stack spacing={2}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          >
            {"ログアウトしますか？"}
          </Typography>
          <Stack direction={"row"} spacing={2}>
            <Button onClick={props.onClose}>{"キャンセル"}</Button>
            <Button variant={"contained"} onClick={props.onLogout}>
              {"ログアウト"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
