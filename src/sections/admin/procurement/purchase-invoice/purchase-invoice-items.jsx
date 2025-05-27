import PropTypes from "prop-types";
import {
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const PurchaseInvoiceItems = ({
  index,
  row,
  productsList,
  handleChange,
  handleRemoveItem,
}) => {
  const gross =
    (Number(row?.quantity) || 0) * (Number(row?.price) || 0) -
    ((Number(row?.quantity) || 0) *
      (Number(row?.price) || 0) *
      (Number(row?.discount) || 0)) /
      100;

  const tax_total = (gross * ((Number(row?.tax) || 0) / 2)) / 100;

  const total = gross + (Number(row?.cgst) || 0) + (Number(row?.sgst) || 0);

  return (
    <TableRow tabIndex={-1}>
      <TableCell>{index + 1}</TableCell>

      <TableCell colSpan={4}>
        <Autocomplete
          getOptionLabel={(option) => option?.name || ""}
          options={productsList?.filter((option) => !!option?.name) || []}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Product"
              name="product"
              size="small"
            />
          )}
          value={row?.product || null}
          onChange={(_, newValue) => {
            handleChange(
              index,
              { target: { name: "product", value: newValue } },
              "items"
            );
          }}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              type="number"
              label="Qty"
              name="quantity"
              value={row?.quantity || ""}
              onChange={(e) => handleChange(index, e, "items")}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs>
            <Autocomplete
              options={["pcs", "nos"]}
              getOptionLabel={(option) => option?.toUpperCase() || ""}
              renderInput={(params) => (
                <TextField {...params} label="Unit" name="unit" size="small" />
              )}
              value={row?.unit || null}
              onChange={(_, newValue) => {
                handleChange(
                  index,
                  { target: { name: "unit", value: newValue } },
                  "items"
                );
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="Price"
              name="price"
              value={row?.price || ""}
              onChange={(e) => handleChange(index, e, "items")}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="Discount"
              name="discount"
              value={row?.discount || ""}
              onChange={(e) => handleChange(index, e, "items")}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </TableCell>
      <TableCell colSpan={5}>
        <TextField
          label="Product Description"
          name="description"
          value={row?.description || ""}
          onChange={(e) => handleChange(index, e, "items")}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              label="HSN"
              name="hsn"
              value={row?.hsn || ""}
              onChange={(e) => handleChange(index, e, "items")}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs>
            <FormControl fullWidth size="small">
              <InputLabel id="tax_percentage_id">Tax (%)</InputLabel>
              <Select
                labelId="tax_percentage_id"
                label="Tax (%)"
                name="tax"
                value={row?.tax ?? ""}
                onChange={(e) => handleChange(index, e, "items")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={28}>28</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs>
            <TextField
              label="Gross"
              name="gross"
              value={gross ?? ""}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Tax"
              name="tax"
              value={tax_total ?? ""}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Total"
              name="total"
              value={total ?? ""}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
        </Grid>
      </TableCell>

      <TableCell align="center">
        <IconButton
          sx={{
            cursor: "pointer",
            bgcolor: "primary.light",
            color: "primary.main",
            borderRadius: 0.5,
            "&:hover": {
              bgcolor: "primary.lightHover",
              color: "primary.dark",
            },
          }}
          onClick={() => handleRemoveItem(index)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

PurchaseInvoiceItems.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  productsList: PropTypes.array,
  handleChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
};

export default PurchaseInvoiceItems;
