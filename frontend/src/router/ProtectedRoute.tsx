import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export const ProtectedRoute = ({ children, requireAdmin }: Props) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/vocabulary" replace />;
  }

  return <>{children}</>;
};
