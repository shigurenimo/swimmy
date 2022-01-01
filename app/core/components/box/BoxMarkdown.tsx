import { Link as MuiLink, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Link } from "blitz"
import React, { FunctionComponent } from "react"
import ReactMarkdown from "react-markdown"

type Props = {
  fontSize?: number
}

export const BoxMarkdown: FunctionComponent<Props> = (props) => {
  let index = 0

  const baseFontSize = props.fontSize ? props.fontSize : 16

  if (typeof props.children !== "string") {
    return null
  }

  return (
    <Box>
      <ReactMarkdown
        components={{
          h1(props) {
            index += 1

            return (
              <Typography
                component={"h1"}
                sx={{
                  mt: index === 1 ? 0 : 12,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 8,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          h2(props) {
            index += 1

            return (
              <Typography
                component={"h2"}
                sx={{
                  mt: index === 1 ? 0 : 6,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 6,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          h3(props) {
            index += 1

            return (
              <Typography
                component={"h3"}
                sx={{
                  mt: index === 1 ? 0 : 4,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 4,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          h4(props) {
            index += 1

            return (
              <Typography
                component={"h4"}
                sx={{
                  mt: index === 1 ? 0 : 4,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 4,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          h5(props) {
            index += 1

            return (
              <Typography
                component={"h5"}
                sx={{
                  mt: index === 1 ? 0 : 4,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 4,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          h6(props) {
            index += 1

            return (
              <Typography
                component={"h6"}
                sx={{
                  mt: index === 1 ? 0 : 4,
                  mb: 2,
                  fontWeight: "bold",
                  fontSize: baseFontSize + 4,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          p(props) {
            index += 1

            return (
              <Typography
                component={"p"}
                sx={{
                  fontSize: baseFontSize,
                  mt: index === 1 ? 0 : 2,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          code(props) {
            return (
              <Typography
                component={"code"}
                sx={{
                  color: "white",
                  fontFamily: "monospace, monospace",
                  fontSize: baseFontSize - 2,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          pre(props) {
            index += 1

            return (
              <Box
                component={"pre"}
                sx={{
                  mt: 2,
                  mb: 0,
                  borderRadius: 1,
                  px: 2,
                  py: 1.5,
                  overflow: "auto",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                  backgroundColor: (theme) => theme.palette.grey[900],
                }}
              >
                {props.children}
              </Box>
            )
          },
          a(props) {
            const [text] = props.children

            if (typeof props.href === "undefined" || typeof text !== "string") {
              return (
                <Typography component={"span"} sx={{ fontSize: baseFontSize }}>
                  {props.children}
                </Typography>
              )
            }

            if (props.href.includes("http")) {
              return <MuiLink href={props.href}>{text}</MuiLink>
            }

            return (
              <Link href={props.href}>
                <MuiLink sx={{ fontSize: baseFontSize, cursor: "pointer" }}>
                  {text}
                </MuiLink>
              </Link>
            )
          },
          ol(props) {
            return (
              <Box component={"ol"} sx={{ pl: 4 }}>
                {props.children}
              </Box>
            )
          },
          li(props) {
            return (
              <Box component={"li"} sx={{ lineHeight: 2 }}>
                {props.children}
              </Box>
            )
          },
        }}
      >
        {props.children}
      </ReactMarkdown>
    </Box>
  )
}
