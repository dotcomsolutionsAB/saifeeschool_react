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

const FatherDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;

  // Determine prefix based on father_occupation
  const prefix =
    formData?.father_occupation?.toLowerCase() === "business"
      ? "father_business_"
      : formData?.father_occupation?.toLowerCase() === "employed"
      ? "father_work_"
      : "father_business_"; // Default to business if occupation is undefined or other
  return (
    <Box>
      <Grid container spacing={4}>
        {/*Father's Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="father_name"
            label="Father's Name"
            fullWidth
            required
            value={formData?.father_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Father's Surname Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="father_surname"
            label="Father's Surname"
            fullWidth
            required
            value={formData?.father_surname || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="father_mobile"
            label="Mobile"
            type="tel"
            fullWidth
            required
            value={formData?.father_mobile || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="father_email"
            label="Email"
            type="email"
            fullWidth
            required
            value={formData?.father_email || ""}
            onChange={handleChange}
          />
        </Grid>

        {/*Father's Occupation */}
        <Grid item xs={12} md={6}>
          <FormLabel component="legend">Occupation</FormLabel>
          <RadioGroup
            row
            name="father_occupation"
            value={formData?.father_occupation}
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
              value="no-occupation"
              control={<Radio />}
              label="None"
            />
          </RadioGroup>
        </Grid>
      </Grid>

      {formData?.father_occupation !== "no-occupation" && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {formData?.father_occupation === "business" && (
            <>
              {/* Business Name */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="father_business_name"
                  label="Business Name"
                  fullWidth
                  required
                  value={formData?.father_business_name || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Business Nature */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="father_business_nature"
                  label="Business Nature"
                  fullWidth
                  required
                  value={formData?.father_business_nature || ""}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {formData?.father_occupation === "employed" && (
            <>
              {/* Employer */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="father_employer_name"
                  label="Employer"
                  fullWidth
                  required
                  value={formData?.father_employer_name || ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* Designation */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="father_designation"
                  label="Designation"
                  fullWidth
                  required
                  value={formData?.father_designation || ""}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {/* Monthly Income*/}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="father_monthly_income"
              label="Monthly Income"
              fullWidth
              required
              value={formData?.father_monthly_income || ""}
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

FatherDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};

export default memo(FatherDetailsTab);
