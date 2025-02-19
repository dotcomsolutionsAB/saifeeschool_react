export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.primary.main, // Set tooltip background color
          borderRadius: "5px", // Set border radius
          color: theme.palette.primary.contrastText, // Adjust text color for contrast
        },
        arrow: {
          color: theme.palette.primary.main, // Match arrow color with tooltip background
        },
      },
    },
  };
}
