import { useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { toast } from "react-toastify";

// hooks
import useAuth from "../hooks/useAuth";

// layouts
import MainLayout from "../layouts/main-layout";

// error components
import Page404 from "../pages/Page404";

// constants
import { IS_LOGGED_IN, USER_INFO } from "../utils/constants";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Students from "../sections/student-management/students/students";
import CreateEditStudent from "../sections/student-management/students/create-edit-student";

export default function Router() {
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === IS_LOGGED_IN ||
        event.key === USER_INFO ||
        event.newValue === null
      ) {
        logout();
        toast.error("Local storage changed.");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return useRoutes([
    {
      path: "/",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" replace />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "students-management",
          children: [
            {
              index: true,
              element: <Navigate to="students" replace />,
            },
            {
              path: "students",
              children: [
                { index: true, path: "", element: <Students /> },
                {
                  path: "add-student",
                  element: <CreateEditStudent />,
                },
                {
                  path: "edit-student",
                  element: <CreateEditStudent isEdit={true} />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <Login />,
    },

    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
