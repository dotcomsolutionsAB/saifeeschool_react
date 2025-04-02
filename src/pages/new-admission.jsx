import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
import { useState } from "react";
import OtherDetailsTab from "../sections/new-admission/other-details-tab";
import FatherDetailsTab from "../sections/new-admission/father-details-tab";
import MotherDetailsTab from "../sections/new-admission/mother-details-tab";

// import { createStudent } from "../../../../services/admin/students-management.service";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SaifeeLogo from "../assets/logos/Saifee_Logo.png";
import InstructionsTab from "../sections/new-admission/instructions-tab";
import ChildDetailsTab from "../sections/new-admission/child-details-tab";
import SiblingsDetailsTab from "../sections/new-admission/siblings-details-tab";

const NewAdmission = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const initialState = {
    st_first_name: "",
    st_last_name: "",
    st_gender: "M",
    st_dob: null,
    st_roll_no: "",
    st_external: "0",
    st_mobile: "",
    st_bohra: 0,
    st_its_id: "",
    st_gmail_address: "",
    st_house: "",
    st_blood_group: "",
    aadhaar_no: "",
    st_year_of_admission: null,
    academicYear: null,
    class_group: null,
    residential_address1: "",
    residential_address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    f_first_name: "",
    f_last_name: "",
    f_contact: "",
    f_email: "",
    f_occupation: "self_employed",
    f_business_name: "",
    f_business_nature: "",
    f_employer_name: "",
    f_designation: "",
    f_work_address1: "",
    f_work_address2: "",
    f_work_city: "",
    f_work_state: "",
    f_work_country: "",
    f_work_pincode: "",
    m_first_name: "",
    m_last_name: "",
    m_contact: "",
    m_email: "",
    m_occupation: "self_employed",
    m_business_name: "",
    m_business_nature: "",
    m_employer_name: "",
    m_designation: "",
    m_work_address1: "",
    m_work_address2: "",
    m_work_city: "",
    m_work_state: "",
    m_work_country: "",
    m_work_pincode: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleNext = () => {
    if (activeTab < 6) setActiveTab((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (activeTab > 0) setActiveTab((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formData");
    setIsLoading(true);
    const response = {};
    // const response = await createStudent(formData);
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Student Creation Successful");
      setFormData(initialState);
      navigate(-1);
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  //   props for each tab
  const props = {
    formData,
    setFormData,
    handleChange,
  };

  return (
    <Box sx={{ bgcolor: "custom.body_color", minHeight: "100vh", py: 2 }}>
      <Helmet>
        <title>New Admission | SAIFEE</title>
      </Helmet>

      <Container maxWidth="lg">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={SaifeeLogo}
            alt="Saifee Logo"
            sx={{
              width: { xs: "150px", sm: "180px" },
              height: "auto",
            }}
          />
          <Typography
            noWrap
            sx={{
              textTransform: "uppercase",
              fontSize: { xs: "16px", sm: "20px", md: "24px" },
              fontWeight: { xs: "600" },
              color: "primary.main",
            }}
          >
            SAIFEE GOLDEN JUBILEE PUBLIC SCHOOL
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              New Admission
            </Typography>

            <Box component="form" onSubmit={handleSubmit} id="student-form">
              {/* Tabs Section */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {[
                  "Instructions",
                  "Child Details",
                  "Father Details",
                  "Mother Details",
                  "Sibling's Details",
                  "Other Details",
                ].map((label, index) => (
                  <Tab
                    key={index}
                    label={label}
                    // disabled={activeTab !== index}
                  />
                ))}
              </Tabs>

              <Divider sx={{ mb: 4 }} />

              {/* Tab Content */}
              {activeTab === 0 && <InstructionsTab props={props} />}
              {activeTab === 1 && <ChildDetailsTab props={props} />}
              {activeTab === 2 && <FatherDetailsTab props={props} />}
              {activeTab === 3 && <MotherDetailsTab props={props} />}
              {activeTab === 4 && <SiblingsDetailsTab props={props} />}
              {activeTab === 5 && <OtherDetailsTab props={props} />}
            </Box>

            <Box sx={{ my: 2, textAlign: "right" }}>
              {activeTab > 0 && (
                <Button
                  variant="outlined"
                  onClick={handlePrev}
                  sx={{ mr: 2 }}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              )}
              {activeTab < 5 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : "Save"}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

NewAdmission.propTypes = {
  isEdit: PropTypes.bool,
};

export default NewAdmission;
