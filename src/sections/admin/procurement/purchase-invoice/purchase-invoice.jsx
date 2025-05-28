import { useEffect, useRef, useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
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
import PurchaseInvoiceTableRow from "./purchase-invoice-table-row";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  createPurchase,
  getProducts,
  getPurchases,
  getSuppliers,
  updatePurchase,
} from "../../../../services/admin/procurement.service";
import PurchaseInvoiceItems from "./purchase-invoice-items";
// ----------------------------------------------------------------------

const PRODUCTS_HEAD_LABEL = [
  { id: "", label: "" },
  { id: "qty", label: "Quantity" },
  { id: "unit", label: "Unit" },
  { id: "price", label: "Price" },
  { id: "discount", label: "Discount" },
  { id: "hsn", label: "HSN" },
  { id: "tax_percentage", label: "Tax (%)" },
  { id: "gross", label: "Gross" },
  { id: "tax", label: "Tax" },
  { id: "total", label: "Total" },
  { id: "", label: "", align: "center" },
];
const HEAD_LABEL = [
  { id: "", label: "" },
  { id: "supplier", label: "Supplier" },
  { id: "invoice", label: "Invoice" },
  { id: "date", label: "Date" },
  { id: "amount", label: "Amount" },
  { id: "", label: "", align: "center" },
];

