import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const calculateLayout = () => {
    const isExtraSmall = window.innerWidth < 600;

    return {
      headerHeight: "64px",
      sidebarWidth: "286px",
      px: isExtraSmall ? "10px" : "20px",
    };
  };

  const [layout, setLayout] = useState(calculateLayout);

  const toggleSidebar = () => {
    setIsSidebarExpanded((preValue) => !preValue);
  };

  useEffect(() => {
    setLayout(calculateLayout());
  }, [isSidebarExpanded]);

  return (
    <LayoutContext.Provider
      value={{ layout, isSidebarExpanded, toggleSidebar }}
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
