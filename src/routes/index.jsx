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
import AcademicYear from "../sections/settings/academic-year/academic-year";

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
              element: <Navigate to="fees" />,
            },
            {
              path: "fees",
              element: <Fees />,
            },
            {
              path: "payment-attempts",
              element: <PaymentAttempts />,
            },
            {
              path: "transactions",
              element: <Transactions />,
            },
            {
              path: "daily-statements",
              element: <DailyStatements />,
            },
          ],
        },
        {
          path: "report-card-module",
          children: [
            {
              index: true,
              element: <Navigate to="transfer-certificate" />,
            },
            {
              path: "transfer-certificate",
              element: <TransferCertificate />,
            },
            {
              path: "character-certificate",
              element: <CharacterCertificate />,
            },
          ],
        },
        {
          path: "settings",
          children: [
            {
              index: true,
              element: <Navigate to="academic-year" replace />,
            },
            {
              path: "academic-year",
              element: <AcademicYear />,
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
