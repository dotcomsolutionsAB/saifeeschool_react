import { Box, Stack } from "@mui/material";

const Loader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      height={350}
      width="100%"
    >
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        position={"relative"}
        direction={"row"}
        sx={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: `0px 0px 0px 2px #9BCBFA`,
          animation:
            "spin 2.5s cubic-bezier(0.75, 0, 0, 0.75) forwards infinite",
          "&:before": {
            content: "''",
            display: "block",
            position: "absoulte",
            top: "5px",
            right: "5px",
            bottom: "5px",
            left: "5px",
            border: `1px solid #9BCBFA`,
            borderRadius: "50%",
          },
          "&:after": {
            content: "''",
            display: "block",
            position: "absolute",
            top: "40px",
            right: "40px",
            bottom: "40px",
            left: "40px",
            backgroundColor: "#5DA8F5",
            borderRadius: "50%",
            animation: "pulse 2.5s ease-in-out alternate infinite",
          },
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            position: "relative",
            width: "30px",
            height: "30px",
            transform: "rotate(45deg)",
            borderWidth: "2px",
            borderColor: "#1b8cfe",
            "&:before": {
              content: "''",
              display: "block",
              position: "absolute",
              width: "14px",
              height: "14px",
              backgroundColor: "#a9d6e580",
              borderRadius: "50%",
              left: "-8px",
              top: "-8px",
            },
            "&:first-of-type": {
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
              animation: "panL 2.5s 0s ease-in-out alternate infinite",
            },
            "&:first-of-type:before": {
              animation: "slideL 2.5s 0s linear alternate infinite",
            },
            "&:last-of-type": {
              borderTopStyle: "solid",
              borderRightStyle: "solid",
              animation: "panR 2.5s 0s ease-in-out alternate infinite",
            },
            "&:last-of-type:before": {
              animation: "slideR 2.5s 0s linear alternate infinite",
            },
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(0)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(359deg)",
              },
            },
            "@keyframes panL": {
              "0%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
              "50%": {
                transform: "translate(15px, 0px) rotate(45deg)",
              },
              "100%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
            },
            "@keyframes panR": {
              "0%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
              "50%": {
                transform: "translate(-15px, 0px) rotate(45deg)",
              },
              "100%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
            },
            "@keyframes slideL": {
              "0%": {
                transform: "translate(0px, 0px) scale(0.5)",
              },
              "50%": {
                transform: "translate(0px, 30px) scale(1.25)",
              },
              "100%": {
                transform: "translate(30px, 30px) scale(0.5)",
              },
            },
            "@keyframes slideR": {
              "0%": {
                transform: "translate(0px, 0px) scale(0.5)",
              },
              "50%": {
                transform: "translate(30px, 0px) scale(1.25)",
              },
              "100%": {
                transform: "translate(30px, 30px) scale(0.5)",
              },
            },
          }}
        ></Box>
        <Box
          sx={{
            display: "inline-block",
            position: "relative",
            width: "30px",
            height: "30px",
            transform: "rotate(45deg)",
            borderWidth: "2px",
            borderColor: "#1b8cfe",
            "&:before": {
              content: "''",
              display: "block",
              position: "absolute",
              width: "14px",
              height: "14px",
              backgroundColor: "#a9d6e580",
              borderRadius: "50%",
              left: "-8px",
              top: "-8px",
            },
            "&:first-of-type": {
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
              animation: "panL 2.5s 0s ease-in-out alternate infinite",
            },
            "&:first-of-type:before": {
              animation: "slideL 2.5s 0s linear alternate infinite",
            },
            "&:last-of-type": {
              borderTopStyle: "solid",
              borderRightStyle: "solid",
              animation: "panR 2.5s 0s ease-in-out alternate infinite",
            },
            "&:last-of-type:before": {
              animation: "slideR 2.5s 0s linear alternate infinite",
            },
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(0)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(359deg)",
              },
            },
            "@keyframes panL": {
              "0%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
              "50%": {
                transform: "translate(15px, 0px) rotate(45deg)",
              },
              "100%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
            },
            "@keyframes panR": {
              "0%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
              "50%": {
                transform: "translate(-15px, 0px) rotate(45deg)",
              },
              "100%": {
                transform: "translate(0px, 0px) rotate(45deg)",
              },
            },
            "@keyframes slideL": {
              "0%": {
                transform: "translate(0px, 0px) scale(0.5)",
              },
              "50%": {
                transform: "translate(0px, 30px) scale(1.25)",
              },
              "100%": {
                transform: "translate(30px, 30px) scale(0.5)",
              },
            },
            "@keyframes slideR": {
              "0%": {
                transform: "translate(0px, 0px) scale(0.5)",
              },
              "50%": {
                transform: "translate(30px, 0px) scale(1.25)",
              },
              "100%": {
                transform: "translate(30px, 30px) scale(0.5)",
              },
            },
          }}
        ></Box>
      </Stack>
    </Stack>
  );
};

export default Loader;
