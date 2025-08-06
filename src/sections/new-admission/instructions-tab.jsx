import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { memo } from "react";

const InstructionsTab = ({ props }) => {
  const { termsAccepted, handleCheckboxChange, acceptTermsRef } = props;

  return (
    <Box>
      {/* Note Section */}
      <Box
        sx={{
          bgcolor: "#fff3e0",
          p: 2,
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5" color="textSecondary">
          <strong>NOTE</strong>
        </Typography>
        <List sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText primary={`Use Chrome browser for best results`} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <>
                  If you have already submitted the application then check the
                  status or pay the Application Fee,{" "}
                  <Link to="#">click here</Link>.
                </>
              }
            />
          </ListItem>
        </List>
        <Typography>
          Applying for admission for kg 2025-26 is a 2-step process. Please see
          the details below:
          <br />
          Step 1 - Registering the form
          <br />
          Step 2 - Paying the application fee
          <br />
          <br />
          Both steps are to be done online.
        </Typography>
      </Box>

      {/* Heading */}
      <Typography variant="h4" align="center" gutterBottom>
        PLEASE NOTE
      </Typography>

      {/* Instructions List */}
      <List sx={{ mb: 2 }}>
        <ListItem>
          <ListItemText
            primary={`Child's Date of birth must be between 01 Apr 2020 and 30 Mar 2021`}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Please enter at compulsory fields in the Application form. Incomplete Application Forms may be rejected." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Multiple applications of the same child shall be ignored. The child may also be completely disqualified for admission." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Please note your Application Number shown to you on the screen after submitting the Application Form (completion of Step 1), as you will need it to make the payment of the Application Fee (Step 2). Only then will your application be complete and considered for the next step." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Application Fee is to be paid online only through the link provided on the website after submitting the Application Form (completion of Step 1), by using the ICICI payment gateway and NOT at the School website. At no point does the School website come in possession of these details and so the School is NOT liable for any misuse of these details." />
        </ListItem>
        <ListItem>
          <ListItemText primary="The Application Fee is Rs 500/- to cover the costs of the School for considering your application." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Form of payment of the application fee does NOT guarantee admission in any way." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Application Fee will NOT be refunded under ANY circumstances including, whatever may be the reason, withdrawal of your application, admission not granted, etc." />
        </ListItem>
        <ListItem>
          <ListItemText primary="The School Management reserves the right to stop the admission process at any time." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Please note the shortlisted candidates will be informed of regular intervals about when they will be required to come to the School for an interview." />
        </ListItem>
        <ListItem>
          <ListItemText primary="The School reserves the right to change the admission process at any time." />
        </ListItem>
        <ListItem>
          <ListItemText primary="If you face difficulties in submitting the Application Form or in paying the Application Fee, please contact us at <a href='mailto:admissions@schoolname.com'>admissions@schoolname.com</a>" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Please keep checking your child's name, your name, and other information in the Application Form (if available)." />
        </ListItem>
      </List>

      {/* Terms Checkbox */}
      <FormControlLabel
        ref={acceptTermsRef}
        required
        control={
          <Checkbox
            checked={termsAccepted || false}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label="I understand and accept the above TERMS"
      />
    </Box>
  );
};

InstructionsTab.propTypes = {
  props: PropTypes.object,
  termsAccepted: PropTypes.object,
  handleCheckboxChange: PropTypes.func,
  acceptTermsRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
};

export default memo(InstructionsTab);
