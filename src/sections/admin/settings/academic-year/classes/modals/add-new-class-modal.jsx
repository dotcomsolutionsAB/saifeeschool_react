import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import {
  createClassGroup,
  getTeachers,
  updateClassGroup,
} from "../../../../../../services/admin/classes.service";
import { useGetApi } from "../../../../../../hooks/useGetApi";

const AddNewClassModal = ({ open, onClose, refetch, academicYear, detail }) => {
  const { logout } = useAuth();

  const initialState = {
    ay_id: Number(academicYear?.ay_id),
    cg_name: "",
    cg_order: "",
    teacher_id: null,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  // api to get classList

  const { dataList: teachersList } = useGetApi({
    apiFunction: getTeachers,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);
    if (detail?.cg_id) {
      response = await updateClassGroup({
        ...formData,
        teacher_id: formData?.teacher_id?.id,
      });
    } else {
      response = await createClassGroup({
        ...formData,
        teacher_id: formData?.teacher_id?.id,
      });
    }
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Class added successfully");
      setFormData(initialState);
      onClose();
      refetch();
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (detail?.cg_id) {
      setFormData({
        ...initialState,
        cg_id: detail.cg_id,
        cg_name: detail?.cg_name || "",
        cg_order: detail?.cg_group || detail?.cg_order || "",
        teacher_id: {
          id: detail?.teacher_id || "",
          name: detail?.class_teacher_name || "",
        },
      });
    } else {
      setFormData(initialState);
    }
  }, [open]);
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
        {detail?.cg_id ? `Edit New Class` : `Add New Class`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="cg_name"
                fullWidth
                required
                value={formData?.cg_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Group"
                name="cg_order"
                fullWidth
                required
                value={formData?.cg_order || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={teachersList || []}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class Teacher"
                    name="teacher_id"
                    fullWidth
                  />
                )}
                value={formData?.teacher_id || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "teacher_id", value: newValue },
                  })
                }
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : `Save`}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddNewClassModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  academicYear: PropTypes.object,
  detail: PropTypes.object,
};

export default memo(AddNewClassModal);
