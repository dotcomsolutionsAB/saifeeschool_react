import { ExpandMoreRounded, MoreVertRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  getAcademicYear,
  makeYearCurrent,
} from "../../../../services/admin/settings.service";
import AddNewYearModal from "./modals/add-new-year-modal";
import Classes from "./classes/classes";
import FeePlan from "./fee-plan/fee-plan";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import Iconify from "../../../../components/iconify/iconify";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

const AcademicYear = () => {
  const theme = useTheme();
  const { logout, userInfo } = useAuth();

  const academicYear = {
    ay_id: userInfo?.ay_id || "",
    ay_name: userInfo?.ay_name || "",
  };

  const [expanded, setExpanded] = useState(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);
  const [activeTab, setActiveTab] = useState("Classes");

  const [newYearModalOpen, setNewYearModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState();

  const [isMakeCurrentLoading, setIsMakeCurrentLoading] = useState(false);

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
    setAnchorEl(null);
    setSelectedRow(null);
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

  const handleMakeCurrent = async () => {
    setIsMakeCurrentLoading(true);
    const response = await makeYearCurrent({ ay_id: selectedRow?.ay_id });
    setIsMakeCurrentLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (academicYearList?.length > 0) {
      academicYearList?.find((ay, index) => {
        if (Number(ay?.ay_id) === Number(userInfo?.ay_id)) {
          setExpanded(index);
          setCurrentAcademicYear(index);
        }
      });
    }
  }, [academicYearList]);

  return (
    <Box>
      <Helmet>
        <title>Academic Year | SAIFEE</title>
      </Helmet>
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
        {academicYear && (
          <Card elevation={3} sx={{ px: 1, py: 0.5 }}>
            <Typography variant="h6">
              Current Year- {academicYear?.ay_name || ""}
            </Typography>
          </Card>
        )}
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
              sx={{ mb: 0.5 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                sx={{
                  bgcolor:
                    currentAcademicYear === index
                      ? "primary.lightActive"
                      : "primary.main",
                  color:
                    currentAcademicYear === index
                      ? "#000"
                      : "primary.contrastText",
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
                  <Typography sx={{ fontSize: { xs: "11px", sm: "16px" } }}>
                    {academicYear?.ay_name || ""}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "11px", sm: "16px" },
                    }}
                  >
                    {`${academicYear?.ay_start_month || ""}  to ${
                      academicYear?.ay_end_month || ""
                    }`}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "11px", sm: "16px" } }}>{`${
                    academicYear?.total_classes || ""
                  } Classes`}</Typography>
                  <Typography sx={{ fontSize: { xs: "11px", sm: "16px" } }}>{`${
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

            <MenuItem
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onClick={isMakeCurrentLoading ? null : handleMakeCurrent}
            >
              {isMakeCurrentLoading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <IconButton>
                    <Iconify icon="fluent:double-swipe-up-20-regular" />
                  </IconButton>
                  <Typography sx={{ color: "primary.main", fontWeight: 500 }}>
                    Make Current
                  </Typography>
                </>
              )}
            </MenuItem>
          </Popover>
        </Box>
      )}
    </Box>
  );
};

export default AcademicYear;
