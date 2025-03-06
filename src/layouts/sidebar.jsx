import React, { useState } from "react";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

import {
  SettingsRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  AvTimerRounded,
  CloseRounded,
} from "@mui/icons-material";

import { MAIN_SIDEBAR_ITEMS } from "../utils/constants";
import { usePathname } from "../hooks/usePathname";
import {
  AccountsIcon,
  FeesManagementIcon,
  ReportCardModuleIcon,
  StudentsManagementIcon,
} from "../theme/overrides/CustomIcons";
import useLayout from "../hooks/uesLayout";
import Saifee_Logo from "../assets/logos/Saifee_Logo.png";

const getIcon = (iconName) => {
  switch (iconName) {
    case "dashboard":
      return <AvTimerRounded />;
    case "student_management":
      return <StudentsManagementIcon />;
    case "fee_management":
      return <FeesManagementIcon />;
    case "report_card_module":
      return <ReportCardModuleIcon />;
    case "accounts":
      return <AccountsIcon />;
    case "settings":
      return <SettingsRounded />;
    default:
      return null;
  }
};

const Sidebar = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const { layout, handleDrawerClose } = useLayout();

  const [openItems, setOpenItems] = useState({});

  // Toggle open state for collapsible items

  const [isImageError, setIsImageError] = useState(false);
  const handleImageError = () => {
    setIsImageError(true);
  };

  const handleToggle = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <>
        {layout?.isLessThanMedium && (
          <Box
            sx={{
              p: "10px",
              bgcolor: "primary.light",
              color: "primary.main",
              height: layout?.headerHeight,
              width: layout?.sidebarWidth,
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

            <IconButton
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.mainHover",
                  color: "primary.contrastText",
                },
              }}
              onClick={handleDrawerClose}
            >
              <CloseRounded />
            </IconButton>
          </Box>
        )}
        {MAIN_SIDEBAR_ITEMS.map((item) => {
          const isActive = item?.linkName === pathname;

          return (
            <React.Fragment key={item?._id}>
              <Box
                component={item?.linkName ? NavLink : "div"}
                to={item?.linkName || ""}
                sx={{
                  minHeight: "55px",
                  display: "flex",
                  alignItems: item?.children ? "start" : "center",
                  gap: 1,
                  p: 1.2,
                  borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "primary.contrastText",
                  bgcolor: isActive ? "primary.mainActive" : "transparent",
                  "&:hover": {
                    bgcolor: "primary.mainHover",
                  },
                }}
              >
                {/* Icon */}
                <IconButton
                  sx={{
                    mt: item?.children ? 0.2 : 0,
                    "& > svg": {
                      fontSize: "20px",
                    },
                  }}
                >
                  {getIcon(item?.iconName)}
                </IconButton>

                {/* Text and Children */}
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  {item?.children ? (
                    <>
                      <Box
                        onClick={() => handleToggle(item?._id)}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          mt: 0.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: isActive ? 800 : 400 }}>
                          {item?.displayName}
                        </Typography>
                        {openItems[item?._id] ? (
                          <ExpandLessRounded sx={{ fontSize: "20px" }} />
                        ) : (
                          <ExpandMoreRounded sx={{ fontSize: "20px" }} />
                        )}
                      </Box>

                      {/* Collapsible Children */}
                      <Collapse
                        in={openItems[item?._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding sx={{ mt: 1 }}>
                          {item?.children?.map((child) => (
                            <ListItemButton
                              key={child?._id}
                              component={NavLink}
                              to={child?.linkName}
                              sx={{
                                px: 0,
                                py: 0.4,
                                color: "primary.contrastText",
                                "&:hover": {
                                  bgcolor: "primary.mainHover",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color: "primary.contrastText",
                                  p: 0,
                                  mr: 1,
                                }}
                              >
                                •
                              </ListItemIcon>
                              <ListItemText
                                primary={child?.displayName}
                                slotProps={{
                                  primary: {
                                    typography: {
                                      fontSize: 12,
                                    },
                                  },
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <Typography sx={{ fontWeight: isActive ? 800 : 400 }}>
                      {item?.displayName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </React.Fragment>
          );
        })}
      </>
    </Box>
  );
};

export default Sidebar;
