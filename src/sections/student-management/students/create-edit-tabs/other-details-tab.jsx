import { useState } from "react";
import {
  getAllAcademicYears,
  getAllClasses,
  getBloodGroups,
} from "../../../../services/students-management.service";
import { useGetApi } from "../../../../hooks/useGetApi";
import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers";

const OtherDetailsTab = () => {
  const { userInfo } = useAuth();

  const [academicYear, setAcademicYear] = useState(null);

  const { dataList: bloodGroupList } = useGetApi({
    apiFunction: getBloodGroups,
  });

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getAllClasses,
    body: {
      ay_id: academicYear?.id || userInfo?.ay_id,
    },
    dependencies: [academicYear],
  });

  // api to get academicYearList

  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Blood Group */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={bloodGroupList}
            renderInput={(params) => (
              <TextField
                {...params}
                name="st_blood_group"
                label="Blood Group"
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Aadhaar No */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField name="aadhaar_id" label="Aadhaar No" fullWidth />
        </Grid>

        {/* Date of Admission */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DatePicker
            label="Date of Admission"
            slotProps={{
              textField: { name: "st_year_of_admission", fullWidth: true },
            }}
          />
        </Grid>

        {/* Academic Year */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={academicYearList || []}
            getOptionLabel={(option) => option?.ay_name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Year" fullWidth />
            )}
            value={academicYear || null}
            onChange={(_, newValue) => setAcademicYear(newValue)}
          />
        </Grid>

        {/* Class Group */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={classList || []}
            getOptionLabel={(option) => option?.cg_name}
            renderInput={(params) => (
              <TextField
                {...params}
                name="class_name"
                label="Class Group"
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OtherDetailsTab;
