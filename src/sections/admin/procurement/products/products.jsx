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
  TextField,
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
  getProducts,
  getUnits,
} from "../../../../services/admin/procurement.service";
import AddNewProductModal from "./modals/add-new-product-modal";
import ProductsTableRow from "./products-table-row";
import { Helmet } from "react-helmet-async";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "category", label: "Category" },
  { id: "sub_category", label: "Sub-Category" },
  { id: "unit", label: "Unit" },
  { id: "price", label: "Rate" },
  { id: "discount", label: "Discount" },
  { id: "hsn", label: "HSN" },
  { id: "", label: "", align: "center" },
];

export default function Products() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");

  // api to get products list
  const {
    dataCount: productsCount,
    allResponse,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getProducts,
    body: {
      search,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search],
    debounceDelay: 500,
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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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

  // if no search result is found
  const notFound = !productsCount && !!search;

  return (
    <>
      <Helmet>
        <title>Products | SAIFEE</title>
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
          <Typography variant="h4">Products</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Search */}
            <TextField
              value={search || ""}
              onChange={handleSearch}
              placeholder="Search"
              size="small"
            />
            {/* Add New */}
            <Button variant="contained" onClick={handleModalOpen}>
              + Add New
            </Button>
          </Box>

          {/* Modal */}
          <AddNewProductModal
            open={modalOpen}
            onClose={handleModalClose}
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
                {allResponse?.item_record?.map((row, index) => (
                  <ProductsTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    row={row}
                    productCategoryList={
                      productCategoryList?.categories?.filter(
                        (option) => !!option
                      ) || []
                    }
                    unitsList={unitsList || []}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, productsCount)}
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
          count={productsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
