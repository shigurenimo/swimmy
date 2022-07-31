import { Link as MuiLink, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Link from "next/link"
import { FC, ReactNode } from "react"
import ReactMarkdown from "react-markdown"

type Props = {
  children: ReactNode
  fontSize?: number
}

export const BoxMarkdown: FC<Props> = (props) => {
  const baseFontSize = props.fontSize ? props.fontSize : 16

  if (typeof props.children !== "string") {
    return null
  }

  return (
    <Box>
      <ReactMarkdown
        components={{
          h1(props) {
            return (
              <Typography
                component={"h1"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 12,
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
            return (
              <Typography
                component={"h2"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 6,
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
            return (
              <Typography
                component={"h3"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 4,
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
            return (
              <Typography
                component={"h4"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 4,
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
            return (
              <Typography
                component={"h5"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 4,
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
            return (
              <Typography
                component={"h6"}
                sx={{
                  mt: props.node.position?.start.line === 1 ? 0 : 4,
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
            return (
              <Typography
                component={"p"}
                sx={{
                  fontSize: baseFontSize,
                  mt: props.node.position?.start.line === 1 ? 0 : 2,
                }}
              >
                {props.children}
              </Typography>
            )
          },
          code(props) {
            return null
          },
          pre(props) {
            return null
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
        }}
      >
        {props.children}
      </ReactMarkdown>
    </Box>
  )
}
