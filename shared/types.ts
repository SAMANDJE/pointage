export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Room {
  id: string; // Room number, e.g., "101"
}
export interface CheckInRecord {
  roomNumber: string;
  timestamp: number; // epoch millis
}
export interface BreakfastSession {
  date: string; // YYYY-MM-DD format
  checkIns: CheckInRecord[];
}