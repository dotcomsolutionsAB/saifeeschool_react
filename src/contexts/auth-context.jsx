import { createContext, useState } from "react";
import PropTypes from "prop-types";
import useLocalStorage from "../hooks/useLocalStorage";
import { loginApi } from "../services/auth.service";
import { toast } from "react-toastify";
import { IS_LOGGED_IN, USER_INFO } from "../utils/constants";

// Create an Auth Context
const AuthContext = createContext();

// Create a provider component
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn, removeLoggedIn] = useLocalStorage(
    IS_LOGGED_IN,
    false
  );
  const [userInfo, setUserInfo, removeUserInfo] = useLocalStorage(
    USER_INFO,
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = async (formData) => {
    setIsLoading(true);
    const response = await loginApi(formData);
    setIsLoading(false);

    if (response?.code == 200 && response?.status) {
      setIsLoggedIn(true);
      setUserInfo(response?.data);
      toast.success(response?.message || "Login Success");
    } else {
      toast.error(response?.message);
    }
  };

  const logout = () => {
    removeLoggedIn();
    removeUserInfo();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };

export default AuthProvider;
