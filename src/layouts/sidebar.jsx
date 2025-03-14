import { useState } from "react";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
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
  const {
    layout,
    handleDrawerClose,
    isSidebarExpanded,
    openItems,
    setOpenItems,
  } = useLayout();
  const [isImageError, setIsImageError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuOpen = (event, item) => {
    if (!item?.children) return;
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  const handleToggle = (item) => {
    if (!item?.children || !isSidebarExpanded) return;
    setOpenItems((prev) => ({ ...prev, [item?._id]: !prev[item?._id] }));
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
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
                onError={handleImageError}
              />
            ) : (
              <Typography variant="h4">SAIFEE</Typography>
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
        const isActive =
          item?.linkName === pathname ||
          item?.children?.some((child) => pathname.startsWith(child?.linkName));

        return (
          <Box
            key={item?._id}
            component={item?.linkName ? NavLink : "div"}
            to={item?.linkName || ""}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: isSidebarExpanded ? "left" : "center",
              px: isSidebarExpanded ? layout?.px : 0,
              width: "100%",
              minHeight: "50px",
              borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
              cursor: "pointer",
              textDecoration: "none",
              color: "primary.contrastText",
              bgcolor: isActive ? "primary.mainActive" : "transparent",
              "&:hover": {
                bgcolor: "primary.mainHover",
              },
            }}
            onClick={() => handleToggle(item)}
          >
            {/* Icon Container */}
            <Tooltip
              title={!isSidebarExpanded ? item?.displayName : ""}
              placement="right"
            >
              <Box
                sx={{
                  width: "40px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={(e) => handleMenuOpen(e, item)}
              >
                <IconButton
                  sx={{
                    p: 0.4,
                    color: "inherit",
                    "& > svg": { fontSize: "23px" },
                  }}
                >
                  {getIcon(item?.iconName)}
                </IconButton>
              </Box>
            </Tooltip>

            {/* Text Container */}
            <Box
              sx={{
                flex: 1,
                maxWidth: isSidebarExpanded ? "200px" : 0,
                opacity: isSidebarExpanded ? 1 : 0,
                transition: "max-width 0.5s ease, opacity 0.5s ease",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "flex",
                flexDirection: "column",
                mt: 1.7,
              }}
            >
              {item?.children ? (
                <>
                  {/* Display Name and Expand/Collapse Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "15px",
                      }}
                    >
                      {item?.displayName}
                    </Typography>
                    {openItems[item?._id] ? (
                      <ExpandLessRounded sx={{ fontSize: "20px" }} />
                    ) : (
                      <ExpandMoreRounded sx={{ fontSize: "20px" }} />
                    )}
                  </Box>
                  {/* Sub-items */}
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
                                  whiteSpace: "nowrap",
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
                <Typography
                  sx={{ fontWeight: isActive ? 600 : 400, fontSize: "15px" }}
                >
                  {item?.displayName}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: 58,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 1,
            },
          },
          onMouseEnter: (e) => e.stopPropagation(), // Prevents accidental closure
          onMouseLeave: handleMenuClose, // Closes when the user leaves the menu
        }}
      >
        {selectedItem?.children?.map((child) => (
          <MenuItem
            key={child?._id}
            component={NavLink}
            to={child?.linkName}
            sx={{
              px: 1,
              py: 0.4,
              mt: 0.2,
              fontSize: "14px",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.mainHover",
              },
            }}
            onClick={() => handleMenuClose()}
          >
            {child?.displayName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Sidebar;
