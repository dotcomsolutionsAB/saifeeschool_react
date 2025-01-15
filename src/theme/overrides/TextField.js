import { pxToRem } from "../../utils/getFontValue";

export default function TextField(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            // padding: theme.spacing(1, 1), // Adjust padding for better alignment
            // borderRadius: theme.shape.borderRadius,
          },
        },

        // outlinedInput: {
        //   borderRadius: theme.shape.borderRadius, // Apply consistent border radius
        //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        //     borderColor: theme.palette.primary.main, // Highlight color when focused
        //   },
        // },
      },
    },
  };
}
