import { pxToRem } from "../../utils/getFontValue";

export default function Autocomplete(theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dropdown,
          marginTop: theme.spacing(1), // Add spacing above dropdown
          maxHeight: 300, // Limit height for scrolling
        },
        listbox: {
          padding: theme.spacing(0, 1), // Remove padding around listbox
          "& .MuiAutocomplete-option": {
            padding: theme.spacing(1, 1.5), // Adjust padding for each option
            margin: theme.spacing(0.2, 0), // Reduce margin between options
            borderRadius: theme.shape.borderRadius, // Keep border-radius for rounded options
            minHeight: "30px", // Ensure a consistent height for options
            fontSize: pxToRem(12),
          },
        },
        root: {
          "& .MuiInputBase-root": {
            padding: theme.spacing(0.5, 1), // Adjust padding inside the input
            height: "30px", // Set consistent height for the input box
            fontSize: pxToRem(12),
            borderRadius: theme.shape.borderRadius,
          },
          "& .MuiOutlinedInput-root": {
            padding: 0, // Ensure no extra padding in the outlined input
          },
          "& .MuiAutocomplete-input": {
            padding: theme.spacing(1), // Add padding for the text input
            lineHeight: "1.5", // Ensure proper line-height for text input
          },
        },
      },
    },
  };
}
