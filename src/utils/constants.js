export const USER_INFO = "userInfo";
export const IS_LOGGED_IN = "isLoggedIn";

export const WEBSITE_NAME = "SAIFEE GOLDEN JUBILEE ENGLISH PUBLIC SCHOOL";

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
    accessKey: "students",
  },
  {
    _id: 22,
    displayName: "New Admissions",
    linkName: "/new-admissions",
    iconName: "new_admissions",
    accessKey: "admissions",
  },

  {
    _id: 3,
    displayName: "Fees Management",
    iconName: "fee_management",
    accessKey: "fees",
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
    accessKey: "report",
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
    accessKey: "teachers",
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
    accessKey: "accounts",
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
        displayName: "Bank Transactions",
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
    accessKey: "academics",
  },
  {
    _id: 8,
    displayName: "Users",
    linkName: "/users",
    iconName: "users",
    accessKey: "users",
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
    iconName: "dashboard",
  },
  {
    _id: 2,
    displayName: "Products",
    linkName: "/products",
    iconName: "procurement_products",
  },
  {
    _id: 3,
    displayName: "Suppliers",
    linkName: "/suppliers",
    iconName: "procurement_suppliers",
  },
  {
    _id: 3,
    displayName: "Purchase Invoice",
    linkName: "/purchase-invoice",
    iconName: "procurement_purchase_invoice",
  },
];

export const CAPITALIZE = (text) => {
  return text
    ?.split(/[-\s]/)
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const REMOVE_UNDERSCORE = (text) => {
  return text
    ?.split(/[_\s]/)
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
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

/**
 * Handles numeric input for form fields
 * Ensures only positive numbers are allowed, defaults to 0 for invalid inputs
 * @param {string} value - The input value to process
 * @returns {number} - The processed numeric value
 */
export const handleNumericInput = (value) => {
  // Handle empty string or invalid input
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  // Remove any non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, "");

  // Convert to number
  const numericValue = parseFloat(cleanValue);

  // Check if it's a valid number and not negative
  if (isNaN(numericValue) || numericValue < 0) {
    return 0;
  }

  // Return the numeric value
  return numericValue;
};

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
