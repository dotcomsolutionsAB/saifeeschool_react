import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  MoneyDollarIcon,
  StudentsManagementIcon,
  TeacherIcon,
} from "../theme/overrides/CustomIcons";

const Dashboard = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            <Typography variant="h6" sx={{ color: "text.disabled" }}>
              Students
            </Typography>
            <Typography variant="h4">2157</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            <Typography variant="h6" sx={{ color: "text.disabled" }}>
              Students
            </Typography>
            <Typography variant="h4">2157</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
            <Typography variant="h6" sx={{ color: "text.disabled" }}>
              Students
            </Typography>
            <Typography variant="h4">2157</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* <PaymentSummaryTable /> */}
    </Box>
  );
};

export default Dashboard;
