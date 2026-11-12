import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { register } from "../api/authApi";
import { signIn } from "../api/session";

export default function Register() {
  const navigate = useNavigate();
  return (
    <AuthForm
      title="Registreren"
      submitLabel="Account maken"
      passwordAutoComplete="new-password"
      onSubmit={async (u, p) => { await register(u, p); await signIn(u, p); navigate("/host"); }}
      footer={<Link to="/login">Al een account? Inloggen</Link>}
    />
  );
}