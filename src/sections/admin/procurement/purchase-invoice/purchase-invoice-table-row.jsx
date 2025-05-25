import PropTypes from "prop-types";
import {
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import {
  DEFAULT_LIMIT,
  emptyRows,
  FORMAT_INDIAN_CURRENCY,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";
import { deletePurchase } from "../../../../services/admin/procurement.service";
import TableEmptyRows from "../../../../components/table/table-empty-rows";
import TableNoData from "../../../../components/table/table-no-data";

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "product", label: "Product" },
  { id: "quantity", label: "Quantity" },
  { id: "rate", label: "Rate" },
  { id: "discount", label: "Discount" },
  { id: "hsn", label: "HSN" },
  { id: "tax", label: "Tax" },
];

const PurchaseInvoiceTableRow = ({
  row,
  index,
  refetch,
  setFormData,
  handleScrollToTop,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const productLength = row?.details?.products?.length;

  // open action menu open

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
    handleMenuClose();
  };

  const handleEdit = () => {
    setFormData({ ...row, sn: index + 1 });
    handleMenuClose();
    setTimeout(() => {
      handleScrollToTop();
    }, 200); // Delay to allow Menu to fully close before scrolling
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deletePurchase(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Item deleted successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  // change to next or prev page

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // change rows per page
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // if no search result is found
  const notFound = !productLength;

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell>{row?.details?.supplier || "-"}</TableCell>
        <TableCell>{row?.details?.purchase_invoice_no || "-"}</TableCell>

        <TableCell>
          {row?.details?.purchase_invoice_date
            ? dayjs(row?.details?.purchase_invoice_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.details?.total) || ""}
        </TableCell>

        <TableCell align="center">
          <IconButton sx={{ cursor: "pointer" }} onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Expandable row */}
      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              {/* Table */}
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
                          <TableSortLabel hideSortIcon>
                            {headCell?.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {row?.details?.products?.map((row, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row?.product || "-"}</TableCell>
                          <TableCell>{row?.quantity || "-"}</TableCell>
                          <TableCell>{row?.price || "-"}</TableCell>
                          <TableCell>{row?.discount || "0"}</TableCell>
                          <TableCell>{row?.hsn || "-"}</TableCell>
                          <TableCell>{row?.tax || "0"}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, productLength)}
                  />

                  {notFound && <TableNoData query="" />}
                </Table>
              </TableContainer>

              {/* Pagination */}

              <TablePagination
                page={page}
                component="div"
                count={productLength ?? 0}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Row-Specific Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ color: "primary.main" }}
      >
        <MenuItem onClick={handleEdit} sx={{ color: "primary.main" }}>
          <Iconify icon="basil:edit-outline" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleConfirmationModalOpen}
          sx={{ color: "primary.main" }}
        >
          <Delete fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this purchase invoice?"
      />
    </>
  );
};

PurchaseInvoiceTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  setFormData: PropTypes.func,
  handleScrollToTop: PropTypes.func,
  index: PropTypes.number,
};

export default PurchaseInvoiceTableRow;
