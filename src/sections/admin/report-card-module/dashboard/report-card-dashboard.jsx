import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Radio,
  TablePagination,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useGetApi } from "../../../../hooks/useGetApi";
import { getAllClassGroup } from "../../../../services/admin/classes.service";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import Iconify from "../../../../components/iconify/iconify";
import {
  DEFAULT_LIMIT,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import useAuth from "../../../../hooks/useAuth";
import { getAllAcademicYears } from "../../../../services/admin/students-management.service";
import { useNavigate } from "react-router-dom";
import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import { toast } from "react-toastify";

const STATUS_LIST = ["Pending", "Locked", "Verified"];

const ReportCardDashboard = () => {
  const theme = useTheme();
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    ay_id: { ay_id: userInfo?.ay_id, ay_name: userInfo?.ay_name },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendToBackend = {
    search: search || "",
    ay_id: formData?.ay_id?.ay_id || "",
  };

  // open bulk action menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // function to export students data as pdf
  const handleExport = async (type) => {
    handleMenuClose();
    // setIsExportLoading(true);
    // const response = await exportStudents({
    //   ...dataSendToBackend,
    //   type: type,
    // });
    // setIsExportLoading(false);

    // if (response?.code === 200) {
    //   const link = document.createElement("a");
    //   link.href = response?.data?.file_url || "";
    //   link.target = "_blank"; // Open in a new tab
    //   link.rel = "noopener noreferrer"; // Add security attributes

    //   // Append the link to the document and trigger the download
    //   document.body.appendChild(link);
    //   link.click();

    //   // Remove the link after triggering the download
    //   document.body.removeChild(link);

    //   toast.success(response?.message || "File downloaded successfully!");
    // } else if (response?.code === 401) {
    //   logout(response);
    //   // toast.error(response?.message || "Unauthorized");
    // } else {
    //   toast.error(response?.message || "Some error occurred.");
    // }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  // change to next or prev page
  const handleChangePage = (_, newPage) => {
    if (!isLoading) setPage(newPage);
  };

  // change rows per page
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleCardClick = (option) => {
    navigate("/report-card-module/marks-grade-entry", {
      state: { ...option, ay_id: formData?.ay_id?.ay_id || userInfo?.ay_id },
    });
  };

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  // api to get classList
  const {
    dataList: classList,
    dataCount: classCount,
    isLoading,
    isError,
  } = useGetApi({
    apiFunction: getAllClassGroup,
    body: {
      ay_id: formData?.ay_id?.ay_id || userInfo?.ay_id,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      search,
    },
    dependencies: [page, rowsPerPage, search, formData?.ay_id],
    debounceDelay: 500,
  });

  // if no search result is found
  const notFound = !classCount;

  return (
    <Box>
      {/* header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 2,
          my: 2,
        }}
      >
        <TextField
          placeholder="Roll No"
          size="small"
          sx={{ bgcolor: "white" }}
        />
        {/* Bulk Actions */}
        <Box>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            endIcon={anchorEl ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            disabled={isExportLoading}
          >
            {isExportLoading ? <CircularProgress size={24} /> : `Bulk Actions`}
          </Button>

          {/* Menu  */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ color: "primary.main" }}
          >
            {/* export excel */}
            <MenuItem
              onClick={() => handleExport("excel")}
              sx={{ color: "primary.main" }}
            >
              <Iconify icon="uiw:file-excel" sx={{ mr: 1 }} />
              Export Excel
            </MenuItem>

            {/* export pdf */}
            <MenuItem
              onClick={() => handleExport("pdf")}
              sx={{ color: "primary.main" }}
            >
              <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} />
              Export PDF
            </MenuItem>

            {/* individual report */}
            <MenuItem sx={{ color: "primary.main" }} onClick={handleMenuClose}>
              {/* <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} /> */}
              Individual Report
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Card>
        <CardContent>
          {/* header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 2,
            }}
          >
            <TextField
              value={search || ""}
              onChange={handleSearch}
              placeholder="Search by class name..."
              size="small"
              sx={{ width: "200px" }}
            />
            <Autocomplete
              options={STATUS_LIST || []}
              renderInput={(params) => (
                <TextField {...params} label="Status" size="small" />
              )}
              value={formData?.status || null}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "status", value: newValue } })
              }
              sx={{ width: "200px" }}
            />
            <Autocomplete
              options={academicYearList || []}
              getOptionLabel={(option) => option?.ay_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Select Year" size="small" />
              )}
              value={formData?.ay_id || null}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "ay_id", value: newValue } })
              }
              sx={{ width: "200px" }}
            />
          </Box>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <MessageBox />
          ) : (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                {classList?.map((option) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={option?.cg_id}>
                    <Box
                      sx={{
                        height: "150px",
                        width: "100%",
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(option)}
                    >
                      <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                        <Radio defaultChecked color="error" />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          height: "calc(100% - 35px)",
                          textAlign: "center",
                          p: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "primary.main",
                            fontSize: { xs: "16px", md: "18px", xl: "20px" },
                            fontWeight: { xs: 500, md: 600 },
                            lineHeight: 1.2,
                          }}
                        >
                          {option?.cg_name || ""}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "14px", md: "15px", xl: "16px" },
                            lineHeight: 1.2,
                          }}
                        >
                          {option?.class_teacher_name || ""}
                        </Typography>
                      </Box>
                      {/* bottom */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          py: 0.5,
                          px: 1,
                          width: "100%",
                          height: "35px",
                        }}
                      >
                        <Iconify
                          icon="mdi-light:printer"
                          sx={{ cursor: "pointer" }}
                        />

                        <Iconify
                          icon="carbon:report-data"
                          sx={{ cursor: "pointer" }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {notFound && (
                <Box
                  sx={{
                    height: "150px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    No Data Found
                  </Typography>
                </Box>
              )}
              {/* Pagination */}

              <TablePagination
                page={page}
                component="div"
                count={classCount}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportCardDashboard;
