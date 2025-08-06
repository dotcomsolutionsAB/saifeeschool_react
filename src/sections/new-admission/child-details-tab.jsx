import PropTypes from "prop-types";
import {
  Autocomplete,
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
import dayjs from "dayjs";
import { memo } from "react";

const ChildDetailsTab = ({ props }) => {
  const { formData, setAttachments, handleChange, attachments } = props;

  return (
    <Box>
      <Grid container spacing={4}>
        {/* First Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="first_name"
            label="First Name"
            required
            fullWidth
            value={formData?.first_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="last_name"
            label="Last Name"
            required
            fullWidth
            value={formData?.last_name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormLabel component="legend" required>
            Gender
          </FormLabel>
          <RadioGroup
            row
            name="gender"
            value={formData?.gender || ""}
            onChange={handleChange}
          >
            <FormControlLabel value="m" control={<Radio />} label="Male" />
            <FormControlLabel value="f" control={<Radio />} label="Female" />
          </RadioGroup>
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DatePicker
            name="dob"
            label="Date of Birth"
            value={formData?.dob || null}
            onChange={(newValue) =>
              handleChange({
                target: { name: "dob", value: newValue },
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
            name="aadhaar"
            value={formData?.aadhaar || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Residential Address 1 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="address_1"
            label="Residential Address 1"
            fullWidth
            required
            value={formData?.address_1 || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Residential Address 2 */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="address_2"
            label="Residential Address 2"
            fullWidth
            value={formData?.address_2 || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="city"
            label="City"
            fullWidth
            required
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
            required
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
            required
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
            required
            value={formData?.pincode || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Last School */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="last_school"
            label="Previous School"
            fullWidth
            value={formData?.last_school || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Second Language only for above Nursery and LKG*/}
        {formData?.class?.cg_id !== "nursery" &&
          formData?.class?.cg_id !== "lkg" && (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={["Hindi", "Urdu", "Bengali"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Second Language"
                    fullWidth
                    required
                  />
                )}
                value={formData?.second_language || ""}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "second_language", value: newValue },
                  })
                }
              />
            </Grid>
          )}

        {/* Attachments */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <AttachmentsTab
                setAttachments={setAttachments}
                attachments={attachments}
                title="Child's Photo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AttachmentsTab
                setAttachments={setAttachments}
                attachments={attachments}
                title="Father's Photo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AttachmentsTab
                setAttachments={setAttachments}
                attachments={attachments}
                title="Mother's Photo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AttachmentsTab
                setAttachments={setAttachments}
                attachments={attachments}
                title="Family Photo"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AttachmentsTab
                setAttachments={setAttachments}
                attachments={attachments}
                title="Birth Certificate"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

ChildDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  setAttachments: PropTypes.func,
  attachments: PropTypes.object,
  handleChange: PropTypes.func,
  classList: PropTypes.any,
};

export default memo(ChildDetailsTab);
