import PropTypes from "prop-types";
import {
  Box,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { memo } from "react";

const MotherDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;

  // Determine prefix based on mother_occupation
  const prefix =
    formData?.mother_occupation?.toLowerCase() === "business"
      ? "mother_business_"
      : formData?.mother_occupation?.toLowerCase() === "employed"
      ? "mother_work_"
      : "mother_business_"; // Default to business if occupation is undefined or other
  return (
    <Box>
      <Grid container spacing={4}>
        {/*Mother's Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="mother_first_name"
            label="Mother's Name"
            fullWidth
            required
            value={formData?.mother_first_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Mother's Surname Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="mother_last_name"
            label="Mother's Surname"
            fullWidth
            required
            value={formData?.mother_last_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="mother_mobile"
            label="Mobile"
            type="tel"
            fullWidth
            required
            value={formData?.mother_mobile || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="mother_email"
            label="Email"
            type="email"
            fullWidth
            required
            value={formData?.mother_email || ""}
            onChange={handleChange}
          />
        </Grid>

        {/*Mother's Occupation */}
        <Grid item xs={12} md={6}>
          <FormLabel component="legend">Occupation</FormLabel>
          <RadioGroup
            row
            name="mother_occupation"
            value={formData?.mother_occupation}
            onChange={handleChange}
          >
            <FormControlLabel
              value="business"
              control={<Radio />}
              label="Business"
            />
            <FormControlLabel
              value="employed"
              control={<Radio />}
              label="Employed"
            />
            <FormControlLabel
              value="housewife"
              control={<Radio />}
              label="Housewife"
            />
            <FormControlLabel
              value="not-applicable"
              control={<Radio />}
              label="None"
            />
          </RadioGroup>
        </Grid>
      </Grid>

      {formData?.mother_occupation !== "not-applicable" &&
        formData?.mother_occupation !== "housewife" && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {formData?.mother_occupation === "business" && (
              <>
                {/* Business Name */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="mother_business_name"
                    label="Business Name"
                    fullWidth
                    required
                    value={formData?.mother_business_name || ""}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Business Nature */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="mother_business_nature"
                    label="Business Nature"
                    fullWidth
                    required
                    value={formData?.mother_business_nature || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {formData?.mother_occupation === "employed" && (
              <>
                {/* Employer */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="mother_employer_name"
                    label="Employer"
                    fullWidth
                    required
                    value={formData?.mother_employer_name || ""}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Designation */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    name="mother_designation"
                    label="Designation"
                    fullWidth
                    required
                    value={formData?.mother_designation || ""}
                    onChange={handleChange}
                  />
                </Grid>{" "}
              </>
            )}

            {/* Monthly Income*/}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name="mother_monthly_income"
                label="Monthly Income"
                fullWidth
                required
                value={formData?.mother_monthly_income || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name={`${prefix}address`}
                label="Address"
                fullWidth
                required
                value={formData?.[`${prefix}address`] || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name={`${prefix}city`}
                label="City"
                fullWidth
                required
                value={formData?.[`${prefix}city`] || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name={`${prefix}state`}
                label="State"
                fullWidth
                required
                value={formData?.[`${prefix}state`] || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name={`${prefix}country`}
                label="Country"
                fullWidth
                required
                value={formData?.[`${prefix}country`] || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Pincode */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name={`${prefix}pincode`}
                label="Pincode"
                fullWidth
                required
                value={formData?.[`${prefix}pincode`] || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
    </Box>
  );
};

MotherDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};

export default memo(MotherDetailsTab);
