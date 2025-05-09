'use client'

import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      {children}
    </Box>
  );
}

export default DashboardLayout;
