import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? <Outlet /> : <Navigate to={`/login?redirect=${location.pathname}`} replace state={{ message: "Please log in to access your sanctuary." }} />;
};

export default ProtectedRoute;