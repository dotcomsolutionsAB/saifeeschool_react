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
  TYPE_LIST,
} from "../../../../../utils/constants";
import { useGetApi } from "../../../../../hooks/useGetApi";
import TableEmptyRows from "../../../../../components/table/table-empty-rows";
import TableNoData from "../../../../../components/table/table-no-data";
import MessageBox from "../../../../../components/error/message-box";
import Loader from "../../../../../components/loader/loader";
import { getAllFeePlan } from "../../../../../services/fee-plan.service";
import AddNewFeePlanModal from "../modals/add-new-fee-plan-modal";
import OneTimeFeesTableRow from "../table-rows/one-time-fees-table-row";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "fp_name", label: "Name" },
  { id: "last_due_date", label: "Due Date" },
  { id: "last_fpp_amount", label: "Amount" },
  { id: "applied_students", label: "Applied To Count" },
  { id: "actions", label: "Actions" },
];

const OneTimeFees = ({ academicYear, open, onClose }) => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [selectedRows, setSelectedRows] = useState([]);

  // api to get admission fees list

  const {
    dataList: feesList,
    dataCount: feesCount,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getAllFeePlan,
    body: {
      ay_id: Number(academicYear?.ay_id),
      type: "one_time",
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
  });

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = feesList?.map((n) => n?.fp_id);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (fp_id) => {
    const selectedIndex = selectedRows?.indexOf(fp_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selectedRows, fp_id);
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
  const notFound = !feesCount;

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
                        selectedRows?.filter((fp_id) =>
                          feesList?.some((student) => student?.fp_id === fp_id)
                        )?.length > 0 &&
                        selectedRows?.filter((fp_id) =>
                          feesList?.some((student) => student?.fp_id === fp_id)
                        )?.length < feesList?.length
                      }
                      checked={
                        feesList?.length > 0 &&
                        selectedRows?.filter((fp_id) =>
                          feesList?.some((student) => student?.fp_id === fp_id)
                        )?.length === feesList?.length
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
                      {headCell?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {feesList?.map((row) => {
                  const isRowSelected =
                    selectedRows?.indexOf(row?.fp_id) !== -1;

                  return (
                    <OneTimeFeesTableRow
                      key={row?.fp_id}
                      isRowSelected={isRowSelected}
                      handleClick={handleClick}
                      row={row}
                      refetch={refetch}
                      academicYear={academicYear}
                    />
                  );
                })}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, feesCount)}
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
          count={feesCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* modal */}

        <AddNewFeePlanModal
          open={open}
          onClose={onClose}
          academicYear={academicYear}
          refetch={refetch}
          type={TYPE_LIST[2]}
        />
      </Box>
    </>
  );
};

OneTimeFees.propTypes = {
  academicYear: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default OneTimeFees;
