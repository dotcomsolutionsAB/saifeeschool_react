import { useContext } from "react";
import { StudentContext } from "../contexts/student-context";
// ----------------------------------------------------------------------

const useStudent = () => useContext(StudentContext);

export default useStudent;
