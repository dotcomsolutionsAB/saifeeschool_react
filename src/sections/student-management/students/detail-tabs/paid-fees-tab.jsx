import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { Box, Checkbox, TableCell, TableHead, TableRow } from "@mui/material";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
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
  { id: "f_concession", label: "Concession", width: "110px" },
  { id: "fpp_late_fee", label: "Late Fee", width: "110px" },
  { id: "total_amount", label: "Total Amount" },
  { id: "actions", label: "Actions" },
];

export default function PaidFees({ detail, academicYear }) {
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
      ay_id: Number(academicYear?.ay_id),
    },
    dependencies: [page, rowsPerPage, academicYear],
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
                  {/* <TableCell padding="checkbox">
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
                  </TableCell> */}
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
                      {headCell?.label}
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
                      detail={detail}
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
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
}

PaidFees.propTypes = {
  detail: PropTypes.object,
  academicYear: PropTypes.object,
};
