export default function Table(theme) {
  return {
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate", // Required for spacing to work
          borderSpacing: "0 4px", // Adds vertical space between rows (4px) and no horizontal space (0)
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // padding: theme.spacing(1.5),
          padding: "0 12px 0 12px",
          height: "34px",
          border: "none",
          "&:first-of-type": {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
          },
          "&:last-of-type": {
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
          },
        },
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.secondary.light,
          "&:first-of-type": {
            paddingLeft: theme.spacing(3),
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            // boxShadow: `inset 8px 0 0 ${theme.palette.background.paper}`,
          },
          "&:last-of-type": {
            paddingRight: theme.spacing(3),
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            // boxShadow: `inset -8px 0 0 ${theme.palette.background.paper}`,
          },
        },
        stickyHeader: {
          backgroundColor: theme.palette.secondary.light,
          // borderBottom: "none",
          fontSize: "12px",
        },
        body: {
          "&:first-of-type": {
            paddingLeft: theme.spacing(3),
          },
          "&:last-of-type": {
            paddingRight: theme.spacing(3),
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: "none",
          fontSize: "12px",
        },
        toolbar: {
          height: "40px",
          fontSize: "12px",
          overflowX: "auto", // Allow horizontal scrolling
          "&::-webkit-scrollbar": {
            height: "6px", // Set the scrollbar height
          },
        },
        select: {
          fontSize: "12px",
          "&:focus": {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: -4,
        },
        displayedRows: {
          fontSize: "12px", // Set text size for displayed rows
        },
        actions: {
          fontSize: "12px", // Set text size for actions
        },
        selectLabel: {
          fontSize: "12px", // Change font size for "Rows per page"
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "12px", // Change text size for dropdown menu items
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: "6px", // For horizontal scrollbar
          },
        },
      },
    },
  };
}
