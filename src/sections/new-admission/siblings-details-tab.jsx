import PropTypes from "prop-types";
import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { memo } from "react";

const SiblingsDetailsTab = ({ props }) => {
  const { formData, setFormData } = props;

  // Ensure siblingsData is an array in formData
  const siblingsData = formData?.siblings || [{}];

  const handleChange = (index, event) => {
    const { name, value } = event.target;

    const updatedSiblings = [...siblingsData];
    updatedSiblings[index] = {
      ...updatedSiblings[index],
      [name]: value,
    };
    setFormData((preValue) => ({ ...preValue, siblings: updatedSiblings }));
  };

  const addSibling = () => {
    setFormData((preValue) => ({
      ...preValue,
      siblings: [...siblingsData, { name: "", cg_id: "", roll_no: "" }],
    }));
  };

  const removeSibling = (index) => {
    const updatedSiblings = siblingsData.filter((_, i) => i !== index);
    setFormData((preValue) => ({ ...preValue, siblings: updatedSiblings }));
  };
  return (
    <Box sx={{ mb: 4 }}>
      {siblingsData?.map((sibling, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          {/* Name */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={sibling?.name || ""}
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          {/* Class & Section */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              name="cg_id"
              label="Class & Section"
              fullWidth
              value={sibling?.cg_id || ""}
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          {/* Roll No */}
          <Grid item xs={12} sm={6} md={4}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  name="roll_no"
                  label="Roll No"
                  fullWidth
                  value={sibling?.roll_no || ""}
                  onChange={(e) => handleChange(index, e)}
                />
              </Grid>
              {/* Remove Button */}
              <Grid item xs={2} sx={{ textAlign: "right" }}>
                <IconButton color="error" onClick={() => removeSibling(index)}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}

      {/* Add More Button */}
      <Button variant="contained" startIcon={<Add />} onClick={addSibling}>
        Add
      </Button>
    </Box>
  );
};

SiblingsDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
};

export default memo(SiblingsDetailsTab);
