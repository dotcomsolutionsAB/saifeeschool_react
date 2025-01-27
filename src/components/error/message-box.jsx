import { Box, Card, CardContent, Typography } from "@mui/material";
import { ErrorRounded } from "@mui/icons-material";

const MessageBox = () => {
  return (
    <Card elevation={2}>
      <CardContent
        sx={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ErrorRounded sx={{ fontSize: "40px", color: "warning.main" }} />
          <Typography variant="h2">Oops!</Typography>
        </Box>
        <Typography variant="h3">An error occured.</Typography>
      </CardContent>
    </Card>
  );
};

export default MessageBox;
