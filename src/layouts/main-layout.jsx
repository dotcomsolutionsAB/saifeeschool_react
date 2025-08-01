import { Link, Outlet } from "react-router-dom";
import { Box, Breadcrumbs, Drawer, Typography, useTheme } from "@mui/material";

import Header from "./header";
import Sidebar from "./sidebar";
import useLayout from "../hooks/uesLayout";
import { usePathname } from "../hooks/usePathname";
import { CAPITALIZE, ADMIN_SIDEBAR_ITEMS } from "../utils/constants";
import { useEffect } from "react";
import LoginBackground from "../assets/images/Login_Background.jpeg";

const MainLayout = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const pathSegments = pathname?.split("/")?.filter((path) => path);
  const { layout, drawerOpen, handleDrawerClose } = useLayout();
  const screenHeight = "100svh";
  const screenWidth = "100vw";

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose();
    }
  }, [pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: screenHeight,
        width: screenWidth,
        overflow: "hidden",
      }}
    >
      {/* ----------------------Header-------------------------- */}
      <Box
        sx={{
          width: "100%",
          height: layout?.headerHeight,
        }}
      >
        <Header />
      </Box>

      {/* -------------------------Main------------------------------ */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          height: `calc(100% - ${layout?.headerHeight})`,
          display: "flex",
          bgcolor: "custom.body_color",
          ...(pathname === "/change-password"
            ? {
                background: `url(${LoginBackground}) no-repeat center center`,
                backgroundSize: "cover",
              }
            : null),
        }}
      >
        {/* sidebar */}
        {layout?.isLessThanMedium ? (
          <Drawer
            role="presentation"
            open={drawerOpen}
            onClose={handleDrawerClose}
            PaperProps={{
              sx: {
                width: layout?.sidebarWidth,
                height: "100%",
                bgcolor: "primary.main",
                overflowX: "hidden",
                overflowY: "auto",
                transition: "width 0.5s ease",
                zIndex: 10,
              },
            }}
          >
            <Sidebar />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: layout?.sidebarWidth,
              height: "100%",
              bgcolor: "primary.main",
              overflowX: "hidden",
              overflowY: "auto",
              transition: "width 0.5s ease",
              zIndex: 10,
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* maincontent */}

        <Box
          sx={{
            flex: 1,
            height: "100%",
            width: `calc(100% - ${layout?.sidebarWidth})`,
            position: "relative",
            overflowY: "auto",
            p: 2,
          }}
        >
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                position: "relative",
                mb: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  borderBottom: `3px solid ${theme.palette.error.main}`,
                  width: "50px",
                },
              }}
            >
              {CAPITALIZE(pathSegments[pathSegments?.length - 1] || "Home")}
            </Typography>
          </Box> */}

          <Breadcrumbs
            aria-label="breadcrumb"
            separator={
              <Typography
                sx={{
                  color: pathname === "/change-password" ? "#eee" : "inherit",
                }}
              >
                {">"}
              </Typography> // Change color here
            }
            sx={{ mb: 1 }}
          >
            {pathname !== "/" && (
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: pathname === "/change-password" ? "#eee" : "inherit",
                }}
              >
                Home
              </Link>
            )}
            {pathSegments?.map((segment, index) => {
              const isLast = index === pathSegments?.length - 1;
              const to = `/${pathSegments?.slice(0, index + 1)?.join("/")}`;

              // Function to check if the path corresponds to a leaf node (no children)
              const isLeafNode = (path) =>
                ADMIN_SIDEBAR_ITEMS?.some((item) => {
                  if (item?.linkName === path)
                    return !item.children || item.children.length === 0;
                  if (item.children) {
                    return item.children.some(
                      (child) => child.linkName === path
                    );
                  }
                  return false;
                });

              // Skip the segment if it's not a leaf node and not the last segment
              if (!isLeafNode(to) && !isLast) {
                return null;
              }
              return isLast ? (
                <Typography
                  key={to}
                  color={
                    pathname === "/change-password" ? "white" : "primary.main"
                  }
                >
                  {CAPITALIZE(segment)?.replace(/-/g, " ")}
                </Typography>
              ) : (
                <Link
                  key={to}
                  to={to}
                  style={{
                    textDecoration: "none",
                    color:
                      pathname === "/change-password" ? "white" : "inherit",
                  }}
                >
                  {CAPITALIZE(segment)?.replace(/-/g, " ")}
                </Link>
              );
            })}
          </Breadcrumbs>

          {/* components */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
