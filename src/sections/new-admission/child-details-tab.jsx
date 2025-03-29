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
import { DatePicker } from "@mui/x-date-pickers";
import AttachmentsTab from "./attachments/attachments-tab";

const ChildDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;
  return (
    <Box>
      <Grid container spacing={4}>
        {/* First Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="st_first_name"
            label="First Name"
            required
            fullWidth
            value={formData?.st_first_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="st_last_name"
            label="Last Name"
            required
            fullWidth
            value={formData?.st_last_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            name="st_gender"
            value={formData?.st_gender || ""}
            onChange={handleChange}
          >
            <FormControlLabel value="M" control={<Radio />} label="Male" />
            <FormControlLabel value="F" control={<Radio />} label="Female" />
          </RadioGroup>
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DatePicker
            name="st_dob"
            label="Date of Birth"
            value={formData?.st_dob || null}
            onChange={(newValue) =>
              handleChange({
                target: { name: "st_dob", value: newValue },
              })
            }
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
              },
            }}
            disableFuture
          />
        </Grid>

        {/* Roll No */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            label="Aadhaar No"
            placeholder="Leave empty if does not exist"
            name="st_aadhaar_no"
            value={formData?.st_aadhaar_no || ""}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>

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
        <Grid item xs={12} sm={6}>
          <AttachmentsTab detail={formData} title="Child's Photo" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AttachmentsTab detail={formData} title="Father's Photo" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AttachmentsTab detail={formData} title="Mother's Photo" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AttachmentsTab detail={formData} title="Birth Certificate" />
        </Grid>
      </Grid>
    </Box>
  );
};

ChildDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
};

export default ChildDetailsTab;
