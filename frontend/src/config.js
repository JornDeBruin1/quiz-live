// Het adres van de backend volgt het adres waarmee de pagina is geopend:
// "localhost" op je laptop, "192.168.x.x" op je telefoon.
const HOST = window.location.hostname;

export const API_BASE_URL = `http://${HOST}:8080/api`;
export const WS_URL = `ws://${HOST}:8080/ws`;