import { login } from "./authApi";
import { getToken, setToken, clearToken } from "./token";
import { setUnauthorizedHandler } from "./client";

// Een verlopen of ongeldig token wissen we hier, niet in de HTTP-client
setUnauthorizedHandler(clearToken);

export async function signIn(username, password) {
  const { token } = await login(username, password);
  setToken(token);
}

export const signOut = clearToken;
export const isSignedIn = () => Boolean(getToken());