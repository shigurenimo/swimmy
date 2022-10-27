import { Box, Button, Stack, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { BoxPageCenter } from "interface/components/box/BoxPageCenter"

type Props = {
  error: Error
}

export const BoxPageError: FC<Props> = (props) => {
  return (
    <BoxPageCenter>
      <Stack alignItems={"center"}>
        <Box
          sx={{
            width: "100%",
            maxWidth: (theme) => theme.spacing(48),
            filter:
              "invert(88%) sepia(61%) saturate(0%) hue-rotate(229deg) brightness(107%) contrast(101%)",
          }}
        >
          <Image
            alt={"404"}
            src={"/linustock/1519882858.png"}
            width={512}
            height={512}
          />
        </Box>
      </Stack>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            {"技術的な問題が発生しています"}
          </Typography>
          {props.error.message && (
            <Typography
              sx={{
                fontSize: 14,
                color: (theme) => theme.palette.text.disabled,
              }}
            >
              {props.error.message}
            </Typography>
          )}
        </Stack>
        <Stack direction={"row"}>
          <Link href={"/"}>
            <Button variant={"contained"}>{"ホームに戻る"}</Button>
          </Link>
        </Stack>
      </Stack>
    </BoxPageCenter>
  )
}
