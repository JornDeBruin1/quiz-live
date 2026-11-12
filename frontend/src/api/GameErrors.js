import { ApiError } from "./client";

// Maakt van een fout een melding die de host kan begrijpen.
// De rauwe statuscode of technische tekst laten we bewust niet zien.
export function describeGameError(error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return "Je sessie is verlopen. Log opnieuw in.";
      case 403:
        return "Dat mag niet: deze quiz of dit spel is van een andere host.";
      case 404:
        return "Niet gevonden. Bestaat deze quiz of dit spel nog?";
      case 409:
        return "Dat kan nu niet. Wacht tot de huidige vraag is afgelopen.";
      default:
        return "Er ging iets mis op de server. Probeer het zo opnieuw.";
    }
  }

  // Geen ApiError: fetch zelf is mislukt (backend uit, netwerk weg)
  return "Geen verbinding met de server. Draait de backend?";
}