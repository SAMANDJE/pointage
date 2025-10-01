import { Hono } from "hono";
import { format } from 'date-fns';
import type { Env } from './core-utils';
import { RoomEntity, BreakfastSessionEntity } from "./entities";
import { ok, bad, notFound, isStr, Index } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ROOMS
  app.get('/api/rooms', async (c) => {
    const page = await RoomEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/rooms', async (c) => {
    const { id } = (await c.req.json()) as { id?: string };
    if (!isStr(id)) return bad(c, 'Room ID is required');
    const room = new RoomEntity(c.env, id);
    if (await room.exists()) {
        return bad(c, `Room ${id} already exists.`);
    }
    const newRoom = await RoomEntity.create(c.env, { id });
    return ok(c, newRoom);
  });
  app.put('/api/rooms/:id', async (c) => {
    const oldId = c.req.param('id');
    const { id: newId } = (await c.req.json()) as { id?: string };
    if (!isStr(newId)) return bad(c, 'New room ID is required');
    if (oldId === newId) {
        const room = new RoomEntity(c.env, oldId);
        return ok(c, await room.getState());
    }
    const oldRoom = new RoomEntity(c.env, oldId);
    if (!await oldRoom.exists()) {
        return notFound(c, `Room ${oldId} not found.`);
    }
    const newRoom = new RoomEntity(c.env, newId);
    if (await newRoom.exists()) {
        return bad(c, `Room ${newId} already exists.`);
    }
    await RoomEntity.delete(c.env, oldId);
    const updatedRoom = await RoomEntity.create(c.env, { id: newId });
    return ok(c, updatedRoom);
  });
  app.delete('/api/rooms/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await RoomEntity.delete(c.env, id);
    if (!deleted) {
        return notFound(c, `Room ${id} not found.`);
    }
    return ok(c, { id });
  });
  // SESSIONS
  app.get('/api/sessions', async (c) => {
    const sessionIndex = new Index<string>(c.env, 'breakfast_session_dates');
    const sessionDates = await sessionIndex.list();
    const sessions = await Promise.all(
      sessionDates.map(date => new BreakfastSessionEntity(c.env, date).getState())
    );
    return ok(c, sessions.filter(s => s.checkIns.length > 0)); // Only return sessions with check-ins
  });
  app.get('/api/sessions/today', async (c) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const session = new BreakfastSessionEntity(c.env, today);
    if (!await session.exists()) {
      await session.save({ date: today, checkIns: [] });
      // Add to index of sessions
      const sessionIndex = new Index<string>(c.env, 'breakfast_session_dates');
      await sessionIndex.add(today);
    }
    const data = await session.getState();
    return ok(c, data);
  });
  app.post('/api/sessions/:date/check-in', async (c) => {
    const date = c.req.param('date');
    const { roomNumber } = (await c.req.json()) as { roomNumber?: string };
    if (!isStr(roomNumber)) {
      return bad(c, 'roomNumber is required');
    }
    // Validate room exists
    const room = new RoomEntity(c.env, roomNumber);
    if (!await room.exists()) {
        return notFound(c, `Room ${roomNumber} not found. Please add it in 'Manage Rooms'.`);
    }
    const session = new BreakfastSessionEntity(c.env, date);
    if (!await session.exists()) {
      return notFound(c, `Session for date ${date} not found.`);
    }
    try {
      const record = await session.addCheckIn(roomNumber);
      return ok(c, record);
    } catch (error: any) {
      return bad(c, error.message);
    }
  });
}