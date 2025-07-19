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
  return (
    <Box>
      <Grid container spacing={4}>
        {/*Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="f_name"
            label="Name"
            fullWidth
            required
            value={formData?.f_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="f_contact"
            label="Mobile"
            type="tel"
            fullWidth
            required
            value={formData?.f_contact || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="f_email"
            label="Email"
            type="email"
            fullWidth
            required
            value={formData?.f_email || ""}
            onChange={handleChange}
          />
        </Grid>

        {/*Father's Occupation */}
        <Grid item xs={12} sm={6}>
          <FormLabel component="legend" required>
            Occupation
          </FormLabel>
          <RadioGroup
            row
            name="f_occupation"
            value={formData?.f_occupation}
            onChange={handleChange}
          >
            <FormControlLabel
              value="self-employed"
              control={<Radio />}
              label="Self Employed"
            />
            <FormControlLabel
              value="employed"
              control={<Radio />}
              label="Employed"
            />
            <FormControlLabel value="none" control={<Radio />} label="None" />
          </RadioGroup>
        </Grid>
      </Grid>

      {formData?.f_occupation !== "none" && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {formData?.f_occupation === "self-employed" && (
            <>
              {/* Business Name */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_name"
                  label="Business Name"
                  fullWidth
                  required
                  value={formData?.f_business_name || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Business Nature */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_nature"
                  label="Business Nature"
                  fullWidth
                  required
                  value={formData?.f_business_nature || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Address 1 */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_address1"
                  label="Address"
                  fullWidth
                  required
                  value={formData?.f_business_address1 || ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* City */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_city"
                  label="City"
                  fullWidth
                  required
                  value={formData?.f_business_city || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_state"
                  label="State"
                  fullWidth
                  required
                  value={formData?.f_business_state || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_country"
                  label="Country"
                  fullWidth
                  required
                  value={formData?.f_business_country || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Pincode */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_business_pincode"
                  label="Pincode"
                  fullWidth
                  required
                  value={formData?.f_business_pincode || ""}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {formData?.f_occupation === "employed" && (
            <>
              {/* Employer */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_employer_name"
                  label="Employer"
                  fullWidth
                  required
                  value={formData?.f_employer_name || ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* Designation */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_designation"
                  label="Designation"
                  fullWidth
                  required
                  value={formData?.f_designation || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Address 1 */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_work_address1"
                  label="Address"
                  fullWidth
                  required
                  value={formData?.f_work_address1 || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_work_city"
                  label="City"
                  fullWidth
                  required
                  value={formData?.f_work_city || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_work_state"
                  label="State"
                  fullWidth
                  required
                  value={formData?.f_work_state || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Country */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_work_country"
                  label="Country"
                  fullWidth
                  required
                  value={formData?.f_work_country || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Pincode */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="f_work_pincode"
                  label="Pincode"
                  fullWidth
                  required
                  value={formData?.f_work_pincode || ""}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}
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
