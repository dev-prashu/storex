"use client";
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

function Header() {
  return (
    <Box
      display="flex"
      gap={2}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box display="flex" gap={2}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Button
          variant="contained"
          startIcon={<ControlPointIcon />}
          sx={{
            backgroundColor:'inherit',
            color:'black',
            width: "fit-content",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Type
        </Button>
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
        >
          Status{" "}
        </Button>
      </Box>
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
      >
        Add Asset
      </Button>
    </Box>
  );
}

export default Header;
