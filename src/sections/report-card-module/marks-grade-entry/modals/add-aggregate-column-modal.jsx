import PropTypes from "prop-types";
import { memo, useState } from "react";
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
import useAuth from "../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  addAggregateColumn,
  getSubjectsList,
} from "../../../../services/report-card-module.service";

const AddAggregateColumnModal = ({ open, onClose, refetch, detail }) => {
  const { logout } = useAuth();

  const initialState = {
    cg_id: detail?.cg_id?.id || "",
    subj_name: "",
    subj_ids: [],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  // api to get classList

  const { dataList: subjectsList } = useGetApi({
    apiFunction: formData?.cg_id ? getSubjectsList : null,
    body: { cg_id: formData?.cg_id },
    dependencies: [formData?.cg_id],
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData) return;
    setIsLoading(true);

    const response = await addAggregateColumn(formData);

    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Column added successfully");
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

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      PaperProps={{
        sx: {
          minWidth: "600px",
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
        Add Aggregate Column
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name of Column"
                name="subj_name"
                fullWidth
                value={formData?.subj_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                limitTags={2}
                disableCloseOnSelect
                options={subjectsList || []}
                getOptionLabel={(option) => option?.subj_name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Subject Included" fullWidth />
                )}
                value={formData?.subj_ids || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "subj_ids", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Add After Which Column"
                name="addAfterWhichColumn"
                fullWidth
                value={formData?.addAfterWhichColumn || ""}
                onChange={handleChange}
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

AddAggregateColumnModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default memo(AddAggregateColumnModal);
