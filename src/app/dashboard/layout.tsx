import SidebarLayout from "@/components/Sidebar-Layout";
import React, { ReactNode } from "react";
import { Box } from "@mui/material";

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarLayout />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
