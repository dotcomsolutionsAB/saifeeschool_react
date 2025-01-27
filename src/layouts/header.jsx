import {
  AppBar,
  Box,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  Typography,
  MenuItem,
  Popover,
} from "@mui/material";
import useLayout from "../hooks/uesLayout";
import useAuth from "../hooks/useAuth";
import {
  ArrowDropDownRounded,
  HomeRounded,
  SearchRounded,
  SettingsRounded,
  SortRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";
import { useState } from "react";
import Saifee_Logo from "../assets/logos/Saifee_Logo.png";
import Input from "@mui/material/Input";
import { MAIN_SIDEBAR_ITEMS } from "../utils/constants";
import { usePathname } from "../hooks/usePathname";

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: <HomeRounded />,
  },
  {
    label: "Profile",
    icon: <VerifiedUserRounded />,
  },
  // {
  //   label: "Settings",
  //   icon: <SettingsRounded />,
  // },
];

const Header = () => {
  const pathname = usePathname();
  const { userInfo, logout } = useAuth();
  const { layout } = useLayout();

  const [isImageError, setIsImageError] = useState(false);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      elevation={10}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor:
          pathname === MAIN_SIDEBAR_ITEMS[0]?.linkName
            ? "custom.body_color"
            : "common.white",
        color: "primary.main",
        zIndex: 10,
        height: layout?.headerHeight,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: "10px",
            bgcolor: "primary.light",
            color: "primary.main",
            minWidth: layout?.sidebarWidth,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* SAIFEE Logo */}
          <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
            {!isImageError ? (
              <Box
                component="img"
                src={Saifee_Logo}
                alt="SAIFEE Logo"
                sx={{
                  width: "70px",
                  height: "80%",
                  objectFit: "contain",
                }}
                loading="lazy"
                onError={handleImageError} // Handles error state
              />
            ) : (
              <Typography variant="h4">SAIFEE</Typography> // fallback text
            )}
          </Box>

          <IconButton>
            <SortRounded />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
            px: 2,
          }}
        >
          {/* SAIFEE Logo */}
          <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
            {pathname === MAIN_SIDEBAR_ITEMS[0]?.linkName ? (
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchRounded sx={{ color: "text.disabled" }} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            ) : (
              <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                SAIFEE GOLDEN JUBILEE PUBLIC SCHOOL
              </Typography>
            )}
          </Box>

          {/* User Profile Avatar */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <Divider
              orientation="vertical"
              sx={{
                width: "3px",
                height: "35%",
                bgcolor: "error.main",
                mr: 1,
              }}
            />
            <Avatar
              variant="circle"
              src={userInfo?.avatarUrl || ""}
              sx={{ width: "43px", height: "43px" }}
            />
            <ArrowDropDownRounded sx={{ color: "black" }} />
          </Box>

          {/* Popover */}
          <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  p: 0,
                  mt: 1,
                  ml: 0.75,
                  width: 200,
                },
              },
            }}
          >
            <Box sx={{ my: 1, px: 2 }}>
              <Typography variant="subtitle2" noWrap>
                {userInfo?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {`${userInfo?.role
                  ?.charAt(0)
                  .toUpperCase()}${userInfo?.role?.slice(
                  1,
                  userInfo?.role?.length
                )}`}
              </Typography>
              <Typography sx={{ fontSize: "12px" }}>
                {userInfo?.ay_id}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            {MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                onClick={handleClose}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <IconButton
                  sx={{
                    "& > svg": {
                      fontSize: "18px",
                    },
                  }}
                >
                  {option?.icon}
                </IconButton>
                {option.label}
              </MenuItem>
            ))}

            <Divider
              sx={{
                borderStyle: "dashed",
                "&.MuiDivider-root": {
                  m: 0,
                },
              }}
            />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1,
                color: "error.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Logout
            </MenuItem>
          </Popover>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
