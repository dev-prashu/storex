import { Box, Divider, Paper, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";

function EmployeesPage() {
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
          href="/dashboard/employees"
        >
          Employees
        </Typography>
      </Box>

      <Divider />
    </Box>
  );
}

export default EmployeesPage;
