import { Navigate, useLocation } from "react-router-dom";
import { isSignedIn } from "../api/session";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  return isSignedIn()
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}