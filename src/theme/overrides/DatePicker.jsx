export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          field: {
            clearable: true,
            format: "YYYY-MM-DD",
          },
        },
      },
    },
  };
}
