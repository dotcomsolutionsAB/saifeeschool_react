import PropTypes from "prop-types";
import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { memo } from "react";

const OtherDetailsTab = ({ props }) => {
  const {
    isEdit,
    formData,
    handleChange,
    bloodGroupList = [],
    classList = [],
    academicYearList = [],
  } = props;
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Blood Group */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={bloodGroupList || []}
            renderInput={(params) => (
              <TextField
                {...params}
                name="st_blood_group"
                label="Blood Group"
                fullWidth
                required
              />
            )}
            value={formData?.st_blood_group || ""}
            onChange={(_, newValue) =>
              handleChange({
                target: { name: "st_blood_group", value: newValue },
              })
            }
          />
        </Grid>

        {/* Aadhaar No */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="aadhaar_no"
            label="Aadhaar No"
            fullWidth
            required
            value={formData?.aadhaar_no || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Date of Admission */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DatePicker
            label="Date of Admission"
            slotProps={{
              textField: {
                name: "st_year_of_admission",
                fullWidth: true,
                required: true,
              },
            }}
            value={formData?.st_year_of_admission || null}
            onChange={(newValue) =>
              handleChange({
                target: { name: "st_year_of_admission", value: newValue },
              })
            }
          />
        </Grid>

        {!isEdit && (
          <>
            {/* Academic Year */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={academicYearList || []}
                getOptionLabel={(option) => option?.ay_name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Year"
                    fullWidth
                    required
                  />
                )}
                value={formData?.academicYear || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "academicYear", value: newValue },
                  })
                }
              />
            </Grid>

            {/* Class Group */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={classList || []}
                getOptionLabel={(option) => option?.cg_name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class Group"
                    fullWidth
                    required
                  />
                )}
                value={formData?.class_group || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "class_group", value: newValue },
                  })
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

OtherDetailsTab.propTypes = {
  props: PropTypes.object,
  isEdit: PropTypes.bool,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  bloodGroupList: PropTypes.array,
  academicYearList: PropTypes.array,
  classList: PropTypes.array,
};

export default memo(OtherDetailsTab);
