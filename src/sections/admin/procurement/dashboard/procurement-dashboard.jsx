import { CurrencyRupee, PriorityHigh } from "@mui/icons-material";
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FORMAT_INDIAN_CURRENCY } from "../../../../utils/constants";
import { useGetApi } from "../../../../hooks/useGetApi";
import { getProcurementDashboard } from "../../../../services/admin/procurement.service";
import { Helmet } from "react-helmet-async";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";

const ProcurementDashboard = () => {
  const cardHeight = "200px";

  const {
    dataList: procurementDashboardData, // need to change this list
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getProcurementDashboard,
  });
  return (
    <>
      <Helmet>
        <title>Procurement | SAIFEE</title>
      </Helmet>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <Grid container spacing={2}>
          {/* Total Products Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={10}
              sx={{
                height: `calc(${cardHeight} / 2 - 8px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
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
                  aria-label="Total Products warning"
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
                  <Typography sx={{ color: "text.disabled", fontSize: 14 }}>
                    Total Products
                  </Typography>
                  <Typography variant="h6">
                    {FORMAT_INDIAN_CURRENCY(
                      procurementDashboardData?.total_items
                    ) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Total Invoices Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={10}
              sx={{
                height: `calc(${cardHeight} / 2 - 8px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
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
                  aria-label="Total Invoices indicator"
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
                  <Typography sx={{ color: "text.disabled", fontSize: 14 }}>
                    Total Invoices
                  </Typography>
                  <Typography variant="h6">
                    {FORMAT_INDIAN_CURRENCY(
                      procurementDashboardData?.total_purchases
                    ) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ProcurementDashboard;
