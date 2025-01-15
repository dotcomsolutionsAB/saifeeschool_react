import {
  Avatar,
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
import Saifee_Logo from "../assets/logos/Saifee_Logo.png";
import {
  LockRounded,
  PersonRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";

const Login = () => {
  const { login, isLoading } = useAuth();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  return (
    <Box
      sx={{
        background: "#eee",
        display: "grid",
        placeItems: "center",
        minHeight: "100svh",
      }}
    >
      <Helmet>
        <title>Login | SAIFEE</title>
      </Helmet>
      <Card
        elevation={10}
        sx={{
          maxWidth: "90vw",
          boxShadow: "0 0 20px 10px #ddd",
          width: "300px",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              height: "120px",
            }}
          >
            <Avatar
              variant="circle"
              src={Saifee_Logo}
              sx={{ width: "100px", height: "100px" }}
            />
          </Box>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleLogin}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography>Username</Typography>
              <TextField
                // label="Username"
                placeholder="Username"
                name="username"
                type="text"
                required
                inputRef={usernameRef}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRounded fontSize="24px" />
                      </InputAdornment>
                    ),
                  },
                }}
                value={formData?.username || ""}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography>Password</Typography>
              <TextField
                // label="Password"
                name="password"
                placeholder="Password"
                type={`${showPassword ? "text" : "password"}`}
                required
                inputRef={passwordRef}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRounded fontSize="24px" />
                      </InputAdornment>
                    ),
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
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={27} color="inherit" />
              ) : (
                "LOGIN"
              )}
            </Button>
          </Box>
          {/* <Typography
            sx={{ textAlign: "right", cursor: "pointer", color: "grey" }}
          >
            Forgot Password ?
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
