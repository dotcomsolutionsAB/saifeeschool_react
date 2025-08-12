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
  unitsList,
  handleChange,
  handleRemoveItem,
}) => {
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
              { target: { name: "product", value: newValue } },
              index,
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
              onChange={(e) => handleChange(e, index, "items")}
              fullWidth
              size="small"
              slotProps={{ input: { min: 0 } }}
            />
          </Grid>
          <Grid item xs>
            <Autocomplete
              options={unitsList || []}
              getOptionLabel={(option) => option?.toUpperCase() || ""}
              renderInput={(params) => (
                <TextField {...params} label="Unit" name="unit" size="small" />
              )}
              value={row?.unit || null}
              onChange={(_, newValue) => {
                handleChange(
                  { target: { name: "unit", value: newValue } },
                  index,
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
              onChange={(e) => handleChange(e, index, "items")}
              fullWidth
              size="small"
              slotProps={{ input: { min: 0 } }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="Discount (%)"
              name="discount"
              value={row?.discount || ""}
              onChange={(e) => handleChange(e, index, "items")}
              fullWidth
              size="small"
              slotProps={{ input: { min: 0, max: 100 } }}
            />
          </Grid>
        </Grid>
      </TableCell>
      <TableCell colSpan={5}>
        <TextField
          label="Product Description"
          name="description"
          value={row?.description || ""}
          onChange={(e) => handleChange(e, index, "items")}
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
              onChange={(e) => handleChange(e, index, "items")}
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
                onChange={(e) => handleChange(e, index, "items")}
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
              name="Gross"
              value={row?.Gross ?? ""}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Tax"
              name="tax_amount"
              value={row?.tax_amount ?? ""}
              fullWidth
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Total"
              name="Total"
              value={row?.Total ?? ""}
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
  unitsList: PropTypes.array,
  handleChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
};

export default PurchaseInvoiceItems;
