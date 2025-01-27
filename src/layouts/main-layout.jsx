import { Link, Outlet } from "react-router-dom";
import { Box, Breadcrumbs, Typography, useTheme } from "@mui/material";

import Header from "./header";
import Sidebar from "./sidebar";
import useLayout from "../hooks/uesLayout";
import { usePathname } from "../hooks/usePathname";
import { CAPITALIZE, MAIN_SIDEBAR_ITEMS } from "../utils/constants";

const MainLayout = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const pathSegments = pathname?.split("/")?.filter((path) => path);
  const { layout } = useLayout();
  const screenHeight = "100svh";
  const screenWidth = "100vw";

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
        }}
      >
        {/* sidebar */}
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

          <Breadcrumbs aria-label="breadcrumb" separator=">" sx={{ mb: 1 }}>
            {pathname !== "/" && (
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Home
              </Link>
            )}
            {pathSegments?.map((segment, index) => {
              const isLast = index === pathSegments?.length - 1;
              const to = `/${pathSegments?.slice(0, index + 1)?.join("/")}`;

              // Function to check if the path corresponds to a leaf node (no children)
              const isLeafNode = (path) =>
                MAIN_SIDEBAR_ITEMS?.some((item) => {
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
                <Typography key={to} color="primary.main">
                  {CAPITALIZE(segment)?.replace(/-/g, " ")}
                </Typography>
              ) : (
                <Link
                  key={to}
                  to={to}
                  style={{ textDecoration: "none", color: "inherit" }}
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
