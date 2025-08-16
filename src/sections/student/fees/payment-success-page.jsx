import PropTypes from "prop-types";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OpenInNew, TaskAltRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";

const HEAD_LABEL = [
  { id: "fpp_name", label: "Fee" },
  // { id: "fpp_amount", label: "Fee Amount" },
  // { id: "f_late_fee", label: "Late Fee" },
  { id: "f_total_paid", label: "Total Paid" },
  { id: "download_url", label: "Download Receipt", align: "center" },
];

const PaymentSuccessPage = ({
  transactionData,
  isLoading,
  isError,
  errorMessage,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100%",
      }}
    >
      <Typography variant="h3">THANK YOU !</Typography>
      <TaskAltRounded sx={{ fontSize: "120px", color: "success.main" }} />
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Transaction Successful
      </Typography>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        transactionData?.payment_status === "Completed" && (
          <TableContainer sx={{ overflowY: "unset" }}>
            <Table sx={{ minWidth: 350, width: "100%" }}>
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
                {transactionData?.fees_paid?.map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {row?.fpp_name || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {FORMAT_INDIAN_CURRENCY(row?.f_total_paid) || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant="contained"
                          LinkComponent={NavLink}
                          to={transactionData?.pdf_receipts?.[index]}
                          target="_blank"
                        >
                          <OpenInNew />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  );
};

PaymentSuccessPage.propTypes = {
  transactionData: PropTypes.object,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default PaymentSuccessPage;
