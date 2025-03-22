import PropTypes from "prop-types";
import { Box, Grid, TextField } from "@mui/material";

const AddressDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Residential Address 1 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="residential_address1"
            label="Residential Address 1"
            fullWidth
            value={formData?.residential_address1 || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Residential Address 2 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="residential_address2"
            label="Residential Address 2"
            fullWidth
            value={formData?.residential_address2 || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="city"
            label="City"
            fullWidth
            value={formData?.city || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="state"
            label="State"
            fullWidth
            value={formData?.state || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="country"
            label="Country"
            fullWidth
            value={formData?.country || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Pincode */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="pincode"
            label="Pincode"
            fullWidth
            value={formData?.pincode || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

AddressDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};

export default AddressDetailsTab;
