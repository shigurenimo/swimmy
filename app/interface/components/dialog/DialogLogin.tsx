import { LoadingButton } from "@mui/lab"
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { ButtonLoginWithGoogle } from "app/interface/components/button/ButtonLoginWithGoogle"
import { FormLogin } from "app/interface/types/formLogin"

type Props = {
  onClose(): void
  isOpen: boolean
  isLoading: boolean
  onLoginWithGoogle(): void
  onLoginWithPassword(username: string, password: string): void
}

export const DialogLogin: FC<Props> = (props) => {
  const { register, handleSubmit, formState } = useForm<FormLogin>()

  const onSubmit: SubmitHandler<FormLogin> = (data) => {
    props.onLoginWithPassword(data.username, data.password)
  }

  return (
    <Dialog
      onClose={props.onClose}
      open={props.isOpen}
      fullWidth={true}
      maxWidth={"xs"}
    >
      <DialogContent sx={{ px: 2 }}>
        <Stack spacing={2}>
          <ButtonLoginWithGoogle onClick={props.onLoginWithGoogle} />
          <Stack direction={"row"} alignItems={"center"}>
            <Stack flex={1}>
              <Divider />
            </Stack>
            <Box px={2}>
              <Typography fontSize={"small"} fontWeight={"bold"}>
                {"または"}
              </Typography>
            </Box>
            <Stack flex={1}>
              <Divider />
            </Stack>
          </Stack>
          <Stack
            component={"form"}
            gap={2}
            sx={{
              borderRadius: 1,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: (theme) => theme.palette.divider,
              p: 2,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
              {"旧ユーザーの方はこちら"}
            </Typography>
            <TextField
              type={"username"}
              variant={"outlined"}
              size={"small"}
              placeholder={"ユーザーID または メールアドレス"}
              error={
                formState.errors.username && formState.touchedFields.username
              }
              disabled={props.isLoading}
              {...register("username", { required: true })}
            />
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
            >
              <TextField
                type={"password"}
                variant={"outlined"}
                size={"small"}
                placeholder={"パスワード"}
                error={
                  formState.errors.password && formState.touchedFields.password
                }
                disabled={props.isLoading}
                sx={{ flex: 1 }}
                {...register("password", { required: true })}
              />
              <LoadingButton
                type={"submit"}
                variant={"contained"}
                loading={props.isLoading}
              >
                {"ログイン"}
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
