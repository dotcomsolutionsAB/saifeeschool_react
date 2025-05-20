export const USER_INFO = "userInfo";
export const IS_LOGGED_IN = "isLoggedIn";

export const DEFAULT_LIMIT = 10;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export const ADMIN_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "dashboard",
  },
  {
    _id: 21,
    displayName: "Students",
    linkName: "/students",
    iconName: "students",
  },
  {
    _id: 22,
    displayName: "New Admissions",
    linkName: "/new-admissions",
    iconName: "new_admissions",
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
    ],
  },
  {
    _id: 4,
    displayName: "Report Card",
    iconName: "report_card_module",
    children: [
      {
        _id: 41,
        displayName: "Dashboard",
        linkName: "/report-card-module/dashboard",
      },
      // {
      //   _id: 42,
      //   displayName: "Marks/Grade Entry",
      //   linkName: "/report-card-module/marks-grade-entry",
      // },
      // {
      //   _id: 43,
      //   displayName: "Attendance",
      //   linkName: "/report-card-module/attendance",
      // },
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
      // {
      //   _id: 46,
      //   displayName: "Bulk Character Certificate",
      //   linkName: "/report-card-module/bulk-character-certificate",
      // },
    ],
  },
  {
    _id: 5,
    displayName: "Teachers",
    iconName: "teachers",
    children: [
      {
        _id: 51,
        displayName: "All Teachers",
        linkName: "/teachers/all-teachers",
      },
      {
        _id: 52,
        displayName: "Class Timetable",
        linkName: "/teachers/class-timetable",
      },
      {
        _id: 53,
        displayName: "Attendance",
        linkName: "/teachers/attendance",
      },
    ],
  },
  {
    _id: 6,
    displayName: "Accounts",
    iconName: "accounts",
    children: [
      {
        _id: 61,
        displayName: "Cash Received",
        linkName: "/accounts/cash-received",
      },
      {
        _id: 62,
        displayName: "Debit Voucher",
        linkName: "/accounts/debit-voucher",
      },
      {
        _id: 63,
        displayName: "Credit Voucher",
        linkName: "/accounts/credit-voucher",
      },
      {
        _id: 64,
        displayName: "Banks",
        linkName: "/accounts/banks",
      },
      {
        _id: 64,
        displayName: "Daily Statements",
        linkName: "/accounts/daily-statements",
      },
    ],
  },
  {
    _id: 7,
    displayName: "Academic Year",
    linkName: "/academic-year",
    iconName: "academic-year",
  },
  {
    _id: 8,
    displayName: "Users",
    linkName: "/users",
    iconName: "users",
  },
];

export const STUDENT_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "dashboard",
  },
  {
    _id: 2,
    displayName: "Fees",
    iconName: "fee_management",
    children: [
      {
        _id: 21,
        displayName: "Pending Fees",
        linkName: "/fees/pending-fees",
      },
      {
        _id: 22,
        displayName: "Paid Fees",
        linkName: "/fees/paid-fees",
      },
      {
        _id: 23,
        displayName: "Transactions",
        linkName: "/fees/transactions",
      },
    ],
  },
];

export const TEACHER_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "dashboard",
  },
];
export const PROCUREMENT_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "procurement",
  },
  {
    _id: 2,
    displayName: "Products",
    linkName: "/products",
    iconName: "procurement",
  },
  {
    _id: 3,
    displayName: "Supplier",
    linkName: "/supplier",
    iconName: "procurement",
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

export const FORMAT_INDIAN_CURRENCY = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || num === 0) return "";
  return new Intl.NumberFormat("en-IN").format(num);
};

export const TYPE_LIST = [
  { label: "Admission Fee", value: "admission" },
  { label: "Monthly Fee", value: "monthly" },
  { label: "One Time Fee", value: "one_time" },
  { label: "Recurring Fee", value: "recurring" },
];

export function emptyRows(page, rowsPerPage, arrayLength) {
  if (rowsPerPage > 25) return 0;
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
