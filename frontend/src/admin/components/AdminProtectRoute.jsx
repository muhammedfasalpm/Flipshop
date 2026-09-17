
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  // Temporary dummy admin data
  const user = {
    role: "admin",
  };

  // Backend connect cheyyumbo localStorage/context-il ninn varum
  // const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminProtectedRoute;