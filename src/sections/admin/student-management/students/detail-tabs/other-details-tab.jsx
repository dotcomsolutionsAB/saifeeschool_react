import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const OtherDetailsTab = ({ detail }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {/* left side card */}
      <Card
        sx={{
          background: "transparent",
          border: "1px solid #b1b1b1",
          height: "500px",
          width: "400px",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Gender :{" "}
            </Typography>
            <Typography>{detail?.gender || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              D.O.B :{" "}
            </Typography>
            <Typography>{detail?.dob || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Email :{" "}
            </Typography>
            <Typography>{detail?.email || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              City :{" "}
            </Typography>
            <Typography>{detail?.city || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              State :{" "}
            </Typography>
            <Typography>{detail?.state || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Country :{" "}
            </Typography>
            <Typography>{detail?.country || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Pincode :{" "}
            </Typography>
            <Typography>{detail?.pincode || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Blood Group :{" "}
            </Typography>
            <Typography>{detail?.blood_group || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Aadhaar No :{" "}
            </Typography>
            <Typography>{detail?.aadhaar_no || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              ITS :{" "}
            </Typography>
            <Typography>{detail?.its_id || "N/A"}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* right side card */}
      <Card
        sx={{
          background: "transparent",
          border: "1px solid #b1b1b1",
          height: "500px",
          width: "400px",
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "primary.main",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={detail?.father_name || "N/A"}
              src={detail?.father_photo}
            />
            <Typography>{detail?.father_name || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Mobile :{" "}
            </Typography>
            <Typography>{detail?.father_contact || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Email :{" "}
            </Typography>
            <Typography>{detail?.father_email || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Occupation :{" "}
            </Typography>
            <Typography>{detail?.father_occupation || "N/A"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={detail?.mother_name || "N/A"}
              src={detail?.mother_photo}
            />
            <Typography>{detail?.mother_name || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Mobile :{" "}
            </Typography>
            <Typography>{detail?.mother_contact || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Email :{" "}
            </Typography>
            <Typography>{detail?.mother_email || "N/A"}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ width: "130px", fontWeight: 600 }}>
              Occupation :{" "}
            </Typography>
            <Typography>{detail?.mother_occupation || "N/A"}</Typography>
          </Box>
          <Divider />
          <Typography sx={{ fontWeight: 600 }}>Address : </Typography>
          <Typography>{detail?.residential_address || "N/A"}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

OtherDetailsTab.propTypes = {
  detail: PropTypes.object,
};

export default OtherDetailsTab;
