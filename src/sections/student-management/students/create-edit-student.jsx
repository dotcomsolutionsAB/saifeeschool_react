import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
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
import {
  createStudent,
  getAllAcademicYears,
  getAllClasses,
  getBloodGroups,
  getHouse,
} from "../../../services/students-management.service";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const CreateEditStudent = ({ isEdit = false }) => {
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const detail = location?.state;
  console.log(detail, "detail in edit student");

  const initialState = {
    st_first_name: detail?.st_first_name || "",
    st_last_name: detail?.st_last_name || "",
    st_gender: detail?.st_gender || "M",
    st_dob: null,
    st_roll_no: detail?.st_roll_no || "",
    st_external: detail?.st_external || "0",
    st_mobile: detail?.st_mobile || "",
    st_bohra: detail?.st_bohra ?? 0,
    st_its_id: detail?.st_its_id || "",
    st_gmail_address: detail?.st_gmail_address || "",
    st_house: detail?.st_house || "",
    st_blood_group: detail?.st_blood_group || "",
    aadhaar_no: detail?.aadhaar_no || "",
    st_year_of_admission: null,
    academicYear: null,
    class_group: null,
    residential_address1: detail?.residential_address1 || "",
    residential_address2: detail?.residential_address2 || "",
    city: detail?.city || "",
    state: detail?.state || "",
    country: detail?.country || "",
    pincode: detail?.pincode || "",
    f_first_name: detail?.f_first_name || "",
    f_last_name: detail?.f_last_name || "",
    f_contact: detail?.f_contact || "",
    f_email: detail?.f_email || "",
    f_occupation: detail?.f_occupation || "self_employed",
    f_business_name: detail?.f_business_name || "",
    f_business_nature: detail?.f_business_nature || "",
    f_employer_name: detail?.f_employer_name || "",
    f_designation: detail?.f_designation || "",
    f_work_address1: detail?.f_work_address1 || "",
    f_work_address2: detail?.f_work_address2 || "",
    f_work_city: detail?.f_work_city || "",
    f_work_state: detail?.f_work_state || "",
    f_work_country: detail?.f_work_country || "",
    f_work_pincode: detail?.f_work_pincode || "",
    m_first_name: detail?.m_first_name || "",
    m_last_name: detail?.m_last_name || "",
    m_contact: detail?.m_contact || "",
    m_email: detail?.m_email || "",
    m_occupation: detail?.m_occupation || "self_employed",
    m_business_name: detail?.m_business_name || "",
    m_business_nature: detail?.m_business_nature || "",
    m_employer_name: detail?.m_employer_name || "",
    m_designation: detail?.m_designation || "",
    m_work_address1: detail?.m_work_address1 || "",
    m_work_address2: detail?.m_work_address2 || "",
    m_work_city: detail?.m_work_city || "",
    m_work_state: detail?.m_work_state || "",
    m_work_country: detail?.m_work_country || "",
    m_work_pincode: detail?.m_work_pincode || "",
  };

  const [formData, setFormData] = useState(initialState);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // api to get bloodGroupList
  const { dataList: bloodGroupList } = useGetApi({
    apiFunction: getBloodGroups,
  });

  // api to get classList
  const { dataList: classList } = useGetApi({
    apiFunction: getAllClasses,
    body: {
      ay_id: formData?.academicYear?.id || userInfo?.ay_id,
    },
    dependencies: [formData?.academicYear],
  });

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  // api to get houseList
  const { dataList: houseList } = useGetApi({
    apiFunction: getHouse,
  });

  // tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e, "event");
    setFormData((preValue) => ({
      ...preValue,
      [name]: name === "st_bohra" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formData");
    setIsLoading(true);
    const response = await createStudent(formData);
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Student Creation Successful");
      setFormData(initialState);
      navigate(-1);
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const props = {
    formData,
    handleChange,
    bloodGroupList,
    classList,
    academicYearList,
  };

  return (
    <Card sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>{isEdit ? `Edit Student` : `Add Student`}</Typography>
        <Button
          type="submit"
          variant="contained"
          form="student-form"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : `Save`}
        </Button>
      </Box>
      <Divider sx={{ mt: 1, mb: 2, bgcolor: "primary.main" }} />
      <Box component="form" onSubmit={handleSubmit} id="student-form">
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
                handleChange({ target: { name: "st_dob", value: newValue } })
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
              name="st_roll_no"
              label="Roll No"
              required
              fullWidth
              value={formData?.st_roll_no || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* External (Yes/No) */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormLabel component="legend">External</FormLabel>
            <RadioGroup
              row
              name="st_external"
              value={formData?.st_external || "0"}
              onChange={handleChange}
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
              <FormControlLabel value="0" control={<Radio />} label="No" />
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
              value={formData?.st_mobile || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* Bohra (Yes/No) */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormLabel component="legend">Bohra</FormLabel>
            <RadioGroup
              row
              name="st_bohra"
              value={formData?.st_bohra ?? 0}
              onChange={handleChange}
            >
              <FormControlLabel value={1} control={<Radio />} label="Yes" />
              <FormControlLabel value={0} control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          {/* ITS */}
          {formData?.st_bohra === 1 && (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                name="st_its_id"
                label="ITS"
                required
                fullWidth
                value={formData?.st_its_id || ""}
                onChange={handleChange}
              />
            </Grid>
          )}

          {/* Email */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="st_gmail_address"
              label="Email"
              type="email"
              required
              fullWidth
              value={formData?.st_gmail_address || ""}
              onChange={handleChange}
            />
          </Grid>

          {/* House */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete
              options={houseList || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="st_house"
                  label="House"
                  required
                  fullWidth
                />
              )}
              value={formData?.st_house || ""}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "st_house", value: newValue } })
              }
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
        {activeTab === 0 && <OtherDetailsTab props={props} />}
        {activeTab === 1 && <AddressDetailsTab props={props} />}
        {activeTab === 2 && <FatherDetailsTab props={props} />}
        {activeTab === 3 && <MotherDetailsTab props={props} />}
      </Box>
    </Card>
  );
};

CreateEditStudent.propTypes = {
  isEdit: PropTypes.bool,
};

export default CreateEditStudent;
