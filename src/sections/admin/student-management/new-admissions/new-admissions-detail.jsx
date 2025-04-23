import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { CAPITALIZE } from "../../../../utils/constants";
import dayjs from "dayjs";
import useLayout from "../../../../hooks/uesLayout";
import {
  getNewAdmissionById,
  getNewAdmissions,
} from "../../../../services/admin/students-management.service";
import { useGetApi } from "../../../../hooks/useGetApi";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";

const NewAdmissionsDetail = () => {
  const { logout } = useAuth();
  const { layout } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(location?.state?.row?.id);
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState(
    location?.state?.row?.child_photo_url || ""
  );

  // api to get new admissions list
  const {
    dataList: newAdmissionsList,
    isLoading,
    isError,
  } = useGetApi({
    apiFunction: getNewAdmissions,
    body: {
      search,
      limit: 100,
    },
    dependencies: [search],
    debounceDelay: 500,
  });

  // api to get academicYearList
  const {
    dataList: detail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useGetApi({
    apiFunction: getNewAdmissionById,
    body: {
      id: selectedId,
    },
    dependencies: [selectedId],
  });

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // const response = await uploadStudentImage({
      //   st_roll_no: detail?.st_roll_no,
      //   st_id: detail?.id,
      //   file: [file],
      //   file_type: ["photo"],
      // });
      const response = { code: 500 };
      if (response?.code === 200) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImage(reader?.result);
        };
        reader.readAsDataURL(file);
        toast.success(response?.message || "Image uploaded successfully");
      } else if (response?.code === 401) {
        logout(response);
      } else {
        toast.error(response?.message || "Some error occurred.");
      }
    }
    e.target.value = ""; // to select the same file again if there is any error
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
  };

  const handleClick = (row) => {
    setSelectedId(row?.id);
    setPreviewImage(row?.child_photo_url || "");
  };

  useEffect(() => {
    if (!location?.state?.row?.id) {
      navigate(-1);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        width: "100%",
      }}
    >
      {/* Left Side */}
      <Card
        elevation={10}
        sx={{
          width: "400px",
          maxHeight: `calc(100vh - ${layout?.headerHeight} - 30px)`,
          overflowY: "auto",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <CardContent>
          <TextField
            label="Search by name..."
            fullWidth
            size="small"
            value={search || ""}
            onChange={handleSearchInputChange}
            sx={{ mb: 2 }}
          />
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <MessageBox />
          ) : (
            newAdmissionsList?.map((row, index) => {
              const isPaid = row?.ad_paid === "1";
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1,
                    mb: 0.3,
                    borderRadius: "5px",
                    bgcolor:
                      row?.id === detail?.id ? "primary.light" : "transparent",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "primary.lightHover",
                    },
                    "&:active": {
                      bgcolor: "primary.lightActive",
                    },
                  }}
                  onClick={() => handleClick(row)}
                >
                  <Avatar
                    src={row?.child_photo_url}
                    alt="Child Pic"
                    sx={{ height: "70px", width: "70px" }}
                  />
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ bgcolor: "primary.main", width: "2px" }}
                  />
                  <Box sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="subtitle2">
                      {row?.name || ""}
                    </Typography>
                    <Typography>
                      Gender: {CAPITALIZE(row?.gender) || ""}
                    </Typography>
                    <Typography>
                      DOB:{" "}
                      {row?.dob ? dayjs(row?.dob).format("DD-MM-YYYY") : null}
                    </Typography>
                    <Typography>
                      Payment Status: {isPaid ? "Paid" : "Unpaid"}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Right Side */}
      <Card
        elevation={10}
        sx={{
          flex: 1,
          minHeight: `calc(100vh - ${layout?.headerHeight} - 30px)`,
          py: 2,
          display: isLoadingDetail || isErrorDetail ? "flex" : "block",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoadingDetail ? (
          <Loader />
        ) : isErrorDetail ? (
          <MessageBox />
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2 }}>
              {/* Image */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    position: "relative",
                    "&:hover": {
                      ".overlay-image": {
                        visibility: "visible",
                        opacity: 1,
                        cursor: "pointer",
                      },
                    },
                  }}
                >
                  <Avatar
                    alt="Preview"
                    src={previewImage}
                    sx={{ width: "100%", height: "100%" }}
                  />
                  {/* <Box
                className="overlay-image"
                component="label"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "grid",
                  placeItems: "center",
                  visibility: "hidden",
                  opacity: 0,
                  transition: "all 0.4s ease",
                }}
              >
                <Iconify
                  icon="eva:edit-fill"
                  width={30}
                  sx={{ color: "white" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Box> */}
                </Box>
              </Box>

              {/* Student Data */}
              <Box sx={{ flex: 1 }}>
                {/* Student Name */}
                <Typography
                  variant="h4"
                  sx={{ color: "primary.main", mb: 1 }}
                >{`${detail?.first_name || ""} ${
                  detail?.last_name || ""
                }`}</Typography>
                <Card
                  sx={{
                    flex: 1,
                    background: "transparent",
                    border: "1px solid #b1b1b1",
                    overflow: "hidden",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        color: "primary.main",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "130px", fontWeight: 600 }}>
                          Gender :{" "}
                        </Typography>
                        <Typography>
                          {detail?.gender === "m"
                            ? "Male"
                            : detail?.gender === "f"
                            ? "Female"
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "130px", fontWeight: 600 }}>
                          D.O.B :{" "}
                        </Typography>
                        <Typography>
                          {detail?.dob
                            ? dayjs(detail?.dob).format("DD-MM-YYYY")
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "140px", fontWeight: 600 }}>
                          Payment Status :{" "}
                        </Typography>
                        <Typography>
                          {detail?.ad_paid === "1" ? "Paid" : "Unpaid"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        color: "primary.main",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "130px", fontWeight: 600 }}>
                          Paid :{" "}
                        </Typography>
                        <Typography>
                          {detail?.application_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "130px", fontWeight: 600 }}>
                          Submitted On :{" "}
                        </Typography>
                        <Typography>
                          {detail?.created_at
                            ? dayjs(detail?.created_at).format("DD-MM-YYYY")
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ width: "140px", fontWeight: 600 }}>
                          Interview Status :{" "}
                        </Typography>
                        <Typography>
                          {detail?.interview_status === "1"
                            ? "Cleared"
                            : "Not Cleared"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Action Section */}
            <Box sx={{ bgcolor: "primary.main", height: "50px", my: 4 }}></Box>

            {/* Student Details */}
            <Typography
              variant="h3"
              sx={{ textAlign: "center", color: "primary.main" }}
            >
              Admission Form for UKG 2025-26
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                my: 2,
              }}
            >
              {/* left side card */}
              <Card
                sx={{
                  background: "transparent",
                  border: "1px solid #b1b1b1",
                  height: "450px",
                  width: "350px",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    color: "primary.main",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Gender :{" "}
                    </Typography>
                    <Typography>
                      {detail?.gender === "m"
                        ? "Male"
                        : detail?.gender === "f"
                        ? "Female"
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      D.O.B :{" "}
                    </Typography>
                    <Typography>
                      {detail?.dob
                        ? dayjs(detail?.dob).format("DD-MM-YYYY")
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Email :{" "}
                    </Typography>
                    <Typography>{detail?.email || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      City :{" "}
                    </Typography>
                    <Typography>{detail?.city || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      State :{" "}
                    </Typography>
                    <Typography>{detail?.state || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Country :{" "}
                    </Typography>
                    <Typography>{detail?.country || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Pincode :{" "}
                    </Typography>
                    <Typography>{detail?.pincode || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Blood Group :{" "}
                    </Typography>
                    <Typography>{detail?.blood_group || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Aadhaar No :{" "}
                    </Typography>
                    <Typography>{detail?.aadhaar_id || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      ITS :{" "}
                    </Typography>
                    <Typography>{detail?.st_its_id || "N/A"}</Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* right side card */}
              <Card
                sx={{
                  background: "transparent",
                  border: "1px solid #b1b1b1",
                  height: "450px",
                  width: "350px",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    color: "primary.main",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      alt={detail?.father_name || "N/A"}
                      src={detail?.father_photo_url}
                    />
                    <Typography>{detail?.father_name || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Mobile :{" "}
                    </Typography>
                    <Typography>{detail?.father_mobile || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Email :{" "}
                    </Typography>
                    <Typography>{detail?.father_email || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Occupation :{" "}
                    </Typography>
                    <Typography>
                      {detail?.father_occupation || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      alt={detail?.mother_name || "N/A"}
                      src={detail?.mother_photo_url}
                    />
                    <Typography>{detail?.mother_name || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Mobile :{" "}
                    </Typography>
                    <Typography>{detail?.mother_mobile || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Email :{" "}
                    </Typography>
                    <Typography>{detail?.mother_email || "N/A"}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ width: "130px", fontWeight: 600 }}>
                      Occupation :{" "}
                    </Typography>
                    <Typography>
                      {detail?.mother_occupation || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Other Information */}
            <Box sx={{ px: 4 }}>
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: "primary.main", mt: 2 }}
              >
                Other Information:
              </Typography>
              <List>
                <ListItem sx={{ alignItems: "start" }}>
                  <ListItemIcon sx={{ fontWeight: 500, color: "primary.main" }}>
                    1.
                  </ListItemIcon>
                  <ListItemText
                    primary="What attracted you to our school?"
                    secondary={detail?.attracted || "N/A"}
                    slotProps={{
                      primary: {
                        typography: {
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        },
                      },
                      secondary: { typography: { color: "black" } },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ alignItems: "start" }}>
                  <ListItemIcon sx={{ fontWeight: 500, color: "primary.main" }}>
                    2.
                  </ListItemIcon>
                  <ListItemText
                    primary="Strengths and weaknesses of your child?"
                    secondary={detail?.strengths || "N/A"}
                    slotProps={{
                      primary: {
                        typography: {
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        },
                      },
                      secondary: { typography: { color: "black" } },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ alignItems: "start" }}>
                  <ListItemIcon sx={{ fontWeight: 500, color: "primary.main" }}>
                    3.
                  </ListItemIcon>
                  <ListItemText
                    primary="Other Remarks"
                    secondary={detail?.remarks || "N/A"}
                    slotProps={{
                      primary: {
                        typography: {
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        },
                      },
                      secondary: { typography: { color: "black" } },
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default NewAdmissionsDetail;
