import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";

import {
  getAllAcademicYears,
  getClasses,
} from "../../../../services/admin/students-management.service";
import useAuth from "../../../../hooks/useAuth";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Input,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import {
  addMarks,
  getMarksDetails,
  getTerms,
} from "../../../../services/admin/report-card-module.service";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Iconify from "../../../../components/iconify/iconify";
import AddAggregateColumnModal from "./modals/add-aggregate-column-modal";
import { Helmet } from "react-helmet-async";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "SN", label: "SN", align: "left" },
  { id: "roll_no", label: "Roll No", align: "left" },
  { id: "name", label: "Name", align: "left" },
];

export default function MarksGradeEntry() {
  const { userInfo, logout } = useAuth();
  const { state } = useLocation();

  const initialState = {
    ay_id: null,
    cg_id: null,
    class_teacher_name: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [headLabel, setHeadLabel] = useState(HEAD_LABEL);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedMarks, setEditedMarks] = useState({}); // Stores edited marks
  const [originalMarks, setOriginalMarks] = useState({}); // Store original DB values

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  // api to get classList
  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: Number(formData?.ay_id?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [formData?.ay_id],
  });

  // api to get terms
  const { dataList: termsList } = useGetApi({
    apiFunction: formData?.cg_id ? getTerms : null,
    body: {
      cg_id: formData?.cg_id?.id,
    },
    dependencies: [formData?.cg_id],
  });

  // api to get marks list
  const {
    dataList: reportList,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: formData?.term && formData?.cg_id ? getMarksDetails : null,
    body: {
      offset: 0,
      limit: 100,
      ay_id: Number(formData?.ay_id?.ay_id) || userInfo?.ay_id,
      term: formData?.term?.term,
      cg_id: formData?.cg_id?.id,
    },
    dependencies: [formData?.term, formData?.cg_id, formData?.ay_id],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleMarksChange = (st_id, subject_Id, subject_type, event) => {
    const value = event.target.value;
    const key = `${st_id}-${formData?.cg_id?.id}-${formData?.term?.term}-${subject_Id}`;

    // Update state for real-time UI change
    setEditedMarks((prev) => ({
      ...prev,
      [key]: typeof value === Number ? Number(value) : value?.toUpperCase(),
    }));
  };
  const handleMarksBlur = async (st_id, subject_Id, subject_type, event) => {
    const value = event.target.value;
    const key = `${st_id}-${formData?.cg_id?.id}-${formData?.term?.term}-${subject_Id}`;

    // Check if the value has changed
    if (value === originalMarks[key]) {
      return; // No change, no API call
    }

    // Validation
    if (subject_type === "M") {
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
        setEditedMarks((prev) => ({
          ...prev,
          [key]: originalMarks[key] ?? "",
        }));
        toast.error("Marks must be a number between 0 and 100");
        return;
      }
    } else {
      const validGrades = ["A", "B", "C", "D", "E", "F"];
      if (!validGrades?.includes(value?.toUpperCase())) {
        setEditedMarks((prev) => ({
          ...prev,
          [key]: originalMarks[key] ?? "",
        }));
        toast.error("Grades must be A, B, C, D, E, or F");
        return;
      }
    }

    // Call API on blur (only if changed)
    const response = await addMarks({
      marks_id: key,
      marks: typeof value === Number ? Number(value) : value?.toUpperCase(),
    });
    if (response?.code === 200) {
      // Update originalMarks on successful API call
      setOriginalMarks((prev) => ({
        ...prev,
        [key]: typeof value === Number ? Number(value) : value?.toUpperCase(),
      }));
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      setEditedMarks((prev) => ({
        ...prev,
        [key]: originalMarks[key] ?? "",
      }));
      toast.error(response?.message || "Some error occurred");
    }
  };

  useEffect(() => {
    if (!reportList?.subjects) return;

    // Extract subject labels
    let newHeadLabels = reportList.subjects?.map((subject) => ({
      id: subject?.subject_id,
      label: subject?.subject_name,
      type: subject?.type,
    }));

    // // Group subjects with the same prefix
    // const groupSubjects = (subjects) => {
    //   const groups = new Map();

    //   subjects.forEach((subject) => {
    //     const prefix = subject?.label?.split(" ")[0]; // Get first word as prefix
    //     if (!groups.has(prefix)) {
    //       groups.set(prefix, []);
    //     }
    //     groups.get(prefix).push(subject);
    //   });

    //   // Flatten grouped subjects while maintaining order
    //   return Array.from(groups.values()).flat();
    // };

    // newHeadLabels = groupSubjects(newHeadLabels);

    setHeadLabel(() => [...HEAD_LABEL, ...newHeadLabels]);
  }, [reportList]);

  useEffect(() => {
    if (academicYearList?.length > 0) {
      setFormData((preValue) => ({
        ...preValue,
        ay_id: academicYearList?.find(
          (option) => Number(option?.ay_id) === Number(state?.ay_id)
        ) || {
          ay_id: userInfo?.ay_id,
          ay_name: userInfo?.ay_name,
        },
        cg_id: state?.cg_id
          ? { id: state?.cg_id, cg_name: state?.cg_name }
          : null,
        class_teacher_name: state?.class_teacher_name || "",
      }));
    }
  }, [academicYearList, state]);

  useEffect(() => {
    if (reportList?.marks) {
      const initialMarks = {};
      reportList?.marks.forEach((mark) => {
        const key = `${mark?.id}`;
        initialMarks[key] = mark?.marks ?? "-"; // Store original DB value
      });
      setOriginalMarks(initialMarks);
    }
  }, [reportList?.marks]); // Update when reportList changes

  return (
    <>
      <Helmet>
        <title>Marks | SAIFEE</title>
      </Helmet>
      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          my: 2,
        }}
      >
        <Autocomplete
          options={academicYearList || []}
          getOptionLabel={(option) => option?.ay_name || ""}
          renderInput={(params) => (
            <TextField {...params} label="Select Year" size="small" required />
          )}
          value={formData?.ay_id || null}
          onChange={(_, newValue) =>
            handleChange({ target: { name: "ay_id", value: newValue } })
          }
          sx={{ width: "200px", bgcolor: "white" }}
        />

        <Autocomplete
          options={classList || []}
          getOptionLabel={(option) => option?.cg_name || ""}
          renderInput={(params) => (
            <TextField {...params} label="Select Class" size="small" required />
          )}
          value={formData?.cg_id || []}
          onChange={(_, newValue) =>
            handleChange({ target: { name: "cg_id", value: newValue } })
          }
          sx={{ width: "200px", bgcolor: "white" }}
        />

        {formData?.cg_id && (
          <Autocomplete
            options={termsList || []}
            getOptionLabel={(option) => option?.term_name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Term"
                size="small"
                required
              />
            )}
            value={formData?.term || []}
            onChange={(_, newValue) =>
              handleChange({ target: { name: "term", value: newValue } })
            }
            sx={{ width: "200px", bgcolor: "white" }}
          />
        )}
      </Box>

      <Card
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Full viewport height
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          {formData?.ay_id && (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              Academic Year:{" "}
              <Box component="span" sx={{ color: "text.secondary" }}>
                {formData?.ay_id?.ay_name || ""}
              </Box>
            </Typography>
          )}
          {formData?.ay_id && formData?.cg_id && (
            <Divider
              orientation="vertical"
              sx={{ bgcolor: "primary.main", width: "2px", height: "20px" }}
            />
          )}
          {formData?.cg_id && (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              Class:{" "}
              <Box component="span" sx={{ color: "text.secondary" }}>
                {formData?.cg_id?.cg_name || ""}
              </Box>
            </Typography>
          )}
          {formData?.cg_id && formData?.term && (
            <Divider
              orientation="vertical"
              sx={{ bgcolor: "primary.main", width: "2px", height: "20px" }}
            />
          )}
          {formData?.term && (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              Term:{" "}
              <Box component="span" sx={{ color: "text.secondary" }}>
                {formData?.term?.term_name || ""}
              </Box>
            </Typography>
          )}
          {formData?.term && formData?.class_teacher_name && (
            <Divider
              orientation="vertical"
              sx={{ bgcolor: "primary.main", width: "2px", height: "20px" }}
            />
          )}
          {formData?.class_teacher_name && (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              Class Teacher:{" "}
              <Box component="span" sx={{ color: "text.secondary" }}>
                {formData?.class_teacher_name || ""}
              </Box>
            </Typography>
          )}
        </Box>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1, // Take remaining space
              overflow: "hidden", // Prevent overflow issues
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mb: 1,
              }}
            >
              <IconButton onClick={handleModalOpen}>
                <Iconify icon="oui:aggregate" width={40} color="grey" />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button variant="contained" sx={{ width: "150px" }}>
                  Lock Data
                </Button>
                <Button variant="contained" sx={{ width: "200px" }}>
                  Verify & Confirm
                </Button>
              </Box>
            </Box>

            <TableContainer
              sx={{
                flex: 1, // Take remaining space
                overflowY: "auto", // Enable scrolling
              }}
            >
              <Table
                sx={{
                  minWidth: 800,
                  tableLayout: "auto",
                }}
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    {headLabel?.map((headCell, index) => (
                      <TableCell
                        key={headCell?.id}
                        align={headCell?.align || "center"}
                        sx={{
                          width: headCell?.width,
                          minWidth:
                            headCell?.minWidth || (index < 3 ? 60 : 100), // Default minWidth for fixed/scrollable
                          maxHeight: "200px",
                          whiteSpace: "nowrap",
                          writingMode: index > 2 ? "vertical-lr" : "initial",
                          transform: index > 2 ? "rotate(180deg)" : "none",
                          bgcolor: "primary.light",
                          border: "2px solid #B9B9B9",
                          color: headCell?.type === "A" ? "#2E7D32" : "inherit",
                          zIndex: 2,
                          ...(index < 3 && {
                            position: "sticky",
                            left: index === 0 ? 0 : index === 1 ? 60 : 160, // Adjust based on column widths
                            zIndex: 3, // Higher zIndex than body cells
                          }),
                        }}
                      >
                        <Tooltip title={index > 2 ? headCell?.label : ""} arrow>
                          <Typography noWrap>{headCell?.label}</Typography>
                        </Tooltip>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reportList?.students?.map((student, rowIndex) => (
                    <TableRow key={student?.st_id}>
                      {headLabel?.map((headCell, colIndex) => {
                        if (colIndex < 3) {
                          return (
                            <TableCell
                              key={headCell?.id}
                              align="left"
                              sx={{
                                border: "2px solid #B9B9B9",
                                position: "sticky",
                                left:
                                  colIndex === 0
                                    ? 0
                                    : colIndex === 1
                                    ? 60
                                    : 160, // Adjust based on column widths
                                zIndex: 1,
                                background: "white", // Prevent overlap transparency
                                minWidth: colIndex === 0 ? 60 : 100, // Set min-width for fixed columns
                              }}
                            >
                              {colIndex === 0
                                ? rowIndex + 1
                                : student?.[headCell?.id]}
                            </TableCell>
                          );
                        } else {
                          const subjectMark = reportList?.marks?.find(
                            (mark) => {
                              const subjectId = mark?.id?.split("-")?.pop();
                              const studentId = mark?.id?.split("-")?.shift();
                              return (
                                Number(subjectId) === Number(headCell?.id) &&
                                Number(studentId) === Number(student?.st_id)
                              );
                            }
                          );

                          const cellKey = `${student?.st_id}-${formData?.cg_id?.id}-${formData?.term?.term}-${headCell?.id}`;
                          const markValue =
                            editedMarks[cellKey] ?? subjectMark?.marks ?? "-";

                          return (
                            <TableCell
                              key={headCell?.id}
                              align="center"
                              sx={{
                                border: "2px solid #B9B9B9",
                                padding: "0px",
                              }}
                            >
                              <Input
                                disableUnderline
                                type={
                                  headCell?.type === "M" ? "number" : "text"
                                }
                                disabled={headCell?.type === "A"}
                                value={markValue || ""}
                                onChange={(e) =>
                                  handleMarksChange(
                                    student?.st_id,
                                    headCell?.id,
                                    headCell?.type,
                                    e
                                  )
                                }
                                onBlur={(e) =>
                                  handleMarksBlur(
                                    student?.st_id,
                                    headCell?.id,
                                    headCell?.type,
                                    e
                                  )
                                }
                                sx={{
                                  width: "100%",
                                  textAlign: "center",
                                  "& .MuiInputBase-input": {
                                    textAlign: "center",
                                  },
                                  "& .MuiInputBase-input.Mui-disabled": {
                                    color: "#2E7D32",
                                    opacity: 1, // override MUI's default 0.38 opacity
                                    WebkitTextFillColor: "#2E7D32", // fix for WebKit browsers like Chrome/Safari
                                  },
                                }}
                              />
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <AddAggregateColumnModal
              open={modalOpen}
              onClose={handleModalClose}
              refetch={refetch}
              detail={formData}
            />
          </Box>
        )}
      </Card>
    </>
  );
}
