import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import HistoryIcon from '@mui/icons-material/History';
import ApprovalIcon from '@mui/icons-material/Approval';

const drawerWidth = 240;

const getNavLinks = (role) => {
  const commonLinks = [
    { text: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  ];

  const roleLinks = {
    EMPLOYEE: [
      ...commonLinks,
      { text: 'Submit Expense', to: '/submit', icon: <PostAddIcon /> },
      { text: 'Expense History', to: '/history', icon: <HistoryIcon /> },
    ],
    MANAGER: [
      ...commonLinks,
      { text: 'Approve Expenses', to: '/approvals', icon: <ApprovalIcon /> },
    ],
    ADMIN: [
      ...commonLinks,
      { text: 'Approve Expenses', to: '/approvals', icon: <ApprovalIcon /> },
    ],
  };

  return roleLinks[role] || commonLinks;
};

function MainLayout({ role, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = getNavLinks(role);

  const drawerContent = (
    <Box>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navLinks.map((link) => (
            <ListItem button component={NavLink} to={link.to} key={link.text} end onClick={isMobile ? handleDrawerToggle : undefined}>
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Expense Management
          </Typography>
          <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            Role: {role}
          </Typography>
          <Typography
            variant="button"
            onClick={onLogout}
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Logout
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;