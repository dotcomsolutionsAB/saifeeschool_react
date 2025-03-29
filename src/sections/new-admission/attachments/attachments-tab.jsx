/*************  ✨ Codeium Command 🌟  *************/
import PropTypes from "prop-types";
import { Box, Typography, Button, useTheme } from "@mui/material";
import UploadImageIcon from "../../../assets/icons/UploadImageIcon.svg";
import { useState } from "react";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
// import useAuth from "../../../hooks/useAuth";
// import { uploadStudentImage } from "../../../services/admin/students-management.service";
import Iconify from "../../../components/iconify/iconify";

/**
 * AttachmentsTab component that allows users to upload and view file attachments.
 * @param {Object} props - Component props.
 * @param {Object} props.detail - Detail object (unused).
 * @param {string} props.title - Title for the upload section.
 * @returns {JSX.Element} The rendered component.
 */
const AttachmentsTab = ({ detail, title }) => {
  // const { logout } = useAuth();
  const theme = useTheme();
  const [file, setFile] = useState(null);

  /**
   * Returns the appropriate icon for a given file based on its type.
   * @param {Object} file - The file object.
   * @returns {JSX.Element} The icon element.
   */
  const getFileIcon = (file) => {
    if (file?.type?.includes("pdf") || file?.file_ext === "pdf")
      return <Iconify icon="vscode-icons:file-type-pdf2" width={150} />;
    if (
      file?.type?.includes("excel") ||
      file?.name?.endsWith(".xls") ||
      file?.name?.endsWith(".xlsx") ||
      file?.file_ext === "xlsx"
    )
      return <Iconify icon="vscode-icons:file-type-excel2" width={150} />;
    if (
      file?.type?.includes("word") ||
      file?.name?.endsWith(".doc") ||
      file?.name?.endsWith(".docx") ||
      file?.file_ext === "docx"
    )
      return <Iconify icon="vscode-icons:file-type-word" width={150} />;
    return (
      <InsertDriveFile sx={{ color: "primary.main", fontSize: "150px" }} />
    ); // Default icon
  };

  /**
   * Handles the file upload event.
   * @param {Event} event - The change event from the file input.
   */
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.warning("File size should not exceed 5MB.");
      event.target.value = ""; // Reset input
      return;
    }

    setFile(selectedFile);
    event.target.value = ""; // Reset input
  };

  /**
   * Removes the currently selected file.
   */
  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Box>
      {/* Header section with title and upload button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography>Upload {title || ""}</Typography>
        {file && <Button variant="contained">Upload</Button>}
      </Box>

      {/* File upload area */}
      {!file && (
        <Box
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            p: 2,
            border: `1px dashed ${theme.palette.primary.lightActive}`,
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src={UploadImageIcon}
            alt="Upload Icon"
            sx={{ width: "30px", height: "30px" }}
          />
          <Box sx={{ color: "primary.main", fontSize: "12px" }}>
            Click to upload{" "}
            <input type="file" hidden onChange={handleFileUpload} />
          </Box>
          <Typography sx={{ fontSize: "10px", color: "neutralCool.dark" }}>
            Images, PDF, Excel, Docs (Less than 5MB)
          </Typography>
        </Box>
      )}

      {/* Display uploaded file */}
      {file && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 4,
            my: 2,
          }}
        >
          <Box
            sx={{
              height: "200px",
              width: "200px",
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: 0.5,
                width: "100%",
                height: "35px",
              }}
            >
              <Typography variant="body2" noWrap>
                {file?.name}
              </Typography>
              <Delete
                fontSize="small"
                onClick={handleRemoveFile}
                sx={{ cursor: "pointer" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100% - 35px)",
                p: 0.5,
              }}
            >
              {file?.type?.startsWith("image/") ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt={file?.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                />
              ) : (
                getFileIcon(file)
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

AttachmentsTab.propTypes = {
  detail: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default AttachmentsTab;
