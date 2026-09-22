import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  let user = null;

  try {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      user = JSON.parse(userInfoStr);
    }
  } catch (error) {
    console.error("Error reading userInfo in AdminProtectedRoute:", error);
  }

  if (!user || user.role !== "admin" || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;