import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  TablePagination,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useGetApi } from "../../../../hooks/useGetApi";
import { getAllClassGroup } from "../../../../services/classes.service";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import Iconify from "../../../../components/iconify/iconify";
import AddNewClassModal from "./modals/add-new-class-modal";
import {
  DEFAULT_LIMIT,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";

const Classes = ({ academicYear }) => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const handleSearch = (e) => {
    setSearch(e.target.value);
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

  const handleModalOpen = (option) => {
    setModalOpen(true);
    setSelectedRow(option);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  // api to get classList

  const {
    dataList: classList,
    dataCount: classCount,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getAllClassGroup,
    body: {
      ay_id: academicYear?.ay_id,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      search,
    },
    dependencies: [page, rowsPerPage, search],
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
          justifyContent: "space-between",
          gap: 2,
          my: 2,
        }}
      >
        <TextField
          value={search || ""}
          onChange={handleSearch}
          placeholder="Search by class or name..."
          size="small"
          sx={{ flex: 1 }}
        />
        <Button variant="contained" size="large" onClick={handleModalOpen}>
          + Add New
        </Button>
        <AddNewClassModal
          open={modalOpen}
          onClose={handleModalClose}
          refetch={refetch}
          academicYear={academicYear}
          detail={selectedRow}
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
                  }}
                >
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Iconify icon="hugeicons:students" />
                      <Typography variant="body2" noWrap>
                        {option?.total_students ?? 0}
                      </Typography>
                    </Box>
                    <Iconify
                      icon="lucide:edit"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleModalOpen(option)}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          {notFound && (
            <Box
              sx={{ height: "150px", display: "grid", placeItems: "center" }}
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
    </Box>
  );
};

Classes.propTypes = {
  academicYear: PropTypes.object,
};

export default Classes;
