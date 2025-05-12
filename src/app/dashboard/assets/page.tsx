import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Header from "@/components/assets/Header";

function AssetsPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      p={2}
      component={Paper}
      elevation={0}
      width="100%"
      gap={2}
    >
      <Box display="flex" alignItems="center" pt={2} gap={1}>
        <KeyboardArrowRightIcon sx={{ color: "grey" }} />
        <Typography
          variant="body1"
          color="grey"
          component="a"
          href="/dashboard"
        >
          Dashboard
        </Typography>
        <KeyboardArrowRightIcon sx={{ color: "grey" }} />
        <Typography
          variant="body1"
          color="grey"
          component="a"
          href="/dashboard/assets"
        >
          Assets
        </Typography>
      </Box>

      <Divider />
      <Header/>
    </Box>
  );
}

export default AssetsPage;
