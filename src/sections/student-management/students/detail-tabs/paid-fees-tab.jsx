import PropTypes from "prop-types";
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
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { DEFAULT_LIMIT, emptyRows } from "../../../../utils/constants";
import { useGetApi } from "../../../../hooks/useGetApi";
import TableEmptyRows from "../../../../components/table/table-empty-rows";
import TableNoData from "../../../../components/table/table-no-data";
import MessageBox from "../../../../components/error/message-box";
import Loader from "../../../../components/loader/loader";
import { getAllPaidFees } from "../../../../services/students-management.service";
import PaidFeesTableRow from "./paid-fees-table-row";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "fpp_name", label: "Fee" },
  { id: "fpp_amount", label: "Fee Amount" },
  { id: "fpp_due_date", label: "Due Date" },
  { id: "f_concession", label: "Concession" },
  { id: "fpp_late_fee", label: "Late Fee" },
  { id: "total_amount", label: "Total Amount" },
  { id: "actions", label: "Actions" },
];

export default function PaidFees({ detail }) {
  const { logout } = useAuth();

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [selectedRows, setSelectedRows] = useState([]);

  // api to get students list

  const {
    dataList: transferCertificateList,
    dataCount: transferCertificateCount,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getAllPaidFees,
    body: {
      st_id: detail?.id,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage],
    debounceDelay: 500,
  });

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

  // if no search result is found
  const notFound = !transferCertificateCount;

  return (
    <>
      <Box sx={{ width: "100%" }}>
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
                    <PaidFeesTableRow
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

                {notFound && <TableNoData />}
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ textAlign: "right" }}>
          <Button variant="contained">Save</Button>
        </Box>
      </Box>
    </>
  );
}

PaidFees.propTypes = {
  detail: PropTypes.object,
};
