import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Iconify from "../../../../components/iconify/iconify";
import OtherDetailsTab from "./detail-tabs/other-details-tab";
import PendingFeesTab from "./detail-tabs/pending-fees-tab";
import PaidFeesTab from "./detail-tabs/paid-fees-tab";
import AttachmentsTab from "./detail-tabs/attachments-tab";
import {
  getAllAcademicYears,
  uploadStudentImage,
} from "../../../../services/admin/students-management.service";
import { toast } from "react-toastify";
import WalletModal from "./modals/wallet";
import useAuth from "../../../../hooks/useAuth";
import { useGetApi } from "../../../../hooks/useGetApi";

const StudentDetail = () => {
  const { logout, userInfo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const detail = location?.state || null;

  const [previewImage, setPreviewImage] = useState(detail?.photo || "");
  const [activeTab, setActiveTab] = useState(0);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState({
    ay_id: userInfo?.ay_id,
    ay_name: userInfo?.ay_name,
  });

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const response = await uploadStudentImage({
        st_roll_no: detail?.st_roll_no,
        st_id: detail?.id,
        file: [file],
        file_type: ["photo"],
      });
      if (response?.code === 200) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImage(reader?.result);
        };
        reader.readAsDataURL(file);
        toast.success(response?.message || "Image uploaded successfully");
      } else if (response?.code === 401) {
        logout(response);
        // toast.error(response?.message || "Unauthorized");
      } else {
        toast.error(response?.message || "Some error occurred.");
      }
    }
    e.target.value = ""; // to select the same file again if there is any error
  };

  const handleWalletModalClose = () => {
    setWalletModalOpen(false);
  };

  const handleWalletClick = () => {
    setWalletModalOpen(true);
  };

  const handleEdit = () => {
    navigate("/students-management/students/edit-student", { state: detail });
  };

  useEffect(() => {
    if (!detail) {
      navigate(-1);
    }
  }, [detail]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 1 }}>
        <Button variant="contained">Login as Student</Button>
      </Box>
      <Card>
        <CardContent sx={{ position: "relative", px: 5 }}>
          {/* Image */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                position: "relative",
                "&:hover": {
                  ".overlay-image": {
                    visibility: "visible",
                    opacity: 1,
                    cursor: "pointer",
                  },
                },
              }}
            >
              <Avatar
                alt="Preview"
                src={previewImage}
                sx={{ width: "100%", height: "100%" }}
              />
              <Box
                className="overlay-image"
                component="label"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "grid",
                  placeItems: "center",
                  visibility: "hidden",
                  opacity: 0,
                  transition: "all 0.4s ease",
                }}
              >
                <Iconify
                  icon="eva:edit-fill"
                  width={30}
                  sx={{ color: "white" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Box>
            </Box>
          </Box>

          {/* Student Name */}
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "primary.main" }}
          >{`${detail?.st_first_name || ""} ${
            detail?.st_last_name || ""
          }`}</Typography>

          {/* mobile, class and roll no  */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "primary.main",
              mt: 2,
              mb: 1,
            }}
          >
            <Typography>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Mobile:{" "}
              </Box>
              {detail?.st_mobile || ""}
            </Typography>
            <Divider
              sx={{ bgcolor: "primary.main", height: "20px", width: "2px" }}
            />
            <Typography>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Class:{" "}
              </Box>
              {detail?.class_name || ""}
            </Typography>
            <Divider
              sx={{ bgcolor: "primary.main", height: "20px", width: "2px" }}
            />
            <Typography>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Roll No:{" "}
              </Box>
              {detail?.st_roll_no || ""}
            </Typography>
          </Box>
          <Divider
            sx={{ bgcolor: "#b1b1b1", height: "1px", width: "100%", mb: 2 }}
          />

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Other Details" />
            <Tab label="Pending Fees" />
            <Tab label="Paid Fees" />
            <Tab label="Attachments" />
          </Tabs>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 1,
              mb: 2,
            }}
          >
            {(activeTab === 1 || activeTab === 2) && (
              <Autocomplete
                options={academicYearList || []}
                getOptionLabel={(option) => option?.ay_name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Select Year" size="small" />
                )}
                value={academicYear || null}
                onChange={(_, newValue) => setAcademicYear(newValue)}
                sx={{
                  minWidth: "150px",
                }}
              />
            )}
            <Button
              variant="standard"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
              onClick={handleWalletClick}
            >
              +Wallet: ₹{detail?.wallet || 0}/-
            </Button>
            <IconButton
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: "5px",
                p: "2px",
                height: "35px",
                width: "35px",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
              onClick={handleEdit}
            >
              <Iconify icon="lucide:edit" />
            </IconButton>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && <OtherDetailsTab detail={detail} />}
          {activeTab === 1 && (
            <PendingFeesTab detail={detail} academicYear={academicYear} />
          )}
          {activeTab === 2 && (
            <PaidFeesTab detail={detail} academicYear={academicYear} />
          )}
          {activeTab === 3 && <AttachmentsTab detail={detail} />}

          <WalletModal
            open={walletModalOpen}
            onClose={handleWalletModalClose}
            detail={detail}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default StudentDetail;
