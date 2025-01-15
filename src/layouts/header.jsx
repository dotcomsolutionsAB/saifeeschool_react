import {
  AppBar,
  Box,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import useLayout from "../hooks/uesLayout";
import useAuth from "../hooks/useAuth";
import {
  ArrowDropDownRounded,
  SearchRounded,
  SortRounded,
} from "@mui/icons-material";
import { useState } from "react";
import Saifee_Logo from "../assets/logos/Saifee_Logo.png";

const Header = () => {
  const { userInfo } = useAuth();
  const { layout } = useLayout();

  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };

  return (
    <AppBar
      elevation={10}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "custom.body_color",
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
        }}
      >
        <Box
          sx={{
            p: "10px",
            bgcolor: "primary.light",
            color: "primary.main",
            width: layout?.sidebarWidth,
            height: layout?.headerHeight,
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
            <TextField
              placeholder="Search"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchRounded />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* User Profile Avatar */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Divider
              orientation="vertical"
              sx={{ width: "3px", height: "40%", bgcolor: "#D60A0B", mr: 1 }}
            />
            <Avatar
              variant="circle"
              src={userInfo?.avatarUrl || ""}
              sx={{ width: "43px", height: "43px" }}
            />
            <ArrowDropDownRounded sx={{ color: "black" }} />
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
