import React, { useState, useEffect, createContext } from "react";
// import Cookies from 'js-cookie';
import { useAPI } from "../api/api";
import Loading from "../components/Loading";
import { adminPrefix } from "../routes/AdminRoutes";
//-------------------------------------
export const AuthContext = createContext(null);

/**
 * Restore auth user from access_token is persisted in localStorage.
 *
 * TODO: handle refresh token in here.
 */
const AuthProvider = React.memo((props) => {
  const [perms, setPerms] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [urlParam, setUrlParam] = useState({
    id: null,
    sub_id: null,
  });
  const api = useAPI();

  const updateAdminToken = async (token, remember) => {
    if (remember) {
      localStorage.setItem("admin_token", token);
    } else {
      // Cookies.set('admin_token', token);
      localStorage.setItem("admin_token", token);
    }
  };

  const updateAdmin = async (data) => {
    setAdmin(data);
  };

  const updatePermission = async (data) => {
    setPerms(data);
  };

  const clear = async (role) => {
    if (admin) {
      localStorage.removeItem("admin_token");
      // Cookies.remove('admin_token');
      setAdmin(null);
    }
  };

  const revalidate = async () => {
    getUserInfo();
  };

  const value = {
    admin,
    perms,
    updatePermission,
    updateAdminToken,
    updateAdmin,
    clear,
    revalidate,
    urlParam,
    setUrlParam,
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      try {
        const res = await api.fetcher("get", "/me");
        const perm = await api.fetcher("get", "/permissions");
        if (perm) {
          setPerms(perm);
          setAdmin(res);
        }
      } catch (error) {
        setAdmin(null);
        localStorage.removeItem("admin_token");
      }
    } else {
      setAdmin(null);
    }
    setLoaded(true);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!loaded) {
    return <Loading />;
  }

  return <AuthContext.Provider value={value} {...props} />;
});

export default AuthProvider;
