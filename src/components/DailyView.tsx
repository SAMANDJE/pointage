import { useState, useRef, FormEvent, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Users, FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { useRoomStore } from '@/lib/roomStore';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Combobox } from '@/components/ui/combobox';
import { toast } from 'sonner';
import type { CheckInRecord } from '@shared/types';
import { exportToPDF, exportToExcel } from '@/lib/reporting';
export function DailyView() {
  const session = useSessionStore((state) => state.session);
  const addCheckIn = useSessionStore((state) => state.addCheckIn);
  const { rooms, fetchRooms, isLoading: roomsLoading } = useRoomStore();
  const [roomNumber, setRoomNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    // Fetch rooms if they are not already loaded
    if (rooms.length === 0) {
      fetchRooms();
    }
  }, [rooms.length, fetchRooms]);
  const roomOptions = useMemo(() => {
    const checkedInRooms = new Set(session?.checkIns.map(c => c.roomNumber));
    return rooms
      .filter(room => !checkedInRooms.has(room.id))
      .map(room => ({ value: room.id, label: room.id }));
  }, [rooms, session?.checkIns]);
  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }
  const handleCheckIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newRecord = await api<CheckInRecord>(`/api/sessions/${session.date}/check-in`, {
        method: 'POST',
        body: JSON.stringify({ roomNumber: roomNumber.trim() }),
      });
      addCheckIn(newRecord);
      toast.success(`Room ${roomNumber} checked in successfully.`);
      setRoomNumber('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to check in room.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const sortedCheckIns = [...session.checkIns].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">Today's Service</h1>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-400">
            {format(new Date(session.date.replace(/-/g, '/')), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Card className="flex-1 md:flex-auto bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Guests Served</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{session.checkIns.length}</div>
            </CardContent>
          </Card>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-full md:h-12 px-4 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
                <FileDown className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToPDF(session)}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToExcel(session)}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row items-center gap-4">
            <Combobox
              options={roomOptions}
              value={roomNumber}
              onChange={setRoomNumber}
              placeholder="Select a room..."
              searchPlaceholder="Search room number..."
              emptyMessage={roomsLoading ? "Loading rooms..." : "No available rooms found."}
              className="text-lg h-12 flex-1 w-full"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !roomNumber.trim()}
              className="h-12 px-6 text-lg bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-amber-400 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Check In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Checked-In Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                  <TableHead className="w-[200px]">Room Number</TableHead>
                  <TableHead>Check-in Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedCheckIns.length > 0 ? (
                    sortedCheckIns.map((record) => (
                      <motion.tr
                        key={record.roomNumber}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="dark:border-gray-700"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-200">{record.roomNumber}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{format(new Date(record.timestamp), 'p')}</TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center text-gray-500 dark:text-gray-400">
                        No rooms checked in yet.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}