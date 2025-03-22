import PropTypes from "prop-types";
import { useState } from "react";
import {
  getClasses,
  upgradeStudent,
} from "../../../../../services/admin/students-management.service";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import { useGetApi } from "../../../../../hooks/useGetApi";

const UpgradeStudentModal = ({
  open,
  onClose,
  selectedRows,
  setSelectedRows,
  refetch,
}) => {
  const { userInfo, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [classOption, setClassOption] = useState(null);

  // api to get classList
  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: userInfo?.ay_id,
    },
  });

  const handleUpgradeStudent = async () => {
    setIsLoading(true);
    const response = await upgradeStudent({
      st_id: selectedRows,
      cg_id: classOption?.id,
    });
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      setClassOption(null);
      setSelectedRows([]);
      toast.success(response?.message || "Students upgraded successfully");
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      PaperProps={{
        sx: {
          minWidth: { xs: "95vw", sm: "600px" },
          position: "relative",
        },
      }}
    >
      <CancelOutlined
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "primary.contrastText",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={!isLoading ? onClose : null}
      />
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Upgrade Student to 2025-26
      </Box>

      <DialogContent>
        <Typography sx={{ color: "text.secondary", mb: 2 }}>
          Upgrade all students filtered.
        </Typography>
        <Autocomplete
          options={classList || []}
          getOptionLabel={(option) => option?.cg_name || ""} // it is necessary for searching the options
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Class"
              size="small"
              fullWidth
            />
          )}
          value={classOption || null}
          onChange={(_, newValue) => setClassOption(newValue)}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleUpgradeStudent}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : `Upgrade`}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

UpgradeStudentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedRows: PropTypes.array,
  refetch: PropTypes.func,
  setSelectedRows: PropTypes.func,
};

export default UpgradeStudentModal;
