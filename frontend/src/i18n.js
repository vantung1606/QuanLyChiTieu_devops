import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  EN: {
    translation: {
      "Dashboard": "Dashboard",
      "Transactions": "Transactions",
      "Categories": "Categories",
      "Reports": "Reports",
      "Settings": "Settings",
      "Help Center": "Help Center",
      "Logout": "Logout",
      "Welcome Back": "Welcome Back",
      "Manage finances with precision": "Manage finances with precision and clarity.",
      "Total Revenue": "Total Revenue",
      "Total Expense": "Total Expense",
      "Net Balance": "Net Balance",
      "Recent Transactions": "Recent Transactions",
      "Add New Transaction": "Add New Transaction",
      "Title": "Title",
      "Amount": "Amount",
      "Type": "Type",
      "Category": "Category",
      "Date": "Date",
      "Income": "Income",
      "Expense": "Expense",
      "Profile Settings": "Profile Settings",
      "Preferences": "Preferences",
      "Security": "Security",
      "Notifications": "Notifications",
      "Full Name": "Full Name",
      "Email Address": "Email Address",
      "Username": "Username",
      "Currency": "Currency",
      "Language": "Language",
      "Dark Mode": "Dark Mode",
      "Save Changes": "Save Changes",
      "Cancel": "Cancel",
      "Delete Account": "Delete Account"
    }
  },
  VI: {
    translation: {
      "Dashboard": "Tổng quan",
      "Transactions": "Giao dịch",
      "Categories": "Danh mục",
      "Reports": "Báo cáo",
      "Settings": "Cài đặt",
      "Help Center": "Trung tâm trợ giúp",
      "Logout": "Đăng xuất",
      "Welcome Back": "Chào mừng trở lại",
      "Manage finances with precision": "Quản lý tài chính với độ chính xác và rõ ràng.",
      "Total Revenue": "Tổng Thu",
      "Total Expense": "Tổng Chi",
      "Net Balance": "Số Dư",
      "Recent Transactions": "Danh sách giao dịch",
      "Add New Transaction": "Thêm giao dịch mới",
      "Title": "Tiêu đề",
      "Amount": "Số tiền",
      "Type": "Loại",
      "Category": "Danh mục",
      "Date": "Ngày thực hiện",
      "Income": "Thu nhập",
      "Expense": "Chi tiêu",
      "Profile Settings": "Thông tin hồ sơ",
      "Preferences": "Tùy chọn",
      "Security": "Bảo mật",
      "Notifications": "Thông báo",
      "Full Name": "Họ và tên",
      "Email Address": "Địa chỉ Email",
      "Username": "Tên đăng nhập",
      "Currency": "Tiền tệ",
      "Language": "Ngôn ngữ",
      "Dark Mode": "Chế độ tối",
      "Save Changes": "Lưu tất cả",
      "Cancel": "Hủy thay đổi",
      "Delete Account": "Xóa tài khoản"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'VI',
    fallbackLng: 'VI',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
