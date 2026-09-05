import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

// Verbindt met het WebSocket-kanaal van één specifiek spel en geeft
// het laatst ontvangen event terug. Herbruikbaar in Host, Screen en Player.
function useGameSocket(gameCode) {
  const [lastEvent, setLastEvent] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!gameCode) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        client.subscribe(`/topic/game/${gameCode}`, (frame) => {
          const event = JSON.parse(frame.body);
          setLastEvent(event);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [gameCode]);

  return lastEvent;
}

export default useGameSocket;