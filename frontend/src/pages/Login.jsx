import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { signIn } from "../api/session";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const destination = from ? from.pathname + from.search : "/host";

  return (
    <AuthForm
      title="Inloggen"
      submitLabel="Inloggen"
      passwordAutoComplete="current-password"
      onSubmit={async (u, p) => {
        await signIn(u, p);
        navigate(destination, { replace: true });
      }}
      footer={<Link to="/register">Nog geen account? Registreren</Link>}
    />
  );
}