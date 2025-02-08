import { Box, Typography } from "@mui/material";
import UploadImageIcon from "../../../../assets/icons/UploadImageIcon.svg";
import { useState } from "react";

const AttachmentsTab = () => {
  const [files, setSelectedFiles] = useState([]);
  const handleImageUpload = (event) => {
    setSelectedFiles(event.target.files);
  };
  return (
    <Box>
      <Box
        component="label"
        onDragOver={(e) => e.preventDefault()} // Prevent default behavior to enable drop
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageUpload(e);
          }
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          p: 2,
          border: `1px dashed #C5D2FF`,
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src={UploadImageIcon}
          alt="Upload Pic Icon"
          sx={{ width: "30px", height: "30px" }}
        ></Box>
        <Box sx={{ color: "#0EA5E9", fontSize: "12px" }}>
          Click to upload{" "}
          <input type="file" multiple hidden onChange={handleImageUpload} />
        </Box>
        <Typography sx={{ fontSize: "10px", color: "neutralCool.dark" }}>
          JPG, JPEG, PNG less than 1MB
        </Typography>
      </Box>
      {files?.length > 0 ? <Box></Box> : null}
    </Box>
  );
};

export default AttachmentsTab;
