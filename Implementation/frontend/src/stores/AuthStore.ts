import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  role: string | null;
  username: string | null;
  setSession: (token: any, role: any, username: string) => void;
  logout: () => void;
  isAuthorized: (roles?: string[]) => boolean;
  initSessionFromStorage: () => void;
}

const allowedRoles = ["student", "teacher"];

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
}

const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem("authToken"),
  role: localStorage.getItem("role"),
  username: localStorage.getItem("username"),

  setSession: (token: string, role: string, username) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    set({ token, role, username });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    set({ token: null, role: null, username: null });
  },

  isAuthorized: () => {
    const currentRole = get().role;
    if (!currentRole) return false;
    return allowedRoles.includes(currentRole);
  },

  initSessionFromStorage: () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (!token || isTokenExpired(token)) {
      //clear if token is missing or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      set({ token: null, role: null, username: null });
      return;
    }
    set({ token, role, username });
  },
}));

export default useAuthStore;
