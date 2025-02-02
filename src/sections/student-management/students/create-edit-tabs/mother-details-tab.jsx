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

const MotherDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;
  return (
    <Box>
      <Grid container spacing={4}>
        {/*First Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="m_first_name"
            label="First Name"
            fullWidth
            value={formData?.m_first_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="m_last_name"
            label="Last Name"
            fullWidth
            value={formData?.m_last_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="m_contact"
            label="Mobile"
            type="tel"
            fullWidth
            value={formData?.m_contact || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="m_email"
            label="Email"
            type="email"
            fullWidth
            value={formData?.m_email || ""}
            onChange={handleChange}
          />
        </Grid>

        {/*Mother's Occupation */}
        <Grid item xs={12} sm={6} md={4}>
          <FormLabel component="legend">Occupation</FormLabel>
          <RadioGroup
            row
            name="m_occupation"
            value={formData?.m_occupation}
            onChange={handleChange}
          >
            <FormControlLabel
              value="self_employed"
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

      {formData?.m_occupation !== "none" && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {formData?.m_occupation === "self_employed" && (
            <>
              {/* Business Name */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_business_name"
                  label="Business Name"
                  fullWidth
                  value={formData?.m_business_name || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Business Nature */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_business_nature"
                  label="Business Nature"
                  fullWidth
                  value={formData?.m_business_nature || ""}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {formData?.m_occupation === "employed" && (
            <>
              {/* Employer */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_employer_name"
                  label="Employer"
                  fullWidth
                  value={formData?.m_employer_name || ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* Designation */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_designation"
                  label="Designation"
                  fullWidth
                  value={formData?.m_designation || ""}
                  onChange={handleChange}
                />
              </Grid>{" "}
            </>
          )}

          {/* Address 1 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_address1"
              label="Address 1"
              fullWidth
              value={formData?.m_work_address1 || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Address 2 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_address2"
              label="Address 2"
              fullWidth
              value={formData?.m_work_address2 || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_city"
              label="City"
              fullWidth
              value={formData?.m_work_city || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_state"
              label="State"
              fullWidth
              value={formData?.m_work_state || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_country"
              label="Country"
              fullWidth
              value={formData?.m_work_country || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="m_work_pincode"
              label="Pincode"
              fullWidth
              value={formData?.m_work_pincode || ""}
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

export default MotherDetailsTab;
