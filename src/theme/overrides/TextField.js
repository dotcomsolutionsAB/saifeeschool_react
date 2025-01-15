import { pxToRem } from "../../utils/getFontValue";

export default function TextField(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            fontSize: pxToRem(12), // Ensure input text uses the same font size
            padding: theme.spacing(0, 1), // Adjust padding for better alignment
            height: "30px",
            borderRadius: theme.shape.borderRadius,
          },
        },

        outlinedInput: {
          borderRadius: theme.shape.borderRadius, // Apply consistent border radius
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main, // Highlight color when focused
          },
        },
      },
    },
  };
}
