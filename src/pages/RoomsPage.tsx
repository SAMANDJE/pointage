import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, BedDouble, X } from 'lucide-react';
import { useRoomStore } from '@/lib/roomStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Room } from '@shared/types';
export function RoomsPage() {
  const { rooms, isLoading, error, fetchRooms, addRoom, updateRoom, deleteRoom } = useRoomStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomNumber, setRoomNumber] = useState('');
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);
  const handleOpenDialog = (room: Room | null = null) => {
    setCurrentRoom(room);
    setRoomNumber(room ? room.id : '');
    setIsDialogOpen(true);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      toast.error('Room number cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (currentRoom) {
        await updateRoom(currentRoom.id, roomNumber.trim());
        toast.success(`Room ${currentRoom.id} updated to ${roomNumber.trim()}.`);
      } else {
        await addRoom(roomNumber.trim());
        toast.success(`Room ${roomNumber.trim()} added successfully.`);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteRoom(id);
      toast.success(`Room ${id} deleted successfully.`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">Manage Rooms</h1>
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-400">Add, edit, or delete hotel room numbers.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-amber-400 text-gray-900 hover:bg-amber-500">
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Room List</CardTitle>
          <CardDescription>A total of {rooms.length} rooms are configured.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700/50">
                  <TableHead>Room Number</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : rooms.length > 0 ? (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(room)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete room {room.id}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(room.id)} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-gray-500">
                      <BedDouble className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      No rooms found. Add a new room to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {currentRoom ? `Update the number for room ${currentRoom.id}.` : 'Enter the new room number below.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-number" className="text-right">
                  Room Number
                </Label>
                <Input
                  id="room-number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="bg-amber-400 text-gray-900 hover:bg-amber-500">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {currentRoom ? 'Save Changes' : 'Add Room'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}