import useAuth from "../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useGetApi } from "../hooks/useGetApi";
import { getStudentStats } from "../services/student/dashboard.service";
import SaifeeLogo from "../assets/logos/Saifee_Logo.png";
import { Link } from "react-router-dom";
import Loader from "../components/loader/loader";
import MessageBox from "../components/error/message-box";

const StudentDashboard = () => {
  const { userInfo } = useAuth();

  const {
    dataList: studentStats,
    isLoading,
    isError,
  } = useGetApi({
    apiFunction: getStudentStats,
    body: {
      st_id: userInfo?.st_id,
    },
  });
  return (
    <>
      <Helmet>
        <title>Dashboard | SAIFEE</title>
      </Helmet>
      <Box>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox />
        ) : (
          <Card sx={{ minHeight: "450px" }}>
            <CardContent>
              <Box
                component="img"
                src={SaifeeLogo}
                alt="Saifee Logo"
                sx={{
                  width: { xs: "150px", sm: "180px" },
                  height: "auto",
                  mb: 2,
                }}
              />
              <Typography variant="h4" sx={{ color: "primary.main" }}>
                Welcome {studentStats?.name || ""}
              </Typography>
              <Typography variant="h5" sx={{ color: "primary.main" }}>
                {studentStats?.class || ""}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  mb: 1,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", minWidth: "150px" }}
                >
                  Deposit: ₹{studentStats?.st_deposit || "0"}/-
                </Button>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", minWidth: "150px" }}
                >
                  Wallet: ₹{studentStats?.st_wallet || "0"}/-
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                  mt: 3,
                }}
              >
                <Link to="/fees/pending-fees">
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", minWidth: "150px" }}
                  >
                    Pending Fees
                  </Button>
                </Link>
                <Link to="/fees/paid-fees">
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", minWidth: "150px" }}
                  >
                    Paid Fees
                  </Button>
                </Link>
                <Link to="/fees/transactions">
                  <Button
                    variant="contained"
                    sx={{ textTransform: "none", minWidth: "150px" }}
                  >
                    Transactions
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default StudentDashboard;
