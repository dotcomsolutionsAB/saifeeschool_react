export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          field: {
            clearable: true,
          },
        },
      },
    },
  };
}
