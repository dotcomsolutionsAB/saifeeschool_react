import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const calculateLayout = (width) => {
    const isExtraSmall = width < 600;
    const isLessThanMedium = width < 900;

    if (isLessThanMedium) {
      handleDrawerClose();
    }

    return {
      headerHeight: "64px",
      sidebarWidth: "280px",
      px: isExtraSmall || isLessThanMedium ? "10px" : "20px",
      isLessThanMedium,
    };
  };

  const [layout, setLayout] = useState(() =>
    calculateLayout(window.innerWidth)
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setLayout(calculateLayout(width));
    });

    resizeObserver.observe(document.documentElement);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <LayoutContext.Provider
      value={{ layout, drawerOpen, handleDrawerOpen, handleDrawerClose }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.node,
};

export { LayoutContext };
export default LayoutProvider;
