import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
import { useRef, useState } from "react";
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
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { CLASS_LIST, WEBSITE_NAME } from "../utils/constants";

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

    siblings: [{}],
    attracted: "",
    strengths: "",
    remarks: "",
  };

  const acceptTermsRef = useRef(null);
  const [formData, setFormData] = useState(initialState);
  const [attachments, setAttachments] = useState({
    child_photo: null,
    father_photo: null,
    mother_photo: null,
    family_photo: null,
    birth_certificate: null,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setTermsAccepted(event.target.checked);
  };

  // Reusable function to validate attachments for a specific tab
  const validateTabAttachments = (tabIndex) => {
    if (
      formData?.class?.cg_id !== "nursery" &&
      formData?.class?.cg_id !== "lkg" &&
      !formData?.second_language
    ) {
      toast.info("Please select a second language before proceeding");
      return;
    }

    let requiredAttachments = [];

    if (tabIndex === 1) {
      // Child Details tab - all 5 attachments required
      requiredAttachments = [
        "child_photo",
        "father_photo",
        "mother_photo",
        "family_photo",
        "birth_certificate",
      ];
    }

    if (requiredAttachments.length > 0) {
      const missingAttachments = requiredAttachments.filter(
        (attachment) =>
          !attachments[attachment] || !(attachments[attachment] instanceof File)
      );

      if (missingAttachments.length > 0) {
        const missingNames = missingAttachments
          .map((attachment) => {
            switch (attachment) {
              case "child_photo":
                return "Child Photo";
              case "father_photo":
                return "Father Photo";
              case "mother_photo":
                return "Mother Photo";
              case "family_photo":
                return "Family Photo";
              case "birth_certificate":
                return "Birth Certificate";
              default:
                return attachment;
            }
          })
          .join(", ");

        toast.info(`Please upload the required attachments: ${missingNames}`);
        return false;
      }
    }
    return true;
  };

  // tab change
  const handleTabChange = (event, newValue) => {
    if (!formData?.class) {
      toast.info("Please select a class before proceeding");
      return;
    }
    if (!termsAccepted) {
      toast.info("Please accept terms and conditions");
      acceptTermsRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Validate attachments when moving from current tab to any other tab
    if (activeTab !== newValue && !validateTabAttachments(activeTab)) {
      return;
    }

    setActiveTab(newValue);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((preValue) => {
      if (name === "class") {
        return { ...preValue, [name]: value, dob: null };
      }
      return { ...preValue, [name]: value };
    });
  };

  const handleNext = () => {
    if (!formData?.class) {
      toast.info("Please select a class before proceeding");
      return;
    }
    if (!termsAccepted) {
      toast.info("Please accept terms and conditions");
      acceptTermsRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Validate attachments for current tab before moving to next tab
    if (!validateTabAttachments(activeTab)) {
      return;
    }

    if (activeTab < TABS_LIST?.length - 1) {
      setActiveTab((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    if (!formData?.class?.cg_id) {
      toast.info("Please select a class before proceeding");
      return;
    }

    // Prepare siblings
    // const processedSiblings =
    //   formData?.siblings?.map((sibling) => ({
    //     ...sibling,
    //     cg_id: sibling?.cg_id?.id,
    //   })) || [];

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
      class: cleanedData?.class?.cg_id,
      // siblings: processedSiblings,
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
      navigate(
        response?.data?.application_no
          ? `/payment?applicationNo=${response.data.application_no}`
          : "/"
      );
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  //   props for each tab
  const props = {
    acceptTermsRef,
    formData,
    setFormData,
    setAttachments,
    attachments,
    handleChange,
    termsAccepted,
    handleCheckboxChange,
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
            {WEBSITE_NAME}
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">New Admission</Typography>
              {/* Class */}
              <Autocomplete
                options={CLASS_LIST || []}
                getOptionLabel={(option) => option?.cg_name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class"
                    required
                    fullWidth
                    size="small"
                  />
                )}
                name="class"
                value={formData?.class || null}
                onChange={(_, newValue) =>
                  handleChange({ target: { name: "class", value: newValue } })
                }
                sx={{ width: "150px" }}
              />
            </Box>

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
