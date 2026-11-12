import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { signIn } from "../api/session";

export default function Login() {
  const navigate = useNavigate();
  return (
    <AuthForm
      title="Inloggen"
      submitLabel="Inloggen"
      passwordAutoComplete="current-password"
      onSubmit={async (u, p) => { await signIn(u, p); navigate("/host"); }}
      footer={<Link to="/register">Nog geen account? Registreren</Link>}
    />
  );
}