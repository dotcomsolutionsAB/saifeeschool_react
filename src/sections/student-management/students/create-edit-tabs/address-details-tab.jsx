import { Box, Grid, TextField } from "@mui/material";

const AddressDetailsTab = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Residential Address 1 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="residential_address1"
            label="Residential Address 1"
            fullWidth
          />
        </Grid>

        {/* Residential Address 2 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="residential_address2"
            label="Residential Address 2"
            fullWidth
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="city" label="City" fullWidth />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="state" label="State" fullWidth />
        </Grid>

        {/* Country */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="country" label="Country" fullWidth />
        </Grid>

        {/* Pincode */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="pincode" label="Pincode" fullWidth />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressDetailsTab;
