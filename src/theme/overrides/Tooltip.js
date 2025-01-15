export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.secondary.main, // Set tooltip background color
          borderRadius: "5px", // Set border radius
          color: theme.palette.secondary.contrastText, // Adjust text color for contrast
        },
        arrow: {
          color: theme.palette.secondary.main, // Match arrow color with tooltip background
        },
      },
    },
  };
}
