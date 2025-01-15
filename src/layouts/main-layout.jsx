import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./header";
import Sidebar from "./sidebar";
import useLayout from "../hooks/uesLayout";

const MainLayout = () => {
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
            p: 2,
          }}
        >
          {/* components */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
