import PropTypes from "prop-types";
import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { printTCPdf } from "../../../../services/admin/report-card-module.service";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import CreateEditTCModal from "./modals/create-edit-tc-modal";
import dayjs from "dayjs";

const TransferCertificateTableRow = ({
  row,
  isRowSelected,
  handleClick,
  refetch,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tcEditModalOpen, setTcEditModalOpen] = useState(false);
  const [isPrintLoading, setIsPrintLoading] = useState(false);

  // open action menu open

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // transfer certificate modal handler

  const handleTcEditModalOpen = () => {
    setTcEditModalOpen(true);
  };

  const handleTcEditModalClose = () => {
    setTcEditModalOpen(false);
  };

  const handlePrint = async () => {
    setIsPrintLoading(true);
    const response = await printTCPdf(row);
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
      handleMenuClose();
      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout(response);
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={isRowSelected}
            onChange={() => handleClick(row?.id)}
          />
        </TableCell>
        <TableCell>{row?.st_roll_no || "-"}</TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          {row?.joining_date
            ? dayjs(row?.joining_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>

        <TableCell>
          {row?.leaving_date
            ? dayjs(row?.leaving_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>

        <TableCell align="center">
          <IconButton sx={{ cursor: "pointer" }} onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
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
        {isPrintLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <MenuItem onClick={handlePrint} sx={{ color: "primary.main" }}>
            <Iconify icon="mdi-light:printer" sx={{ mr: 1 }} />
            Print
          </MenuItem>
        )}

        <MenuItem
          onClick={handleTcEditModalOpen}
          sx={{ color: "primary.main" }}
        >
          <Iconify icon="basil:edit-outline" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </Menu>

      {/* Create TC Dialog */}
      <CreateEditTCModal
        open={tcEditModalOpen}
        onClose={handleTcEditModalClose}
        refetch={refetch}
        detail={row}
      />
    </>
  );
};

TransferCertificateTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  refetch: PropTypes.func,
};

export default TransferCertificateTableRow;
