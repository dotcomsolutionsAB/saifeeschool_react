import {
  Autocomplete,
  Card,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import PropTypes from "prop-types";
import { useState } from "react";
import OtherDetailsTab from "./create-edit-tabs/other-details-tab";
import AddressDetailsTab from "./create-edit-tabs/address-details-tab";
import FatherDetailsTab from "./create-edit-tabs/father-details-tab";
import MotherDetailsTab from "./create-edit-tabs/mother-details-tab";
import { useGetApi } from "../../../hooks/useGetApi";
import { getHouse } from "../../../services/students-management.service";

const CreateEditStudent = ({ isEdit = false }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const { dataList: houseList } = useGetApi({
    apiFunction: getHouse,
  });

  return (
    <Card sx={{ p: 2 }}>
      <Typography>Add Student</Typography>
      <Divider sx={{ mt: 1, mb: 2, bgcolor: "primary.main" }} />

      <Grid container spacing={4}>
        {/* First Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="st_first_name"
            label="First Name"
            required
            fullWidth
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="st_last_name" label="Last Name" required fullWidth />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup row name="st_gender" defaultValue="male">
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DatePicker
            name="st_dob"
            label="Date of Birth"
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
          <TextField name="st_roll_no" label="Roll No" required fullWidth />
        </Grid>

        {/* External (Yes/No) */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormLabel component="legend">External</FormLabel>
          <RadioGroup row name="st_external" defaultValue="no">
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="st_mobile"
            label="Mobile"
            type="tel"
            required
            fullWidth
          />
        </Grid>

        {/* Bohra (Yes/No) */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormLabel component="legend">Bohra</FormLabel>
          <RadioGroup row name="st_bohra" defaultValue="no">
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            name="st_email"
            label="Email"
            type="email"
            required
            fullWidth
          />
        </Grid>

        {/* House */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={houseList}
            renderInput={(params) => (
              <TextField
                {...params}
                name="st_house"
                label="House"
                required
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mt: 4 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Other Details" />
        <Tab label="Address" />
        <Tab label="Father Details" />
        <Tab label="Mother Details" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {/* Tab Content */}
      {activeTab === 0 && <OtherDetailsTab />}
      {activeTab === 1 && <AddressDetailsTab />}
      {activeTab === 2 && <FatherDetailsTab />}
      {activeTab === 3 && <MotherDetailsTab />}
    </Card>
  );
};

CreateEditStudent.propTypes = {
  isEdit: PropTypes.bool,
};

export default CreateEditStudent;
