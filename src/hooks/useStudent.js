import { useContext } from "react";
import { StudentContext } from "../contexts/admin-student-context";
// ----------------------------------------------------------------------

const useStudent = () => useContext(StudentContext);

export default useStudent;
