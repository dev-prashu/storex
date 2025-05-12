"use client";
import React from "react";
import {
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  ListItem,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const drawerWidth = 340;

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Assets", icon: <InventoryIcon />, path: "/dashboard/assets" },
    { text: "Employees", icon: <PeopleIcon />, path: "/dashboard/employees" },
    {
      text: "Authorize Users",
      icon: <VerifiedUserIcon />,
      path: "/dashboard/authorize",
    },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "5px",
        },
      }}
    >
      <Box>
        <Toolbar sx={{ gap: 2, padding: 2, margin: 0 }}>
          <Image src="/logo.png" alt="logo" width={30} height={30}></Image>
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap>
              StoreX
            </Typography>
            <Typography variant="body2" color="grey">
              A RemoteState Product
            </Typography>
          </Box>
        </Toolbar>

        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} href={path}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Button
        variant="outlined"
        color="error"
        onClick={() => signOut({ redirectTo: "/login" })}
      >
        Logout
      </Button>
    </Drawer>
  );
};

export default Sidebar;
