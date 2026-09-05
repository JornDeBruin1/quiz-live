import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

function WebSocketTest() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const clientRef = useRef(null);

useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        setConnected(true);

        // Abonneren op het kanaal: elke broadcast van de server komt hier binnen
        client.subscribe("/topic/test", (frame) => {
          setMessages((prev) => [...prev, frame.body]);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    // Cleanup: sluit de verbinding netjes af als deze component van het scherm verdwijnt
    return () => {
      client.deactivate();
    };
  }, []);

  function sendMessage() {
    clientRef.current.publish({
      destination: "/app/test",
      body: input,
    });
    setInput("");
  }

  return (
    <div className="websocket-test">
      <h1>WebSocket Test</h1>
      <p>Status: {connected ? "Verbonden ✅" : "Niet verbonden ❌"}</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Typ een bericht"
      />
      <button onClick={sendMessage} disabled={!connected}>
        Verstuur
      </button>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketTest;