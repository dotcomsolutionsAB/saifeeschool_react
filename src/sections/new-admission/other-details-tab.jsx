import PropTypes from "prop-types";
import { Box, Grid, TextField } from "@mui/material";

const OtherDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="attracted"
            label="What attracted you to our school?"
            fullWidth
            value={formData?.attracted || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="strengths"
            label="Strengths and Weaknesses of your child?"
            fullWidth
            value={formData?.strengths || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="remarks"
            label="Any Remarks?"
            fullWidth
            value={formData?.remarks || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

OtherDetailsTab.propTypes = {
  props: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  bloodGroupList: PropTypes.array,
  academicYearList: PropTypes.array,
  classList: PropTypes.array,
};

export default OtherDetailsTab;
