import { ApiError } from "../api/client";

export function authErrorMessage(err) {
  if (!(err instanceof ApiError)) return "Kan de server niet bereiken";
  switch (err.status) {
    case 401: return "Onjuiste gebruikersnaam of wachtwoord";
    case 409: return "Deze gebruikersnaam is al in gebruik";
    case 400: return "Gebruikersnaam: 3-50 tekens, wachtwoord: 8-72 tekens";
    default: return "Er ging iets mis, probeer het opnieuw";
  }
}