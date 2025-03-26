import PropTypes from "prop-types";
import { Box, Grid, TextField } from "@mui/material";

const OtherDetailsTab = ({ props }) => {
  const { formData, handleChange } = props;
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="question1"
            label="What attracted you to our school?"
            fullWidth
            value={formData?.question1 || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="question2"
            label="Strengths and Weaknesses of your child?"
            fullWidth
            value={formData?.question2 || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="question3"
            label="Any Remarks?"
            fullWidth
            value={formData?.question3 || ""}
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
