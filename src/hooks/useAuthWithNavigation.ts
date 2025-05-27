// hooks/useAuthWithNavigation.ts
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthWithNavigation = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const logoutWithRedirect = () => {
    auth.logout();
    navigate("/login");
  };

  return {
    ...auth,
    logoutWithRedirect,
  };
};
