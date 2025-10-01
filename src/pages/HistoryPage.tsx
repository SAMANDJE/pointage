import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Loader2, Calendar, Users, FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { BreakfastSession } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToPDF, exportToExcel } from '@/lib/reporting';
import { cn } from '@/lib/utils';
export function HistoryPage() {
  const [sessions, setSessions] = useState<BreakfastSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<BreakfastSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const fetchedSessions = await api<BreakfastSession[]>('/api/sessions');
        const sortedSessions = fetchedSessions.sort((a, b) => b.date.localeCompare(a.date));
        setSessions(sortedSessions);
        if (sortedSessions.length > 0) {
          setSelectedSession(sortedSessions[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch history.');
        toast.error(err.message || 'Failed to fetch history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  const sortedCheckIns = selectedSession ? [...selectedSession.checkIns].sort((a, b) => a.timestamp - b.timestamp) : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">History & Reports</h1>
        <p className="text-md md:text-lg text-gray-500 dark:text-gray-400">Browse and export reports from previous days.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Past Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[40vh] lg:h-[60vh]">
              <div className="space-y-2 pr-4">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <button
                      key={session.date}
                      onClick={() => setSelectedSession(session)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors duration-200 flex justify-between items-center',
                        selectedSession?.date === session.date
                          ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      )}
                    >
                      <span>{format(new Date(session.date.replace(/-/g, '/')), 'MMMM d, yyyy')}</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{session.checkIns.length} guests</span>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 p-4">No history found.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
          {selectedSession ? (
            <>
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">
                      Report for {format(new Date(selectedSession.date.replace(/-/g, '/')), 'MMMM d, yyyy')}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <FileDown className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => exportToPDF(selectedSession)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToExcel(selectedSession)}>
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export as Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-6 h-6 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold">{format(new Date(selectedSession.date.replace(/-/g, '/')), 'EEEE')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Users className="w-6 h-6 text-amber-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Guests</p>
                      <p className="font-semibold">{selectedSession.checkIns.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Check-in Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[45vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room Number</TableHead>
                          <TableHead>Check-in Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedCheckIns.map((record) => (
                          <TableRow key={record.roomNumber}>
                            <TableCell className="font-medium">{record.roomNumber}</TableCell>
                            <TableCell>{format(new Date(record.timestamp), 'p')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg p-8 min-h-[300px]">
              <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Select a date</h2>
              <p className="text-gray-500 dark:text-gray-400">Choose a date from the list to view the report.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}