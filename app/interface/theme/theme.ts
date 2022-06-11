import { createTheme } from "@mui/material"
import { blue, green } from "@mui/material/colors"

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "rgb(10, 25, 41)",
      paper: "rgb(0, 30, 60)",
    },
    // mode: "dark",
    primary: {
      main: blue[200],
    },
    secondary: {
      main: green[700],
    },
    divider: "rgba(255, 255, 255, 0.23)",
  },
  typography: {
    fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          paddingTop: "0.5px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
})
