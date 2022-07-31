import {
  Box,
  Button,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { BoxPageCenter } from "app/interface/components/box/BoxPageCenter"

export const BoxPageError404: FC = () => {
  const isTwoColumn = useMediaQuery<Theme>(
    (theme) => theme.breakpoints.up("md"),
    { noSsr: true }
  )

  return (
    <BoxPageCenter>
      <Stack
        sx={{ alignItems: "center" }}
        direction={isTwoColumn ? "row" : "column"}
        spacing={4}
      >
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
              src={"/linustock/1513420261.png"}
              width={512}
              height={512}
            />
          </Box>
        </Stack>
        <Stack spacing={2} sx={{ maxWidth: (theme) => theme.spacing(40) }}>
          <Stack spacing={1}>
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {"お探しのページは見つかりません"}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: (theme) => theme.palette.text.disabled,
              }}
            >
              {
                "お探しのページは一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。"
              }
            </Typography>
          </Stack>
          <Stack direction={"row"}>
            <Link href={"/"}>
              <Button variant={"contained"}>{"ホームに戻る"}</Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </BoxPageCenter>
  )
}
