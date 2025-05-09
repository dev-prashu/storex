"use client";
import { SessionProvider } from "next-auth/react";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
const theme = createTheme();

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        {children}
        <CssBaseline />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default SessionWrapper;
