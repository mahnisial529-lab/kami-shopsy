import { useCallback, useState } from "react";

const ADMIN_TOKEN_KEY = "kami-shopsy-admin";

function loadToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function useAdmin() {
  const [token, setToken] = useState<string | null>(() => loadToken());

  const isLoggedIn = token !== null;

  const login = useCallback((tok: string) => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, tok);
    setToken(tok);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  }, []);

  return { isLoggedIn, token, login, logout };
}
