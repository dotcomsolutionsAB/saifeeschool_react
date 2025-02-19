import PropTypes from "prop-types";
import { Box, Button, Divider, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import AdmissionFees from "./tabs/admission-fees";
import OneTimeFees from "./tabs/one-time-fees";
import MonthlyFees from "./tabs/monthly-fees";
import RecurringFees from "./tabs/recurring-fees";

const FeePlan = ({ academicYear }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <Box>
      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ position: "relative" }}
      >
        <Tab label="ADMISSION FEES" />
        <Tab label="MONTHLY FEES" />
        <Tab label="ONE-TIME FEES" />
        <Tab label="RECURRING FEES" />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            variant="standard"
            sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            onClick={handleModalOpen}
          >
            + Add new
          </Button>
        </Box>
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      {/* Tab Content */}
      {activeTab === 0 && (
        <AdmissionFees
          academicYear={academicYear}
          open={modalOpen}
          onClose={handleModalClose}
        />
      )}
      {activeTab === 1 && (
        <MonthlyFees
          academicYear={academicYear}
          open={modalOpen}
          onClose={handleModalClose}
        />
      )}
      {activeTab === 2 && (
        <OneTimeFees
          academicYear={academicYear}
          open={modalOpen}
          onClose={handleModalClose}
        />
      )}
      {activeTab === 3 && (
        <RecurringFees
          academicYear={academicYear}
          open={modalOpen}
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
};

FeePlan.propTypes = {
  academicYear: PropTypes.object,
};

export default FeePlan;
