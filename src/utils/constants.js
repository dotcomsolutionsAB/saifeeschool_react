export const USER_INFO = "userInfo";
export const IS_LOGGED_IN = "isLoggedIn";

export const DEFAULT_LIMIT = 10;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export const MAIN_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "dashboard",
  },
  {
    _id: 2,
    displayName: "Students Management",
    iconName: "student_management",
    children: [
      {
        _id: 21,
        displayName: "Students",
        linkName: "/students-management/students",
      },
      {
        _id: 22,
        displayName: "New Admissions",
        linkName: "/students-management/new-admissions",
      },
    ],
  },
  {
    _id: 3,
    displayName: "Fees Management",
    iconName: "fee_management",
    children: [
      {
        _id: 31,
        displayName: "Fees",
        linkName: "/fees-management/fees",
      },
      {
        _id: 32,
        displayName: "Payment Attempts",
        linkName: "/fees-management/payment-attempts",
      },
      {
        _id: 33,
        displayName: "Transactions",
        linkName: "/fees-management/transactions",
      },
      {
        _id: 34,
        displayName: "Daily Statements",
        linkName: "/fees-management/daily-statements",
      },
    ],
  },
  {
    _id: 4,
    displayName: "Report Card Module",
    iconName: "report_card_module",
    children: [
      {
        _id: 41,
        displayName: "Dashboard",
        linkName: "/report-card-module/dashboard",
      },
      {
        _id: 42,
        displayName: "Marks/Grade Entry",
        linkName: "/report-card-module/marks-grade-entry",
      },
      {
        _id: 43,
        displayName: "Attendance",
        linkName: "/report-card-module/attendance",
      },
      {
        _id: 44,
        displayName: "Transfer Certificate",
        linkName: "/report-card-module/transfer-certificate",
      },
      {
        _id: 45,
        displayName: "Character Certificate",
        linkName: "/report-card-module/character-certificate",
      },
      {
        _id: 46,
        displayName: "Bulk Character Certificate",
        linkName: "/report-card-module/bulk-character-certificate",
      },
    ],
  },
  {
    _id: 5,
    displayName: "Accounts",
    iconName: "accounts",
    children: [
      {
        _id: 51,
        displayName: "Cash Received",
        linkName: "/accounts/cash-received",
      },
      {
        _id: 52,
        displayName: "Debit Voucher",
        linkName: "/accounts/debit-voucher",
      },
      {
        _id: 53,
        displayName: "Credit Voucher",
        linkName: "/accounts/credit-voucher",
      },
      {
        _id: 54,
        displayName: "Banks",
        linkName: "/accounts/banks",
      },
    ],
  },
  {
    _id: 6,
    displayName: "Settings",
    iconName: "settings",
    children: [
      {
        _id: 61,
        displayName: "Academic Year",
        linkName: "/settings/academic-year",
      },
      {
        _id: 62,
        displayName: "Users",
        linkName: "/settings/users",
      },
    ],
  },
];

export const CAPITALIZE = (text) => {
  return text
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const REMOVE_UNDERSCORE = (text) => {
  return text
    .split(/[_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const TYPE_LIST = [
  { label: "Admission Fee", value: "admission" },
  { label: "Monthly Fee", value: "monthly" },
  { label: "One Time Fee", value: "one_time" },
  { label: "Recurring Fee", value: "recurring" },
];

export function emptyRows(page, rowsPerPage, arrayLength) {
  console.log(arrayLength, "arrayLength");
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

const CREATE_ERROR_RESPONSE = (code, message) => ({
  code,
  data: null,
  status: false,
  message,
});

export const GET_ERROR = (error) => {
  const message = error?.response?.data?.message || error?.message;

  if (!error?.response) {
    if (error?.code === "ERR_NETWORK") {
      if (!navigator.onLine) {
        return CREATE_ERROR_RESPONSE(
          1000,
          "You are offline. Please check your internet connection."
        );
      } else {
        return CREATE_ERROR_RESPONSE(1001, "Some error occurred.");
      }
    }
  }

  return CREATE_ERROR_RESPONSE(error?.response?.status, message);
};
