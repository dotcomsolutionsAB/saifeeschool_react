import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import LoginSchema from "../joi/login-schema";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import Login_Background from "../assets/images/Login_Background.jpeg";
import Saifee_Logo_White from "../assets/logos/Saifee_Logo_White.png";

const NAV_OPTIONS = [
  { _id: "1", label: "Home", link: "/" },
  { _id: "2", label: "About Us", link: "/about-us" },
  { _id: "3", label: "Contact Us", link: "/contact-us" },
];

const loginCardWidth = "clamp(400px, 40vw, 100%)";

const Login = () => {
  const { login, isLoading } = useAuth();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "1700041",
    password: "Saifeeschool",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
    if (name === "username" && e.key === "Enter") {
      passwordRef.current.focus();
    }
    if (name === "password" && e.key === "Enter") {
      handleLogin();
    }
  };

  const handleShowPassword = () => {
    setShowPassword((preValue) => !preValue);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  // validation from joi
  const { error } = LoginSchema.validate(formData);

  const handleLogin = (e) => {
    e.preventDefault();
    if (error) {
      error?.details?.forEach((err) => {
        toast.error(err.message);
      });
    } else {
      login(formData);
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    // setFormData((preValue) => ({ ...preValue, username: "" }));
    setIsForgotPassword(false);
  };

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [isForgotPassword]);

  return (
    <Box
      sx={{
        height: "100svh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>Login | SAIFEE</title>
      </Helmet>

      {/* Navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 4,
          px: 5,
          zIndex: 2,
        }}
      >
        {NAV_OPTIONS?.map((option, index) => (
          <NavLink key={index} to={option?.link}>
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.light", color: "primary.main" }}
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
            width: { xs: "100%", sm: `calc(100% - ${loginCardWidth})` },
            height: { xs: "40%", sm: "100%" },
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
            }}
          ></Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: { xs: "100%", sm: loginCardWidth },
            height: { xs: "60%", sm: "100%" },
            display: "flex",
            alignItems: { sm: "center" },
            justifyContent: "center",
          }}
        >
          <Card
            elevation={10}
            sx={{
              maxWidth: "90vw",
              maxHeight: "330px",
              width: "300px",
              zIndex: 2,
            }}
          >
            {isForgotPassword ? (
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    color: "primary.main",
                    textDecoration: "underline",
                  }}
                >
                  Forgot Password
                </Typography>
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", mt: 3 }}
                  onSubmit={handleSendEmail}
                >
                  <TextField
                    label="Username"
                    name="username"
                    type="text"
                    required
                    inputRef={usernameRef}
                    value={formData?.username || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={27} color="inherit" />
                    ) : (
                      "SEND EMAIL"
                    )}
                  </Button>
                </Box>
              </CardContent>
            ) : (
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    color: "primary.main",
                    textDecoration: "underline",
                  }}
                >
                  Login
                </Typography>
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", mt: 3 }}
                  onSubmit={handleLogin}
                >
                  <TextField
                    label="Username"
                    name="username"
                    type="text"
                    required
                    inputRef={usernameRef}
                    value={formData?.username || ""}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label="Password"
                    name="password"
                    type={`${showPassword ? "text" : "password"}`}
                    required
                    inputRef={passwordRef}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            {showPassword ? (
                              <VisibilityOffRounded
                                onClick={handleShowPassword}
                                cursor="pointer"
                                fontSize="24px"
                              />
                            ) : (
                              <VisibilityRounded
                                onClick={handleShowPassword}
                                cursor="pointer"
                                fontSize="24px"
                              />
                            )}
                          </InputAdornment>
                        ),
                      },
                    }}
                    value={formData?.password || ""}
                    onChange={handleChange}
                  />

                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      mt: 0.5,
                      mb: 3,
                      fontSize: "12px",
                      color: "primary.main",
                    }}
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={27} color="inherit" />
                    ) : (
                      "SIGN IN"
                    )}
                  </Button>
                </Box>
              </CardContent>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
