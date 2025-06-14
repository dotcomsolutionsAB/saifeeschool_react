import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../../components/table/table-no-data";
import TableEmptyRows from "../../../../components/table/table-empty-rows";

import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import {
  getProductCategory,
  getSuppliers,
  getUnits,
} from "../../../../services/admin/procurement.service";
import AddNewSupplierModal from "./modals/add-new-supplier-modal";
import SuppliersTableRow from "./suppliers-table-row";
import { Helmet } from "react-helmet-async";
import AddNewProductModal from "../products/modals/add-new-product-modal";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "company", label: "Company" },
  { id: "name", label: "Name" },
  { id: "mobile", label: "Contact Details" },
  { id: "address", label: "Address" },
  { id: "", label: "", align: "center" },
];

export default function Suppliers() {
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  // api to get suppliers list
  const {
    dataList: suppliersList,
    dataCount: suppliersCount,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getSuppliers,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage],
  });

  // api to get productCategoryList for modal
  const { allResponse: productCategoryList } = useGetApi({
    apiFunction: getProductCategory,
  });

  // api to get units list
  const { dataList: unitsList } = useGetApi({
    apiFunction: getUnits,
    body: {
      offset: 0,
      limit: 200,
    },
  });

  const handleSupplierModalOpen = () => {
    setSupplierModalOpen(true);
  };

  const handleSupplierModalClose = () => {
    setSupplierModalOpen(false);
  };
  const handleProductModalOpen = () => {
    setProductModalOpen(true);
  };

  const handleProductModalClose = () => {
    setProductModalOpen(false);
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
  const notFound = !suppliersCount;

  return (
    <>
      <Helmet>
        <title>Suppliers | SAIFEE</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
            width: "100%",
          }}
        >
          <Typography variant="h4">Suppliers</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Add New Supplier */}
            <Button variant="contained" onClick={handleSupplierModalOpen}>
              + Add New Supplier
            </Button>
            {/* Add New Product */}
            <Button variant="contained" onClick={handleProductModalOpen}>
              + Add New Product
            </Button>
          </Box>
          {/*Supplier Modal */}
          <AddNewSupplierModal
            open={supplierModalOpen}
            onClose={handleSupplierModalClose}
            refetch={refetch}
            gstinTypeList={["Registered", "Unregistered"]}
          />
          {/*Product Modal */}
          <AddNewProductModal
            open={productModalOpen}
            onClose={handleProductModalClose}
            refetch={refetch}
            productCategoryList={
              productCategoryList?.categories?.filter((option) => !!option) ||
              []
            }
            unitsList={unitsList || []}
          />
        </Box>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
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
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {suppliersList?.map((row, index) => (
                  <SuppliersTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    row={row}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, suppliersCount)}
                />

                {notFound && <TableNoData query="" />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={suppliersCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
