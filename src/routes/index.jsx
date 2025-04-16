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
import AdminDashboard from "../pages/admin-dashboard";
import Students from "../sections/admin/student-management/students/students";
import CreateEditStudent from "../sections/admin/student-management/students/create-edit-student";
import StudentDetail from "../sections/admin/student-management/students/student-detail";
import TransferCertificate from "../sections/admin/report-card-module/transfer-certificate/transfer-certificate";
import CharacterCertificate from "../sections/admin/report-card-module/character-certificate/character-certificate";
import AdminStudentProvider from "../contexts/admin-student-context";
import Fees from "../sections/admin/fee-management/fees/fees";
import PaymentAttempts from "../sections/admin/fee-management/payment-attempts/payment-attempts";
import Transactions from "../sections/admin/fee-management/transactions/transactions";
import DailyStatements from "../sections/admin/fee-management/daily-statements/daily-statements";
import AcademicYear from "../sections/admin/settings/academic-year/academic-year";
import MarksGradeEntry from "../sections/admin/report-card-module/marks-grade-entry/marks-grade-entry";
import ReportCardDashboard from "../sections/admin/report-card-module/dashboard/report-card-dashboard";
import StudentDashboard from "../pages/student-dashboard";
import TeacherDashboard from "../pages/teacher-dashboard";
import PaidFees from "../sections/student/fees/paid-fees";
import PendingFees from "../sections/student/fees/pending-fees";
import TransactionFees from "../sections/student/fees/transaction-fees";
import NewAdmission from "../pages/new-admission";
import NewAdmissions from "../sections/admin/student-management/new-admissions/new-admissions";
import PaymentStatus from "../sections/student/fees/payment-status";

export default function Router() {
  const { isLoggedIn, logout, userInfo } = useAuth();

  const ADMIN_ROUTES = [
    { index: true, element: <AdminDashboard /> },
    {
      path: "students-management",
      children: [
        { index: true, element: <Navigate to="students" replace /> },
        {
          path: "students",
          element: (
            <AdminStudentProvider>
              <Outlet />
            </AdminStudentProvider>
          ),
          children: [
            { index: true, element: <Students /> },
            { path: "student-detail", element: <StudentDetail /> },
            { path: "add-student", element: <CreateEditStudent /> },
            {
              path: "edit-student",
              element: <CreateEditStudent isEdit={true} />,
            },
          ],
        },
        { path: "new-admissions", element: <NewAdmissions /> },
      ],
    },
    {
      path: "fees-management",
      children: [
        { index: true, element: <Navigate to="fees" /> },
        { path: "fees", element: <Fees /> },
        { path: "payment-attempts", element: <PaymentAttempts /> },
        { path: "transactions", element: <Transactions /> },
        { path: "daily-statements", element: <DailyStatements /> },
      ],
    },
    {
      path: "report-card-module",
      children: [
        { index: true, element: <Navigate to="dashboard" /> },
        { path: "dashboard", element: <ReportCardDashboard /> },
        { path: "marks-grade-entry", element: <MarksGradeEntry /> },
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
        { index: true, element: <Navigate to="academic-year" replace /> },
        { path: "academic-year", element: <AcademicYear /> },
      ],
    },
  ];
  const STUDENT_ROUTES = [
    { index: true, element: <StudentDashboard /> },
    {
      path: "fees",
      children: [
        { index: true, element: <Navigate to="pending-fees" /> },
        {
          path: "pending-fees",
          children: [
            { index: true, element: <PendingFees /> },
            { path: "payment-status", element: <PaymentStatus /> },
          ],
        },
        { path: "paid-fees", element: <PaidFees /> },
        { path: "transactions", element: <TransactionFees /> },
      ],
    },
  ];
  const TEACHER_ROUTES = [{ index: true, element: <TeacherDashboard /> }];

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === IS_LOGGED_IN ||
        event.key === USER_INFO ||
        event.newValue === null
      ) {
        logout();
        toast.error("Session storage changed.");
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
      children:
        userInfo?.role === "admin"
          ? ADMIN_ROUTES
          : userInfo?.role === "student"
          ? STUDENT_ROUTES
          : userInfo?.role === "teacher"
          ? TEACHER_ROUTES
          : [{ path: "*", element: <Navigate to="/404" replace /> }],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/new-admission",
      element: <NewAdmission />,
    },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
