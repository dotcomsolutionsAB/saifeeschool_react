import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { Box, TableCell, TableHead, TableRow } from "@mui/material";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
  TYPE_LIST,
} from "../../../../../../utils/constants";
import { useGetApi } from "../../../../../../hooks/useGetApi";
import TableEmptyRows from "../../../../../../components/table/table-empty-rows";
import TableNoData from "../../../../../../components/table/table-no-data";
import MessageBox from "../../../../../../components/error/message-box";
import Loader from "../../../../../../components/loader/loader";
import { getAllFeePlan } from "../../../../../../services/admin/fee-plan.service";
import AddNewFeePlanModal from "../modals/add-new-fee-plan-modal";
import RecurringFeesTableRow from "../table-rows/recurring-fees-table-row";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "fp_name", label: "Name" },
  { id: "last_due_date", label: "Due Date" },
  { id: "last_fpp_amount", label: "Amount" },
  { id: "applied_students", label: "Applied To Count" },
  { id: "actions", label: "Actions" },
];

const RecurringFees = ({ academicYear, open, onClose }) => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

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
      type: "recurring",
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage],
  });

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
                  return (
                    <RecurringFeesTableRow
                      key={row?.fp_id}
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
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* modal */}

        <AddNewFeePlanModal
          open={open}
          onClose={onClose}
          academicYear={academicYear}
          refetch={refetch}
          type={TYPE_LIST[3]}
        />
      </Box>
    </>
  );
};

RecurringFees.propTypes = {
  academicYear: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default RecurringFees;
