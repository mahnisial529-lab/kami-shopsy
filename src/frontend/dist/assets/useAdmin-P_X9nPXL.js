import { r as reactExports } from "./index-BXOuU6Ia.js";
const ADMIN_TOKEN_KEY = "kami-shopsy-admin";
function loadToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}
function useAdmin() {
  const [token, setToken] = reactExports.useState(() => loadToken());
  const isLoggedIn = token !== null;
  const login = reactExports.useCallback((tok) => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, tok);
    setToken(tok);
  }, []);
  const logout = reactExports.useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  }, []);
  return { isLoggedIn, token, login, logout };
}
export {
  useAdmin as u
};
