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
import { Helmet } from "react-helmet-async";
import SaifeeLogo from "../assets/logos/Saifee_Logo.png";
import InstructionsTab from "../sections/new-admission/instructions-tab";
import ChildDetailsTab from "../sections/new-admission/child-details-tab";
import SiblingsDetailsTab from "../sections/new-admission/siblings-details-tab";
import { newAdmission } from "../services/new-admission.service";
import { useGetApi } from "../hooks/useGetApi";
import { getClasses } from "../services/admin/students-management.service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const TABS_LIST = [
  "Instructions",
  "Child Details",
  "Father Details",
  "Mother Details",
  "Sibling's Details",
  "Other Details",
];

const NewAdmission = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const initialState = {
    // child info
    first_name: "",
    last_name: "",
    ay_id: 9,
    gender: "m",
    dob: null,
    class: null,
    aadhaar: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    last_school: "",
    last_school_address: "",

    // father info
    father_name: "",
    father_surname: "",
    father_mobile: "",
    father_email: "",
    father_occupation: "business", // or "employed", "no-occupation"
    father_monthly_income: "",

    // business details
    father_business_name: "",
    father_business_nature: "",
    father_business_address: "",
    father_business_city: "",
    father_business_state: "",
    father_business_country: "",
    father_business_pincode: "",

    // employment details
    father_employer_name: "",
    father_designation: "",
    father_work_address: "",
    father_work_city: "",
    father_work_state: "",
    father_work_country: "",
    father_work_pincode: "",

    // mother info
    mother_first_name: "",
    mother_last_name: "",
    mother_mobile: "",
    mother_email: "",
    mother_occupation: "business", // or "employed", "housewife", "not-applicable"
    mother_monthly_income: "",

    // business details
    mother_business_name: "",
    mother_business_nature: "",
    mother_business_address: "",
    mother_business_city: "",
    mother_business_state: "",
    mother_business_country: "",
    mother_business_pincode: "",

    // employment details
    mother_employer_name: "",
    mother_designation: "",
    mother_work_address: "",
    mother_work_city: "",
    mother_work_state: "",
    mother_work_country: "",
    mother_work_pincode: "",

    siblings: [],
    attracted: "",
    strengths: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [attachments, setAttachments] = useState({
    child_photo: null,
    father_photo: null,
    mother_photo: null,
    birth_certificate: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: 9,
    },
  });

  const handleCheckboxChange = (event) => {
    setTermsAccepted(event.target.checked);
  };

  // tab change
  const handleTabChange = (event, newValue) => {
    if (!termsAccepted) {
      toast.info("Please accept terms and conditions");
      return;
    }
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (!termsAccepted) {
      toast.info("Please accept terms and conditions");
      return;
    }
    if (activeTab < TABS_LIST?.length - 1) setActiveTab((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (activeTab > 0) setActiveTab((prev) => prev - 1);
  };

  const cleanOccupationFields = (data, prefix, occupation) => {
    // Normalize occupation to handle case sensitivity and edge cases
    const normalizedOccupation =
      typeof occupation === "string" ? occupation.toLowerCase().trim() : "";

    const businessFields = [
      "business_name",
      "business_nature",
      "business_address",
      "business_city",
      "business_state",
      "business_country",
      "business_pincode",
    ];

    const employedFields = [
      "employer_name",
      "designation",
      "work_address",
      "work_city",
      "work_state",
      "work_country",
      "work_pincode",
    ];

    // Delete fields based on occupation
    if (normalizedOccupation === "business") {
      employedFields.forEach((field) => {
        const key = `${prefix}_${field}`;
        if (key in data) {
          delete data[key];
        }
      });
    } else if (normalizedOccupation === "employed") {
      businessFields.forEach((field) => {
        const key = `${prefix}_${field}`;
        if (key in data) {
          delete data[key];
        }
      });
    } else {
      [...businessFields, ...employedFields].forEach((field) => {
        const key = `${prefix}_${field}`;
        if (key in data) {
          delete data[key];
          delete data[`${prefix}_monthly_income`];
        }
      });
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare siblings
    const processedSiblings =
      formData?.siblings?.map((sibling) => ({
        ...sibling,
        cg_id: sibling?.cg_id?.id,
      })) || [];

    // Deep clone formData to avoid mutating the original
    const cleanedData = JSON.parse(JSON.stringify(formData));

    // Clean up occupation-based fields
    cleanOccupationFields(cleanedData, "father", cleanedData.father_occupation);
    cleanOccupationFields(cleanedData, "mother", cleanedData.mother_occupation);

    // Prepare json_data
    const jsonData = {
      ...cleanedData,
      dob: cleanedData?.dob
        ? dayjs(cleanedData?.dob).format("YYYY-MM-DD")
        : null,
      class: cleanedData?.class?.cg_name,
      siblings: processedSiblings,
    };

    // Create FormData object
    const formDataPayload = new FormData();

    // Append json_data as a stringified JSON blob
    formDataPayload.append("json_data", JSON.stringify(jsonData));

    // Append attachments (assuming attachments is an object with file fields)
    Object.keys(attachments).forEach((key) => {
      if (
        attachments[key] instanceof File ||
        attachments[key] instanceof Blob
      ) {
        formDataPayload.append(key, attachments[key]);
      } else {
        // Handle non-file attachments if needed (e.g., strings)
        formDataPayload.append(key, attachments[key]);
      }
    });

    setIsLoading(true);
    const response = await newAdmission(formDataPayload);
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Student Creation Successful");
      setFormData(initialState);
      navigate("/");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  //   props for each tab
  const props = {
    formData,
    setFormData,
    setAttachments,
    handleChange,
    termsAccepted,
    handleCheckboxChange,
    classList,
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
            SAIFEE GOLDEN JUBILEE ENGLISH PUBLIC SCHOOL
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
                {TABS_LIST?.map((label, index) => (
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
                  type="button"
                  variant="outlined"
                  onClick={handlePrev}
                  sx={{ mr: 2 }}
                  disabled={isLoading}
                >
                  Previous
                </Button>
              )}
              {activeTab < TABS_LIST?.length - 1 && (
                <Button type="button" variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}

              {activeTab === TABS_LIST?.length - 1 && (
                <Button
                  form="student-form"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
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
