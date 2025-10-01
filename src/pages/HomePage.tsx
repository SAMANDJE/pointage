import { useEffect, useCallback } from 'react';
import { useSessionStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { DailyView } from '@/components/DailyView';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Hotel } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BreakfastSession } from '@shared/types';
export function HomePage() {
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);
  const error = useSessionStore((state) => state.error);
  const initializeSession = useSessionStore((state) => state.initializeSession);
  const setLoading = useSessionStore((state) => state.setLoading);
  const setError = useSessionStore((state) => state.setError);
  const startNewDay = useCallback(async () => {
    setLoading(true);
    try {
      const todaySession = await api<BreakfastSession>('/api/sessions/today');
      initializeSession(todaySession);
    } catch (err: any) {
      setError(err.message || 'Failed to start new day.');
    }
  }, [initializeSession, setLoading, setError]);
  useEffect(() => {
    if (!session) {
      startNewDay();
    }
  }, [session, startNewDay]);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading today's service...</p>
      </div>
    );
  }
  if (error && !session) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={startNewDay} className="bg-amber-400 hover:bg-amber-500 text-gray-900">
          Retry
        </Button>
      </div>
    );
  }
  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-4"
      >
        <div className="w-24 h-24 bg-amber-400 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-400/30">
          <Hotel className="w-12 h-12 text-gray-800" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
          Welcome to Aurore
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-8">
          The breakfast service for today has not been started yet. Click the button below to begin.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="lg"
              className="px-8 py-6 text-lg md:text-xl font-semibold bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-amber-400 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Start Today's Breakfast
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Start of Service</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to start the breakfast service for today? This action will create a new session and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={startNewDay} className="bg-amber-400 text-gray-900 hover:bg-amber-500">
                Confirm & Start
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    );
  }
  return <DailyView />;
}