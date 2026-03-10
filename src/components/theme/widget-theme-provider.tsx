"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import StyledJsxRegistry from "./registry";

function WidgetThemeProvider(props: PropsWithChildren) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#859a70",
            light: "#a3b392",
            dark: "#5e6e4e",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#d5c097",
            light: "#e0d1b2",
            dark: "#b8a070",
            contrastText: "#000000",
          },
          background: {
            default: "#f3ebdb",
            paper: "#ffffff",
          },
          text: {
            primary: "#000000",
            secondary: "#5e6e4e",
          },
        },
      }),
    []
  );

  return (
    <StyledJsxRegistry>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </StyledJsxRegistry>
  );
}

export default WidgetThemeProvider;
