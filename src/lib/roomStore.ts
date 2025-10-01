import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import type { Room } from '@shared/types';
export type RoomState = {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
};
export type RoomActions = {
  fetchRooms: () => Promise<void>;
  addRoom: (id: string) => Promise<Room>;
  updateRoom: (oldId: string, newId: string) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
};
export const useRoomStore = create<RoomState & RoomActions>()(
  immer((set, get) => ({
    rooms: [],
    isLoading: false,
    error: null,
    fetchRooms: async () => {
      // Prevent fetching if already loading or if rooms are already populated
      if (get().isLoading || get().rooms.length > 0) return;
      set({ isLoading: true, error: null });
      try {
        const rooms = await api<Room[]>('/api/rooms');
        set({ rooms: rooms.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })), isLoading: false });
      } catch (error: any) {
        set({ error: error.message || 'Failed to fetch rooms.', isLoading: false });
      }
    },
    addRoom: async (id: string) => {
      try {
        const newRoom = await api<Room>('/api/rooms', {
          method: 'POST',
          body: JSON.stringify({ id }),
        });
        set((state) => {
          state.rooms.push(newRoom);
          state.rooms.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
        });
        return newRoom;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to add room.');
      }
    },
    updateRoom: async (oldId: string, newId: string) => {
        try {
          const updatedRoom = await api<Room>(`/api/rooms/${oldId}`, {
            method: 'PUT',
            body: JSON.stringify({ id: newId }),
          });
          set((state) => {
            const index = state.rooms.findIndex((r) => r.id === oldId);
            if (index !== -1) {
              state.rooms[index] = updatedRoom;
              state.rooms.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
            }
          });
          return updatedRoom;
        } catch (error: any) {
          throw new Error(error.message || 'Failed to update room.');
        }
    },
    deleteRoom: async (id: string) => {
      try {
        await api(`/api/rooms/${id}`, { method: 'DELETE' });
        set((state) => {
          state.rooms = state.rooms.filter((room) => room.id !== id);
        });
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete room.');
      }
    },
  }))
);
// Automatically fetch rooms when the app loads.
useRoomStore.getState().fetchRooms();