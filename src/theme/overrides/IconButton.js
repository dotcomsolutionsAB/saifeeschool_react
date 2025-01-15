export default function IconButton(theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0.5,
          color: "inherit", // Set default color
          borderRadius: theme.shape.borderRadius, // Ensure square corners for all IconButtons
          overflow: "hidden", // Prevent ripple overflow
          "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: theme.shape.borderRadius, // Square ripple effect
          },
        },
      },
    },
  };
}
