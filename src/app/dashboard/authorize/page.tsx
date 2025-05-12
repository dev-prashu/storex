"use client";

import React, { useState } from "react";

import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AuthorizeUserTable from "@/components/authorize/AuthorizeUser";
import AddUserDialog from "@/components/authorize/AuthorizeDialog";

function AuthorizePage() {
  const [open, setOpen] = useState<boolean>(false);
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
      <Box display="flex" alignItems="center" pt={2}  gap={1}>
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
          href="/dashboard/authorize"
        >
          Authorized
        </Typography>
      </Box>

      <Divider />

      <Button
        variant="contained"
        startIcon={<ControlPointIcon />}
        sx={{
          color: "white",
          backgroundColor: "black",
          width: "fit-content",
          textTransform: "none",
          borderRadius: 2,
        }}
        onClick={() => {
          setOpen((prev: boolean) => !prev);
        }}
      >
        Add
      </Button>

      <Box>
        <AuthorizeUserTable />
      </Box>
      {open && (
        <AddUserDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={() => {}}
        />
      )}
    </Box>
  );
}

export default AuthorizePage;
