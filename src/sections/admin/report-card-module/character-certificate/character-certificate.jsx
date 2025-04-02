import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
  Checkbox,
  CircularProgress,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  exportCCDetails,
  getCharacterCertificates,
} from "../../../../services/admin/report-card-module.service";
import TableEmptyRows from "../../../../components/table/table-empty-rows";
import TableNoData from "../../../../components/table/table-no-data";
import MessageBox from "../../../../components/error/message-box";
import Loader from "../../../../components/loader/loader";
import CreateEditCCModal from "./modals/create-edit-cc-modal";
import CharacterCertificateTableRow from "./character-certificate-table-row";
import CreateBulkCCModal from "./modals/create-bulk-cc-modal";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "registration_no", label: "CC No" },
  { id: "st_roll_no", label: "Roll No" },
  { id: "name", label: "Name" },
  { id: "leaving_date", label: "Date" },
  { id: "date_from", label: "Held In" },
  { id: "actions", label: "Actions", align: "center" },
];

export default function CharacterCertificate() {
  const { logout } = useAuth();

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [leavingDateFrom, setLeavingDateFrom] = useState(null);
  const [leavingDateTo, setLeavingDateTo] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const [ccCreateModalOpen, setCcCreateModalOpen] = useState(false);
  const [bulkCcCreateModalOpen, setBulkCcCreateModalOpen] = useState(false);

  const dataSendToBackend = {
    search: search || "",
    leaving_date_from: leavingDateFrom || "",
    leaving_date_to: leavingDateTo || "",
  };

  // api to get students list

  const {
    dataList: transferCertificateList,
    dataCount: transferCertificateCount,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getCharacterCertificates,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search, leavingDateFrom, leavingDateTo],
    debounceDelay: 500,
  });

  // function to export students data
  const handleExcelExport = async () => {
    setIsExportLoading(true);
    const response = await exportCCDetails({
      ...dataSendToBackend,
      type: "excel",
    });
    setIsExportLoading(false);

    if (response?.code === 200) {
      const link = document.createElement("a");
      link.href = response?.data?.file_url || "";
      link.target = "_blank"; // Open in a new tab
      link.rel = "noopener noreferrer"; // Add security attributes

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link after triggering the download
      document.body.removeChild(link);

      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  // character certificate modal handler

  const handleCcCreateModalOpen = () => {
    setCcCreateModalOpen(true);
  };

  const handleCcCreateModalClose = () => {
    setCcCreateModalOpen(false);
  };
  // bulk character certificate modal handler

  const handleBulkCcCreateModalOpen = () => {
    setBulkCcCreateModalOpen(true);
  };

  const handleBulkCcCreateModalClose = () => {
    setBulkCcCreateModalOpen(false);
  };

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = transferCertificateList?.map((n) => n?.id);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selectedRows?.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected?.concat(selectedRows?.slice(1));
    } else if (selectedIndex === selectedRows?.length - 1) {
      newSelected = newSelected?.concat(selectedRows?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected?.concat(
        selectedRows?.slice(0, selectedIndex),
        selectedRows?.slice(selectedIndex + 1)
      );
    }
    setSelectedRows(newSelected);
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

  // for searching
  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  // for filtering
  const handleChange = (field, value) => {
    switch (field) {
      case "leavingDateFrom":
        setLeavingDateFrom(value);
        break;
      case "leavingDateTo":
        setLeavingDateTo(value);
        break;
      default:
        break;
    }
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !transferCertificateCount && !!search;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
          mb: 1,
          width: "100%",
        }}
      >
        {/* Export Excel */}
        <Button
          variant="contained"
          onClick={handleExcelExport}
          disabled={isExportLoading}
          sx={{ bgcolor: "success.main", color: "success.contrastText" }}
        >
          {isExportLoading ? <CircularProgress size={24} /> : `Export Excel`}
        </Button>

        {/* Add Character Certificate */}
        <Button variant="contained" onClick={() => handleCcCreateModalOpen()}>
          +Add CC
        </Button>

        {/* Add Character Certificate */}
        <Button
          variant="contained"
          onClick={() => handleBulkCcCreateModalOpen()}
        >
          +Add Bulk CC
        </Button>

        {/* Create CC Dialog */}
        <CreateEditCCModal
          open={ccCreateModalOpen}
          onClose={handleCcCreateModalClose}
          refetch={refetch}
        />

        {/* Create Bulk CC Dialog */}
        <CreateBulkCCModal
          open={bulkCcCreateModalOpen}
          onClose={handleBulkCcCreateModalClose}
          refetch={refetch}
        />
      </Box>

      <Card sx={{ p: 2, width: "100%" }}>
        <Typography>Character Certificate</Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            my: 2,
          }}
        >
          <TextField
            value={search || ""}
            onChange={handleSearch}
            placeholder="Search by Name,CC No. or Roll No..."
            size="small"
            sx={{ width: "300px" }}
          />

          <DatePicker
            label="Date From"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={leavingDateFrom || null}
            onChange={(newDate) => handleChange("leavingDateFrom", newDate)}
          />
          <DatePicker
            label="Date To"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={leavingDateTo || null}
            onChange={(newDate) => handleChange("leavingDateTo", newDate)}
          />
        </Box>

        {/* Table */}

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox />
        ) : (
          <TableContainer sx={{ overflowY: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows?.filter((id) =>
                          transferCertificateList?.some(
                            (student) => student?.id === id
                          )
                        )?.length > 0 &&
                        selectedRows?.filter((id) =>
                          transferCertificateList?.some(
                            (student) => student?.id === id
                          )
                        )?.length < transferCertificateList?.length
                      }
                      checked={
                        transferCertificateList?.length > 0 &&
                        selectedRows?.filter((id) =>
                          transferCertificateList?.some(
                            (student) => student?.id === id
                          )
                        )?.length === transferCertificateList?.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {HEAD_LABEL?.map((headCell) => (
                    <TableCell
                      key={headCell?.id}
                      align={headCell?.align || "left"}
                      sx={{
                        width: headCell?.width,
                        minWidth: headCell?.minWidth,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {transferCertificateList?.map((row) => {
                  const isRowSelected = selectedRows?.indexOf(row?.id) !== -1;

                  return (
                    <CharacterCertificateTableRow
                      key={row?.id}
                      isRowSelected={isRowSelected}
                      row={row}
                      handleClick={handleClick}
                      refetch={refetch}
                    />
                  );
                })}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(
                    page,
                    rowsPerPage,
                    transferCertificateCount
                  )}
                />

                {notFound && <TableNoData query={search} />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={transferCertificateCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
