"use client";

import { create } from "zustand";

type SessionState = {
  username: string;
  setUsername: (username: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  username: "",
  setUsername: (username) => set({ username }),
}));
