import { useContext } from "react";
import { OperationsContext } from "../contexts/operations-context";

// ----------------------------------------------------------------------

const useOperations = () => useContext(OperationsContext);

export default useOperations;
