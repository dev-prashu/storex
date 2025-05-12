import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box className="flex">
      <Sidebar />
      {children}
    </Box>
  );
}

export default DashboardLayout;
