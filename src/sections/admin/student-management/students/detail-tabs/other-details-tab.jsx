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
            <Typography>{detail?.st_gender || "N/A"}</Typography>
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
            <Typography>{detail?.st_dob || "N/A"}</Typography>
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
            <Typography>{detail?.st_gmail_address || "N/A"}</Typography>
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
            <Typography>{detail?.details?.city || "N/A"}</Typography>
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
            <Typography>{detail?.details?.state || "N/A"}</Typography>
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
            <Typography>{detail?.details?.country || "N/A"}</Typography>
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
            <Typography>{detail?.details?.pincode || "N/A"}</Typography>
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
            <Typography>{detail?.st_blood_group || "N/A"}</Typography>
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
            <Typography>{detail?.aadhaar_id || "N/A"}</Typography>
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
            <Typography>{detail?.st_its_id || "N/A"}</Typography>
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
              alt={detail?.details?.f_name || "N/A"}
              src={detail?.details?.f_photo_url}
            />
            <Typography>{detail?.details?.f_name || "N/A"}</Typography>
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
            <Typography>{detail?.details?.f_contact || "N/A"}</Typography>
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
            <Typography>{detail?.details?.f_email || "N/A"}</Typography>
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
            <Typography>{detail?.details?.f_occupation || "N/A"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={detail?.details?.m_name || "N/A"}
              src={detail?.details?.m_photo_url}
            />
            <Typography>{detail?.details?.m_name || "N/A"}</Typography>
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
            <Typography>{detail?.details?.m_contact || "N/A"}</Typography>
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
            <Typography>{detail?.details?.m_email || "N/A"}</Typography>
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
            <Typography>{detail?.details?.m_occupation || "N/A"}</Typography>
          </Box>
          <Divider />
          <Typography sx={{ fontWeight: 600 }}>Address : </Typography>
          <Typography>
            {detail?.details?.residential_address1 || "N/A"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

OtherDetailsTab.propTypes = {
  detail: PropTypes.object,
};

export default OtherDetailsTab;
