import { useEffect } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
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
import StudentDetail from "../sections/student-management/students/student-detail";
import TransferCertificate from "../sections/report-card-module/transfer-certificate/transfer-certificate";
import CharacterCertificate from "../sections/report-card-module/character-certificate/character-certificate";
import StudentProvider from "../contexts/student-context";
import Fees from "../sections/fee-management/fees/fees";
import PaymentAttempts from "../sections/fee-management/payment-attempts/payment-attempts";
import Transactions from "../sections/fee-management/transactions/transactions";
import DailyStatements from "../sections/fee-management/daily-statements/daily-statements";

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
              element: (
                <StudentProvider>
                  <Outlet />
                </StudentProvider>
              ),
              children: [
                {
                  index: true,
                  element: <Students />,
                },
                { path: "student-detail", element: <StudentDetail /> },
                { path: "add-student", element: <CreateEditStudent /> },
                {
                  path: "edit-student",
                  element: <CreateEditStudent isEdit={true} />,
                },
              ],
            },
          ],
        },
        {
          path: "fees-management",
          children: [
            {
              index: true,
              element: <Navigate to="fees" replace />,
            },
            {
              path: "fees",
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <Fees />,
                },
              ],
            },
            {
              path: "payment-attempts",
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <PaymentAttempts />,
                },
              ],
            },
            {
              path: "transactions",
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <Transactions />,
                },
              ],
            },
            {
              path: "daily-statements",
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: <DailyStatements />,
                },
              ],
            },
          ],
        },
        {
          path: "report-card-module",
          children: [
            {
              index: true,
              element: <Navigate to="transfer-certificate" replace />,
            },
            {
              path: "transfer-certificate",
              children: [
                { index: true, path: "", element: <TransferCertificate /> },
              ],
            },
            {
              path: "character-certificate",
              children: [
                { index: true, path: "", element: <CharacterCertificate /> },
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
