import { Navigate } from "react-router-dom";
import { isSignedIn } from "../api/session";

export default function ProtectedRoute({ children }) {
  return isSignedIn() ? children : <Navigate to="/login" replace />;
}