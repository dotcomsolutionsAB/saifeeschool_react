import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Login_Background from "../assets/images/Login_Background.jpeg";
import Saifee_Logo_White from "../assets/logos/Saifee_Logo_White.png";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV_OPTIONS } from "../utils/constants";
import { checkApplicationStatus } from "../services/new-admission.service";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { ArrowBack } from "@mui/icons-material";

// -------------------------------------------------------------------

const paymentCardWidth = "clamp(400px, 40vw, 100%)";

const NewAdmissionPayment = () => {
  const { logout } = useAuth();
  const application_noRef = useRef(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [applicationNo, setApplicationNo] = useState("");
  const [statusData, setStatusData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationNo(value);
    if (name === "application_no" && e.key === "Enter") {
      handleCheckStatus();
    }
  };

  const handleCheckStatus = async (e = null, urlApplicationNo = "") => {
    if (e) e.preventDefault();

    if (!applicationNo.trim() && !urlApplicationNo.trim()) {
      toast.info("Please enter your application number.");
      return;
    }

    setIsLoading(true);
    const response = await checkApplicationStatus({
      applicationNo: applicationNo || urlApplicationNo,
    });
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Check Successful");
      setStatusData(response?.data || null);
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleChangeApplicationNo = () => {
    setStatusData(null);
    setApplicationNo("");
    navigate("/payment");
    setTimeout(() => {
      application_noRef?.current?.focus();
    }, 100);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (statusData?.payment_url) {
      window.open(`${statusData.payment_url}`, "_self", "noopener,noreferrer");
    } else {
      toast.error(
        "No payment URL available. Please check your application status first."
      );
    }
  };

  // Auto-call API when component mounts with applicationNo URL param
  useEffect(() => {
    application_noRef?.current?.focus();

    const urlParams = new URLSearchParams(window.location.search);
    const urlData = Object.fromEntries(urlParams.entries());

    if (urlData?.applicationNo) {
      setApplicationNo(urlData.applicationNo);
      handleCheckStatus(null, urlData.applicationNo);
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100svh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>Payment | SAIFEE</title>
      </Helmet>

      {/* Navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          py: 4,
          px: { xs: 2, sm: 5 },
          zIndex: 2,
        }}
      >
        {NAV_OPTIONS?.map((option, index) => (
          <NavLink
            key={index}
            to={option?.link}
            target={option?.redirect ? "_blank" : "_self"}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.light", color: "primary.main" }}
              size="small"
            >
              {option?.label || ""}
            </Button>
          </NavLink>
        ))}
      </Box>

      {/* Background and Card */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background */}
        <Box
          component="img"
          src={Login_Background}
          sx={{
            height: "100%",
            width: { xs: "100%", sm: "90%", md: "80%" },
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -2,
          }}
        ></Box>

        <Box
          sx={{
            width: { xs: "70%", sm: "65%", md: "60%" },
            height: "100%",
            bgcolor: "primary.main",
            position: "absolute",
            right: 0,
            top: 0,
            transform: `skew(-15deg) translateX(calc(100% * ${Math.tan(
              (15 * Math.PI) / 180
            )}))`,
            transformOrigin: "left",
            zIndex: -1,
            display: { xs: "none", sm: "block" },
          }}
        ></Box>

        {/* Left Side */}
        <Box
          sx={{
            width: { xs: "100%", sm: `calc(100% - ${paymentCardWidth})` },
            height: { xs: statusData ? "20%" : "40%", sm: "100%" },
            display: "flex",
            alignItems: { xs: "end", sm: "center" },
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={Saifee_Logo_White}
            sx={{
              height: { xs: "150px", sm: "170px", md: "250px" },
              width: { xs: "150px", sm: "170px", md: "250px" },
              objectFit: "contain",
              display: { xs: statusData ? "none" : "block", sm: "block" },
            }}
          ></Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: { xs: "100%", sm: paymentCardWidth },
            height: { xs: "auto", sm: "100%" },
            display: "flex",
            alignItems: { sm: "center" },
            justifyContent: "center",
          }}
        >
          <Card
            elevation={10}
            sx={{
              maxWidth: "90vw",
              maxHeight: statusData ? "auto" : "330px",
              width: statusData ? "auto" : "300px",
              zIndex: 2,
              overflow: "auto",
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {!statusData ? (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column" }}
                  onSubmit={handleCheckStatus}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: "center",
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    Application Status
                  </Typography>
                  <TextField
                    inputRef={application_noRef}
                    label="Application Number"
                    name="application_no"
                    value={applicationNo || ""}
                    onChange={handleChange}
                    slotProps={{ input: { readOnly: isLoading } }}
                    required
                  />
                  <Typography color="text.secondary" sx={{ fontSize: "12px" }}>
                    Please enter your application number to check status of
                    payment
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 3 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={27} color="inherit" />
                    ) : (
                      "Check Status"
                    )}
                  </Button>
                </Box>
              ) : (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column" }}
                  onSubmit={handlePayment}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 1,
                      cursor: "pointer",
                      color: "primary.main",
                    }}
                    onClick={handleChangeApplicationNo}
                  >
                    <ArrowBack />
                    <Typography sx={{ fontWeight: "fontWeightBold" }}>
                      Change Application No
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Name:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textTransform: "capitalize",
                          flex: 1,
                        }}
                      >
                        {statusData?.student_name || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Application No:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", flex: 1 }}
                      >
                        {statusData?.application_no || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Date of Birth:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", flex: 1 }}
                      >
                        {statusData?.dob || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Father:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textTransform: "capitalize",
                          flex: 1,
                        }}
                      >
                        {statusData?.father_name || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Mother:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textTransform: "capitalize",
                          flex: 1,
                        }}
                      >
                        {statusData?.mother_name || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Class:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          textTransform: "capitalize",
                          flex: 1,
                        }}
                      >
                        {statusData?.class || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Admission Fees:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            statusData?.ad_paid_text === "Not paid"
                              ? "error.main"
                              : "success.main",
                          fontWeight: 500,
                          flex: 1,
                        }}
                      >
                        {statusData?.ad_paid_text || "N/A"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          minWidth: "120px",
                          mr: 1,
                        }}
                      >
                        Interview Status:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            statusData?.interview_status === "Not Set"
                              ? "warning.main"
                              : "success.main",
                          fontWeight: 500,
                          flex: 1,
                        }}
                      >
                        {statusData?.interview_status || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  {statusData?.ad_paid_text === "Not paid" && (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Proceed to payment
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default NewAdmissionPayment;