export default function PurchaseInvoice() {
  const { logout } = useAuth();
  const topRef = useRef(null);

  const initialState = {
    supplier: "",
    purchase_invoice_no: "",
    purchase_invoice_date: null,
    series: "",
    currency: "",
    total: 0,
    paid: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    status: 1,
    items: [
      {
        product: null,
        description: "",
        quantity: 0,
        unit: "",
        price: 0,
        discount: 0,
        hsn: "",
        tax: 0,
        tax_amount: 0,
        Gross: 0,
        Total: 0,
      },
    ],
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [formData, setFormData] = useState(initialState);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // api to get suppliers list
  const { dataList: suppliersList } = useGetApi({
    apiFunction: getSuppliers,
    body: {
      offset: 0,
      limit: 200,
    },
  });

  // api to get products list
  const { allResponse: productsAllResponse } = useGetApi({
    apiFunction: getProducts,
    body: {
      offset: 0,
      limit: 200,
    },
  });

  // api to get bank transaction list
  const { allResponse, isLoading, isError, refetch, errorMessage } = useGetApi({
    apiFunction: getPurchases,
    body: {
      search,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search],
    debounceDelay: 500,
  });

  const handleChange = (e, index, key = null) => {
    const { name, value, type } = e.target;

    // Parse value based on input type
    const parsedValue =
      type === "date"
        ? dayjs(value).format("YYYY-MM-DD")
        : type === "number"
        ? Number(value)
        : value;

    // Handle nested updates for arrays (e.g., product items)
    if (key && Array.isArray(formData?.[key])) {
      setFormData((prevData) => ({
        ...prevData,
        [key]: prevData?.[key]?.map((item, i) => {
          if (i !== index) return item;

          // If product is being selected, use full product object to update
          if (name === "product" && typeof parsedValue === "object") {
            const price = Number(parsedValue?.price) || 0;
            const discount = Number(parsedValue?.discount) || 0;
            const tax = Number(parsedValue?.tax) || 0;

            const gross = price - (price * discount) / 100;
            const tax_amount = (gross * (tax / 2)) / 100;
            const total =
              gross +
              (Number(parsedValue?.cgst) || 0) +
              (Number(parsedValue?.sgst) || 0);

            return {
              ...item,
              product: parsedValue,
              description: parsedValue?.description,
              quantity: 1,
              unit: parsedValue?.unit,
              price: parsedValue?.price,
              discount: parsedValue?.discount,
              hsn: parsedValue?.hsn,
              tax: parsedValue?.tax,
              Gross: gross,
              tax_amount,
              Total: total,
            };
          }

          // Otherwise, update the specific field and recalculate totals
          const updatedItem = {
            ...item,
            [name]: parsedValue,
          };

          const price = Number(updatedItem?.price) || 0;
          const discount = Number(updatedItem?.discount) || 0;
          const tax = Number(updatedItem?.tax) || 0;

          const gross = price - (price * discount) / 100;
          const tax_amount = (gross * (tax / 2)) / 100;
          const total =
            gross +
            (Number(updatedItem?.cgst) || 0) +
            (Number(updatedItem?.sgst) || 0);

          return {
            ...updatedItem,
            Gross: gross,
            tax_amount,
            Total: total,
          };
        }),
      }));
      return;
    }

    // Handle top-level form field
    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItems = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: null,
          description: "",
          quantity: 0,
          unit: "",
          price: 0,
          discount: 0,
          hsn: "",
          tax: 0,
          Gross: 0,
          tax_amount: 0,
          Total: 0,
        },
      ],
    }));
  };

  console.log(formData?.items, "items");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setLoading(true);
    if (formData?.id) {
      response = await updatePurchase(formData);
    } else {
      response = await createPurchase(formData);
    }
    setLoading(false);

    if (response?.code === 200) {
      setFormData(initialState);
      refetch();
      toast.success(response?.message || "Purchase invoice added successfully");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const notFound = !allResponse?.total_records && !!search;

  useEffect(() => {
    let grossTotal = 0;
    let totalTax = 0;

    formData?.items?.forEach((item) => {
      const quantity = Number(item?.quantity) || 0;
      const price = Number(item?.price) || 0;
      const discount = Number(item?.discount) || 0;
      const tax = Number(item?.tax) || 0;

      const itemGross = quantity * price - (quantity * price * discount) / 100;
      const itemTax = (itemGross * (tax / 2)) / 100;

      grossTotal += itemGross;
      totalTax += itemTax;
    });

    const roundOff = Number(
      Math.abs(totalTax - Math.round(totalTax)).toFixed(2)
    );

    const freight = Number(formData?.freight) || 0;
    const grandTotal = freight + grossTotal + totalTax + roundOff;

    setFormData((prev) => ({
      ...prev,
      gross: grossTotal.toFixed(2),
      total: grandTotal.toFixed(2),
      tax: totalTax.toFixed(2),
      round_off: roundOff,
    }));
  }, [formData?.items, formData?.freight]);

  return (
    <>
      <Helmet>
        <title>Purchase Invoice | SAIFEE</title>
      </Helmet>

      <Card sx={{ mt: 1 }} ref={topRef}>
        <CardContent>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="h5">Purchase Invoice</Typography>
            <Typography variant="subtitle1" sx={{ ml: "auto" }}>
              {formData?.id
                ? `Update Purchase Invoice - ${formData?.sn}`
                : "Add Purchase Invoice"}
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Supplier */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Autocomplete
                  getOptionLabel={(option) => option?.name || ""}
                  options={
                    suppliersList?.filter((option) => !!option?.name) || []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Select Supplier"
                      required
                    />
                  )}
                  value={formData?.supplier || ""}
                  onChange={(_, newValue) =>
                    handleChange({
                      target: { name: "supplier", value: newValue },
                    })
                  }
                />
              </Grid>

              {/* Purchase Invoice */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="purchase_invoice_no"
                  label="Purchase Invoice"
                  required
                  fullWidth
                  size="small"
                  value={formData?.purchase_invoice_no || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Purchase Invoice Date */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DatePicker
                  name="purchase_invoice_date"
                  label="Purchase Invoice Date"
                  value={
                    formData?.purchase_invoice_date
                      ? dayjs(formData?.purchase_invoice_date)
                      : null
                  }
                  onChange={(newValue) =>
                    handleChange({
                      target: {
                        type: "date",
                        name: "purchase_invoice_date",
                        value: newValue,
                      },
                    })
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                  disableFuture
                />
              </Grid>

              {/* Purchase Invoice Series */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Autocomplete
                  options={["Primary", "Secondary"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Series"
                      required
                    />
                  )}
                  value={formData?.series || ""}
                  onChange={(_, newValue) =>
                    handleChange({
                      target: { name: "series", value: newValue },
                    })
                  }
                />
              </Grid>

              {/* Currency*/}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Autocomplete
                  options={[
                    // "INR - Indian Rupee",
                    // "AED - Emirati Dirham",
                    // "USD - United States Dollar",
                    // "EUR - Euro",
                    // "GBP - Great Britain Pound",
                    "INR",
                    "AED",
                    "USD",
                    "EUR",
                    "GBP",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Currency"
                      required
                    />
                  )}
                  value={formData?.currency || ""}
                  onChange={(_, newValue) =>
                    handleChange({
                      target: { name: "currency", value: newValue },
                    })
                  }
                />
              </Grid>

              {formData?.items?.length > 0 && (
                <Grid item xs={12}>
                  {/* Table */}
                  <TableContainer sx={{ overflowY: "unset" }}>
                    <Table sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow>
                          {PRODUCTS_HEAD_LABEL?.map((headCell) => (
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
                        {formData?.items?.map((row, index) => {
                          return (
                            <PurchaseInvoiceItems
                              key={row?.id || index}
                              row={row}
                              index={index}
                              handleChange={handleChange}
                              handleRemoveItem={handleRemoveItem}
                              productsList={
                                productsAllResponse?.item_record || []
                              }
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddItems}>
                  + Add
                </Button>
              </Grid>

              {formData?.items?.length > 0 && (
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl>
                      <TextField
                        type="number"
                        label="Freight"
                        name="freight"
                        value={formData?.freight || ""}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl>
                      <TextField
                        type="number"
                        label="Gross Total"
                        name="gross"
                        value={formData?.gross || ""}
                        fullWidth
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl>
                      <TextField
                        type="number"
                        label="Total Tax"
                        name="tax"
                        value={formData?.tax || ""}
                        fullWidth
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl>
                      <TextField
                        type="number"
                        label="Round Off"
                        name="round_off"
                        value={formData?.round_off || ""}
                        fullWidth
                        size="small"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl>
                      <TextField
                        type="number"
                        label="Grand Total"
                        name="total"
                        value={formData?.total || ""}
                        fullWidth
                        size="small"
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Button */}
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ ml: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : formData?.id ? (
                    "Update"
                  ) : (
                    `Submit`
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4, mb: 2, p: 2, width: "100%" }}>
        {/* Search */}
        <TextField
          value={search || ""}
          onChange={handleSearch}
          placeholder="Search"
          size="small"
          sx={{ mb: 2, width: "clamp(250px, 40%, 350px)" }}
        />
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <>
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
                  {allResponse?.purchase_records?.map((row, index) => {
                    return (
                      <PurchaseInvoiceTableRow
                        key={row?.id || index + page * rowsPerPage}
                        row={row}
                        index={index}
                        refetch={refetch}
                        setFormData={setFormData}
                        handleScrollToTop={handleScrollToTop}
                      />
                    );
                  })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(
                      page,
                      rowsPerPage,
                      allResponse?.total_records
                    )}
                  />

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={allResponse?.total_records ?? 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
