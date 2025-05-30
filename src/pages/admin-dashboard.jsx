import {
  Autocomplete,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  MoneyDollarIcon,
  StudentsManagementIcon,
  TeacherIcon,
} from "../theme/overrides/CustomIcons";
import { CurrencyRupee, PriorityHigh } from "@mui/icons-material";
import PaymentSummaryTable from "../sections/admin/dashboard/payment-summary-table";
import { getAllAcademicYears } from "../services/admin/students-management.service";
import { useGetApi } from "../hooks/useGetApi";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  getStudentStats,
  getTransactionStats,
} from "../services/admin/dashboard.service";
import Loader from "../components/loader/loader";
import MessageBox from "../components/error/message-box";
import StudentPieChart from "../sections/admin/dashboard/student-pie-chart";
import { Helmet } from "react-helmet-async";
import { FORMAT_INDIAN_CURRENCY } from "../utils/constants";
import FeesCollectionBarChart from "../sections/admin/dashboard/fees-collection-bar-chart";

const AdminDashboard = () => {
  const { userInfo } = useAuth();
  const cardHeight = "200px";

  const [academicYear, setAcademicYear] = useState({
    ay_id: userInfo?.ay_id,
    ay_name: userInfo?.ay_name,
  });

  const {
    dataList: studentStats,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getStudentStats,
    body: {
      ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [academicYear?.ay_id],
  });

  const { dataList: transactionStats } = useGetApi({
    apiFunction: getTransactionStats,
    body: {
      ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [academicYear?.ay_id],
  });

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | SAIFEE</title>
      </Helmet>
      <Autocomplete
        options={academicYearList || []}
        getOptionLabel={(option) => option?.ay_name || ""}
        renderInput={(params) => (
          <TextField {...params} label="Select Year" size="small" />
        )}
        value={academicYear || null}
        onChange={(_, newValue) => setAcademicYear(newValue)}
        sx={{
          maxWidth: "150px",
          bgcolor: "white",
          ml: "auto",
          // position: "absolute",
          // top: 15,
          // right: 15,
        }}
      />
      <Box
        sx={{
          mt: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                elevation={10}
                sx={{
                  height: cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  p: 1,
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "success.lightHover",
                    color: "success.main",
                    width: "80px",
                    height: "80px",
                  }}
                  disableRipple
                >
                  <StudentsManagementIcon sx={{ fontSize: "50px" }} />
                </IconButton>

                <Divider
                  sx={{
                    width: "90%",
                    height: "2px",
                    bgcolor: "error.main",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "text.disabled", textAlign: "center" }}
                >
                  Students
                </Typography>
                <Typography variant="h4">
                  {studentStats?.student_count || "0"}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                elevation={10}
                sx={{
                  height: cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  p: 1,
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "info.lightHover",
                    color: "info.main",
                    width: "80px",
                    height: "80px",
                  }}
                  disableRipple
                >
                  <TeacherIcon sx={{ fontSize: "50px" }} />
                </IconButton>

                <Divider
                  sx={{
                    width: "90%",
                    height: "2px",
                    bgcolor: "error.main",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "text.disabled", textAlign: "center" }}
                >
                  Teachers
                </Typography>
                <Typography variant="h4">
                  {studentStats?.teacher_count || "0"}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                elevation={10}
                sx={{
                  height: cardHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  p: 1,
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "warning.lightHover",
                    color: "warning.main",
                    width: "80px",
                    height: "80px",
                  }}
                  disableRipple
                >
                  <MoneyDollarIcon sx={{ fontSize: "50px" }} />
                </IconButton>

                <Divider
                  sx={{
                    width: "90%",
                    height: "2px",
                    bgcolor: "error.main",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "text.disabled", textAlign: "center" }}
                >
                  Total Fees Due
                </Typography>
                <Typography variant="h4">
                  ₹{" "}
                  {FORMAT_INDIAN_CURRENCY(
                    studentStats?.total_unpaid_fees?.amount
                  ) || "0"}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={12} lg={3}>
              <Grid container spacing={2}>
                {/* Late Fees Card */}
                <Grid item xs={12} md={6} lg={12}>
                  <Card
                    elevation={10}
                    sx={{
                      height: `calc(${cardHeight} / 2 - 8px)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: { xs: 2, sm: 1, md: 2, lg: 1, xl: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 2, lg: 1, xl: 2 },
                        width: { xs: "80%", md: "100%", lg: "90%", xl: "80%" },
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "error.lightHover",
                          color: "error.main",
                          width: 60,
                          height: 60,
                        }}
                        disableRipple
                        aria-label="Late fees warning"
                      >
                        <PriorityHigh sx={{ fontSize: 40 }} />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "40%",
                          width: 2,
                          bgcolor: "error.main",
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{ color: "text.disabled", fontSize: 14 }}
                        >
                          Late Fees
                        </Typography>
                        <Typography variant="h6">
                          ₹{" "}
                          {FORMAT_INDIAN_CURRENCY(
                            studentStats?.current_month_late_fees?.amount
                          ) || "0"}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Fees Due Card */}
                <Grid item xs={12} md={6} lg={12}>
                  <Card
                    elevation={10}
                    sx={{
                      height: `calc(${cardHeight} / 2 - 8px)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: { xs: 2, sm: 1, md: 2, lg: 1, xl: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 2, lg: 1, xl: 2 },
                        width: { xs: "80%", md: "100%", lg: "90%", xl: "80%" },
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "error.lightHover",
                          color: "error.main",
                          width: 60,
                          height: 60,
                        }}
                        disableRipple
                        aria-label="Fees due indicator"
                      >
                        <CurrencyRupee sx={{ fontSize: 40 }} />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "40%",
                          width: 2,
                          bgcolor: "error.main",
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{ color: "text.disabled", fontSize: 14 }}
                        >
                          Fees Due
                        </Typography>
                        <Typography
                          sx={{ color: "text.disabled", fontSize: 10 }}
                          noWrap
                        >
                          (Until Current Month)
                        </Typography>
                        <Typography variant="h6" noWrap>
                          ₹{" "}
                          {FORMAT_INDIAN_CURRENCY(
                            studentStats?.current_month_pending_fees?.amount
                          ) || "0"}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FeesCollectionBarChart transactionStats={transactionStats} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StudentPieChart studentStats={studentStats} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* <PaymentSummaryTable /> */}
        {!isError && !isLoading && (
          <PaymentSummaryTable academicYear={academicYear} />
        )}
      </Box>
    </>
  );
};

export default AdminDashboard;
