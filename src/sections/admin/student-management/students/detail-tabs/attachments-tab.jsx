import PropTypes from "prop-types";
import { Box, Typography, Button, useTheme } from "@mui/material";
import UploadImageIcon from "../../../../../assets/icons/UploadImageIcon.svg";
import { useState } from "react";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import {
  getAttachments,
  uploadStudentImage,
} from "../../../../../services/admin/students-management.service";
import Iconify from "../../../../../components/iconify/iconify";
import { useGetApi } from "../../../../../hooks/useGetApi";
import { DownloadRounded } from "@mui/icons-material";

const AttachmentsTab = ({ detail }) => {
  const { logout } = useAuth();
  const theme = useTheme();
  const [files, setFiles] = useState([]);

  const { dataList: attachmentsList, refetch } = useGetApi({
    apiFunction: getAttachments,
    body: {
      st_id: detail?.student_id,
    },
  });

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

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);

    // Check maximum file count
    if (newFiles?.length > 5) {
      toast.warning("You can upload a maximum of 5 files.");
      event.target.value = ""; // Reset input
      return;
    }

    // Filter out files larger than 5MB
    const validFiles = newFiles?.filter(
      (file) => file?.size <= 5 * 1024 * 1024
    );

    if (validFiles?.length < newFiles?.length) {
      toast.warning("Files were too large (limit: 5MB).");
    }

    // Calculate total size of selected files
    const totalSize = validFiles?.reduce((acc, file) => acc + file?.size, 0);

    if (totalSize > 5 * 1024 * 1024) {
      toast.warning("Total file size should not exceed 5MB.");
      event.target.value = ""; // Reset input
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDownload = (file) => {
    if (file?.file_url)
      window.open(file?.file_url, "_blank", "noopener noreferrer");
  };

  const handleUploadToServer = async (e) => {
    // Extract file names without extensions
    const fileNames = files?.map((file) =>
      file?.name?.split(".")?.slice(0, -1)?.join(".")
    );
    const response = await uploadStudentImage({
      st_id: detail?.id,
      file: files,
      file_name: fileNames,
    });

    if (response?.code === 200) {
      refetch();
      setFiles([]);
      toast.success(response?.message || "Image uploaded successfully");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }

    e.target.value = ""; // to select the same file again if there is any error
  };

  return (
    <Box>
      {/* file upload box */}
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
          <input type="file" multiple hidden onChange={handleFileUpload} />
        </Box>
        <Typography sx={{ fontSize: "10px", color: "neutralCool.dark" }}>
          Images, PDF, Excel, Docs (Less than 5MB)
        </Typography>
      </Box>

      {/* Display Uploaded Files */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          my: 2,
        }}
      >
        {files?.map((file, index) => (
          <Box
            key={index}
            sx={{
              height: "200px",
              width: "200px",
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* title */}
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
                onClick={() => handleRemoveFile(index)}
                sx={{ cursor: "pointer" }}
              />
            </Box>

            {/* icon or images */}
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
        ))}
      </Box>

      {/* display files from apis */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          my: 2,
        }}
      >
        {attachmentsList?.map((file, index) => (
          <Box
            key={index}
            sx={{
              height: "200px",
              width: "200px",
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* title */}
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
                {file?.file_name || "Untitled"}
              </Typography>

              <DownloadRounded
                fontSize="small"
                onClick={() => handleDownload(file)}
                sx={{ cursor: "pointer" }}
              />
            </Box>

            {/* icon or images */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100% - 35px)",
                p: 0.5,
              }}
            >
              {["jpg", "jpeg", "svg", "png"].includes(
                file?.file_ext?.toLowerCase()
              ) ? (
                <Box
                  component="img"
                  src={file?.file_url}
                  alt={file?.file_name || "Pic"}
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
        ))}
      </Box>

      {/* Upload Button */}
      {files?.length > 0 && (
        <Box textAlign="right">
          <Button variant="contained" onClick={handleUploadToServer}>
            Upload Files
          </Button>
        </Box>
      )}
    </Box>
  );
};

AttachmentsTab.propTypes = {
  detail: PropTypes.object,
};

export default AttachmentsTab;
