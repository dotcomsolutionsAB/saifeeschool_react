import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Iconify from "../../../components/iconify/iconify";
import OtherDetailsTab from "./detail-tabs/other-details-tab";
import PendingFeesTab from "./detail-tabs/pending-fees-tab";
import PaidFeesTab from "./detail-tabs/paid-fees-tab";
import LateFeesTab from "./detail-tabs/late-fees-tab";
import AttachmentsTab from "./detail-tabs/attachments-tab";
import { MoreVertRounded } from "@mui/icons-material";

const StudentDetail = () => {
  const location = useLocation();
  const detail = location?.state;

  const [previewImage, setPreviewImage] = useState(detail?.photo || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardContent sx={{ position: "relative", px: 5 }}>
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            right: 20,
            top: 20,
          }}
        >
          Login as Student
        </Button>
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
          textColor="primary"
          indicatorColor="primary"
          sx={{ position: "relative" }}
        >
          <Tab label="Other Details" />
          <Tab label="Pending Fees" />
          <Tab label="Paid Fees" />
          <Tab label="Late Fees/Concession" />
          <Tab label="Attachments" />
          <Box
            sx={{
              position: "absolute",
              right: 0,
              bottom: 5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="standard"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            >
              +Wallet: ₹{detail?.wallet || 0}/-
            </Button>
            <IconButton
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: "5px",
                px: "2px",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <MoreVertRounded />
            </IconButton>
          </Box>
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* Tab Content */}
        {activeTab === 0 && <OtherDetailsTab detail={detail} />}
        {activeTab === 1 && <PendingFeesTab />}
        {activeTab === 2 && <PaidFeesTab />}
        {activeTab === 3 && <LateFeesTab />}
        {activeTab === 4 && <AttachmentsTab />}
      </CardContent>
    </Card>
  );
};

export default StudentDetail;
