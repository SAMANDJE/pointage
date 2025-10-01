import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { BreakfastSession, CheckInRecord } from '@shared/types';
export type SessionState = {
  session: BreakfastSession | null;
  isLoading: boolean;
  error: string | null;
};
export type SessionActions = {
  initializeSession: (session: BreakfastSession) => void;
  addCheckIn: (record: CheckInRecord) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};
export const useSessionStore = create<SessionState & SessionActions>()(
  immer((set) => ({
    session: null,
    isLoading: true,
    error: null,
    initializeSession: (session) =>
      set((state) => {
        state.session = session;
        state.isLoading = false;
        state.error = null;
      }),
    addCheckIn: (record) =>
      set((state) => {
        if (state.session) {
          state.session.checkIns.push(record);
        }
      }),
    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
        state.isLoading = false;
      }),
  }))
);