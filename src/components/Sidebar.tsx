'use client'
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
const drawerWidth = 240;
const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          StoreX
        </Typography>
      </Toolbar>
      <List>
        {["Dashboard", "Assets", "Employee", "Settings"].map((text, index) => {
          const icons = [
            <DashboardIcon key="dashboard" />,
            <InventoryIcon key="assets" />,
            <PeopleIcon key="employee" />,
            <SettingsIcon key="settings" />,
          ];
          return (
            <ListItem component="button" key={text}>
              <ListItemIcon>{icons[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
export default Sidebar;
