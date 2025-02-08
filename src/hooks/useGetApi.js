import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import useAuth from "./useAuth";

export const useGetApi = ({
  apiFunction,
  body = {},
  dependencies = [],
  debounceDelay = 0,
}) => {
  const { logout } = useAuth();

  const [dataList, setDataList] = useState(null);
  const [dataCount, setDataCount] = useState(0);
  const [allResponse, setAllResponse] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    const response = await apiFunction(body);
    setIsLoading(false);

    if (response?.code === 200) {
      setDataList(response?.data || []);
      setDataCount(response?.total || response?.count || 0);
      setAllResponse(response || {});
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      setIsError(true);
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    let timer = null;

    if (body?.search) {
      timer = setTimeout(fetchData, debounceDelay);
    } else {
      fetchData();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [...dependencies]);

  return {
    dataList,
    dataCount,
    isLoading,
    isError,
    refetch: fetchData,
    allResponse,
  };
};
