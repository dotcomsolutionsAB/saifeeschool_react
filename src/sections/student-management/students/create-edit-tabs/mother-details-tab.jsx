import {
  Box,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useState } from "react";

const MotherDetailsTab = () => {
  const [occupation, setOccupation] = useState("self_employed");

  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
  };
  return (
    <Box>
      <Grid container spacing={4}>
        {/*First Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="m_first_name" label="First Name" fullWidth />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="m_last_name" label="Last Name" fullWidth />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="m_contact" label="Mobile" type="tel" fullWidth />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="m_email" label="Email" type="email" fullWidth />
        </Grid>

        {/* Occupation */}
        <Grid item xs={12} sm={6} md={4}>
          <FormLabel component="legend">Occupied</FormLabel>
          <RadioGroup
            row
            name="m_occupation"
            value={occupation}
            onChange={handleOccupationChange}
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

      {occupation !== "none" && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {occupation === "self_employed" && (
            <>
              {/* Business Name */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_business_name"
                  label="Business Name"
                  fullWidth
                />
              </Grid>

              {/* Business Nature */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="m_business_nature"
                  label="Business Nature"
                  fullWidth
                />
              </Grid>
            </>
          )}

          {occupation === "employed" && (
            <>
              {/* Employer */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField name="m_employer_name" label="Employer" fullWidth />
              </Grid>
              {/* Designation */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField name="m_designation" label="Designation" fullWidth />
              </Grid>{" "}
            </>
          )}

          {/* Address 1 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_adress1" label="Address 1" fullWidth />
          </Grid>

          {/* Address 2 */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_adress2" label="Address 2" fullWidth />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_work_city" label="City" fullWidth />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_work_state" label="State" fullWidth />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_work_country" label="Country" fullWidth />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField name="m_work_pincode" label="Pincode" fullWidth />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MotherDetailsTab;
