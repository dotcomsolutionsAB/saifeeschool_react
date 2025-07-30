import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";
import { printFees } from "../../../services/student/fees.service";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import Iconify from "../../../components/iconify/iconify";

const PaidFeesTableRow = ({ row }) => {
  const { logout } = useAuth();
  const [isPrintLoading, setIsPrintLoading] = useState(false);

  const handlePrint = async () => {
    setIsPrintLoading(true);
    const response = await printFees(row?.id);
    setIsPrintLoading(false);

    if (response?.code === 200) {
      const link = document.createElement("a");
      link.href = response?.data?.file_url || "";
      link.target = "_blank"; // Open in a new tab
      link.rel = "noopener noreferrer"; // Add security attributes

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link after triggering the download
      document.body.removeChild(link);
      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          <Box>
            <Typography>
              ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_amount) || ""}
            </Typography>
            {Number(row?.fpp_late_fee) > 0 &&
              row?.f_late_fee_applicable === "1" && (
                <Typography sx={{ color: "error.main" }}>
                  ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_late_fee) || "0"}
                </Typography>
              )}
            {Number(row?.f_concession) > 0 && (
              <Typography sx={{ color: "success.main" }}>
                ₹ {FORMAT_INDIAN_CURRENCY(row?.f_concession) || "0"}
              </Typography>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Typography noWrap>
            {row?.fpp_due_date
              ? dayjs(row?.fpp_due_date).format("YYYY-MM-DD")
              : "-"}
          </Typography>
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.total_amount) || "0"}
        </TableCell>
        <TableCell align="center">
          {isPrintLoading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={handlePrint}
            >
              <Iconify icon="mdi-light:printer" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

PaidFeesTableRow.propTypes = {
  row: PropTypes.object,
  detail: PropTypes.object,
};

export default PaidFeesTableRow;
