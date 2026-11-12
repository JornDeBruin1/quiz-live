// components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { signOut } from "../api/session";

export default function LogoutButton() {
  const navigate = useNavigate();

  function handleClick() {
    signOut();
    navigate("/login");
  }

  return <button onClick={handleClick}>Uitloggen</button>;
}