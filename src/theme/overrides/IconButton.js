export default function IconButton() {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "5px",
          color: "inherit", // Set default color
          borderRadius: "50%",
          overflow: "hidden", // Prevent ripple overflow
          "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: "50%",
          },
        },
      },
    },
  };
}
