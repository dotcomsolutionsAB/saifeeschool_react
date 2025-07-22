import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useGetApi } from "../hooks/useGetApi";
import { getAllStudents } from "../services/admin/students-management.service";
import { DEFAULT_LIMIT } from "../utils/constants";
import useAuth from "../hooks/useAuth";

const AdminStudentContext = createContext();

const AdminStudentProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [bohra, setBohra] = useState(null);
  const [cgId, setCgId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]); // to select multiple checkboxes in class field
  const [gender, setGender] = useState(null);
  const [dobFrom, setDobFrom] = useState(null);
  const [dobTo, setDobTo] = useState(null);
  const [academicYear, setAcademicYear] = useState({
    ay_id: userInfo?.ay_id,
    ay_name: userInfo?.ay_name,
  });
  const [stExternal, setStExternal] = useState({
    label: "Internal",
    value: "0",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendToBackend = {
    ay_id: academicYear?.ay_id || userInfo?.ay_id,
    stExternal: stExternal?.value || "0",
    search: search || "",
    bohra: bohra?.value || "",
    cg_id: cgId || "",
    gender: gender?.value || "",
    dob_from: dobFrom || "",
    dob_to: dobTo || "",
  };

  // api to get students list

  const {
    dataList: studentsList,
    dataCount: studentsCount,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getAllStudents,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [
      academicYear,
      stExternal,
      page,
      rowsPerPage,
      search,
      bohra,
      cgId,
      gender,
      dobFrom,
      dobTo,
    ],
    debounceDelay: 500,
  });

  const value = {
    bohra,
    selectedOptions,
    gender,
    dobFrom,
    dobTo,
    academicYear,
    anchorEl,
    selectedRows,
    isExportLoading,
    page,
    rowsPerPage,
    search,
    setPage,
    setRowsPerPage,
    setSearch,
    setBohra,
    setCgId,
    setSelectedOptions,
    setGender,
    setDobFrom,
    setDobTo,
    setAcademicYear,
    setAnchorEl,
    setSelectedRows,
    setIsExportLoading,
    setStExternal,
    stExternal,
    dataSendToBackend,
    studentsList,
    studentsCount,
    isLoading,
    isError,
    refetch,
    errorMessage,
  };

  return (
    <AdminStudentContext.Provider value={value}>
      {children}
    </AdminStudentContext.Provider>
  );
};

AdminStudentProvider.propTypes = {
  children: PropTypes.node,
};

export { AdminStudentContext };

export default AdminStudentProvider;
