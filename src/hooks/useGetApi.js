import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import useAuth from "./useAuth";

export const useGetApi = ({
  apiFunction,
  body = {},
  dependencies = [],
  debounceDelay = 0,
  skip = false,
}) => {
  const { logout } = useAuth();

  const [dataList, setDataList] = useState(null);
  const [dataCount, setDataCount] = useState(0);
  const [allResponse, setAllResponse] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    if (skip) return;
    setIsLoading(true);
    setIsError(false);
    if (!apiFunction) return;
    const response = await apiFunction(body);
    setIsLoading(false);

    if (response?.code === 200) {
      setDataList(
        typeof response?.data === "object"
          ? response?.data || null
          : response?.data || []
      );
      setDataCount(
        response?.total || response?.count || response?.total_records || 0
      );
      setAllResponse(response || {});
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      setIsError(true);
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    let timer = null;

    if (skip) return; // Skip if not initialized

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
    dataCount: Number(dataCount),
    isLoading,
    isError,
    refetch: fetchData,
    allResponse,
  };
};
