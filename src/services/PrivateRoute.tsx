import { Outlet, Navigate } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export default function PrivateRoutesByRole({ allowedRoles }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role || "")) return <Navigate to="/not-found" replace />;

  return <Outlet />;
}
