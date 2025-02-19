import { ExpandMoreRounded, MoreVertRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  MenuItem,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useGetApi } from "../../../hooks/useGetApi";
import { getAcademicYear } from "../../../services/settings.service";
import AddNewYearModal from "./modals/add-new-year-modal";
import Classes from "./classes/classes";
import FeePlan from "./fee-plan/fee-plan";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import Iconify from "../../../components/iconify/iconify";

const AcademicYear = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(0);
  const [activeTab, setActiveTab] = useState("Classes");

  const [newYearModalOpen, setNewYearModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState();

  const {
    dataList: academicYearList,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getAcademicYear,
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const handleModalOpen = () => {
    setNewYearModalOpen(true);
  };

  const handleModalClose = () => {
    setNewYearModalOpen(false);
  };

  const handlePopoverOpen = (e, option) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedRow(option);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
          mb: 2,
          width: "100%",
        }}
      >
        {/* Add Student */}
        <Button variant="contained" onClick={handleModalOpen}>
          Add New Year
        </Button>

        <AddNewYearModal
          open={newYearModalOpen}
          onClose={handleModalClose}
          refetch={refetch}
          detail={selectedRow}
        />
      </Box>
      {/* Accordions */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox />
      ) : (
        <Box sx={{ width: "100%" }}>
          {academicYearList?.map((academicYear, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography>{academicYear?.ay_name || ""}</Typography>
                  <Typography>
                    {`${academicYear?.ay_start_month || ""} ${
                      academicYear?.ay_start_year || ""
                    } to ${academicYear?.ay_end_month || ""} ${
                      academicYear?.ay_end_year || ""
                    }`}
                  </Typography>
                  <Typography>{`${
                    academicYear?.total_classes || ""
                  } Classes`}</Typography>
                  <Typography>{`${
                    academicYear?.total_fee_plans || ""
                  } Fee Plans`}</Typography>

                  <IconButton
                    onClick={(e) => handlePopoverOpen(e, academicYear)}
                  >
                    <MoreVertRounded />
                  </IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", width: "100%", py: 2 }}>
                  <Box
                    sx={{
                      bgcolor:
                        activeTab === "Classes"
                          ? "primary.main"
                          : "transparent",
                      color:
                        activeTab === "Classes"
                          ? "primary.contrastText"
                          : "primary.main",
                      border: `1px solid ${theme.palette.primary.main}`,
                      py: 1,
                      px: 2,
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      width: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveTab("Classes")}
                  >
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                      Classes
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor:
                        activeTab === "Fee Plan"
                          ? "primary.main"
                          : "transparent",
                      color:
                        activeTab === "Fee Plan"
                          ? "primary.contrastText"
                          : "primary.main",
                      border: `1px solid ${theme.palette.primary.main}`,
                      py: 1,
                      px: 2,
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                      width: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveTab("Fee Plan")}
                  >
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                      Fee Plan
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {activeTab === "Classes" ? (
                    <Classes academicYear={academicYear} />
                  ) : (
                    <FeePlan academicYear={academicYear} />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  p: 0,
                  mt: 1,
                  ml: 0.75,
                  width: 200,
                },
              },
            }}
          >
            <MenuItem
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onClick={handleModalOpen}
            >
              <IconButton>
                <Iconify icon="lucide-edit" />
              </IconButton>
              <Typography sx={{ color: "primary.main", fontWeight: 500 }}>
                Edit
              </Typography>
            </MenuItem>

            <MenuItem sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton>
                <Iconify icon="fluent:double-swipe-up-20-regular" />
              </IconButton>
              <Typography sx={{ color: "primary.main", fontWeight: 500 }}>
                Make Current
              </Typography>
            </MenuItem>
          </Popover>
        </Box>
      )}
    </Box>
  );
};

export default AcademicYear;
