import {
  Drawer,
  List,
  ListItemText,
  Toolbar,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

import ListItem from "@mui/material/ListItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const drawerWidth = 340;

export default function SidebarLayout() {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Assets", icon: <InventoryIcon />, path: "/dashboard/assets" },
    { text: "Employees", icon: <PeopleIcon />, path: "/dashboard/employees" },
    { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
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
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
