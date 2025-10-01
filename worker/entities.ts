import { IndexedEntity, Entity } from "./core-utils";
import type { Room, BreakfastSession, CheckInRecord } from "@shared/types";
// ROOM ENTITY: Manages the list of hotel rooms.
export class RoomEntity extends IndexedEntity<Room> {
  static readonly entityName = "room";
  static readonly indexName = "rooms";
  static readonly initialState: Room = { id: "" };
}
// BREAKFAST SESSION ENTITY: one DO instance per day.
export class BreakfastSessionEntity extends Entity<BreakfastSession> {
  static readonly entityName = "breakfast_session";
  static readonly initialState: BreakfastSession = { date: "", checkIns: [] };
  async addCheckIn(roomNumber: string): Promise<CheckInRecord> {
    const state = await this.getState();
    if (state.checkIns.some(c => c.roomNumber === roomNumber)) {
      throw new Error(`Room ${roomNumber} has already checked in today.`);
    }
    const newRecord: CheckInRecord = {
      roomNumber,
      timestamp: Date.now(),
    };
    await this.mutate(s => ({
      ...s,
      checkIns: [...s.checkIns, newRecord],
    }));
    return newRecord;
  }
}